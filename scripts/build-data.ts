/**
 * Generates src/data/items.json from:
 *  - the game's language files (official FR + EN names/descriptions),
 *  - the RoR2 wiki data modules (rarity, DLC, categories, stacking stats),
 *  - data/overrides.json and data/stat-labels.fr.json (hand-curated corrections / translations),
 *  - wiki icons (downloaded once to public/icons, dominant colour cached in .cache/colors.json).
 *
 * Usage: bun run data [--refresh]   (ROR2_LANG_DIR overrides the language folder)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseLuaAssignments, luaArray, type LuaTable, type LuaValue } from './lib/lua'
import { loadLanguage, DEFAULT_LANG_DIR } from './lib/lang'
import { wikiToRich, richToPlain } from './lib/wikitext'
import { resolveFileUrls, download, dominantColor, readJson, writeJson, COLOR_ALGO_VERSION } from './lib/icons'
import { TAGS } from '../src/lib/catalog'
import type { DlcId, Item, RarityId, Stacking, StackModel } from '../src/lib/types'

const ROOT = join(import.meta.dir, '..')
const CACHE = join(ROOT, '.cache')
const ICONS = join(ROOT, 'public', 'icons')
const OUT = join(ROOT, 'src', 'data', 'items.json')
const refresh = process.argv.includes('--refresh')
mkdirSync(CACHE, { recursive: true })
mkdirSync(ICONS, { recursive: true })
mkdirSync(join(ROOT, 'src', 'data'), { recursive: true })

// ---------------------------------------------------------------- sources
async function wikiModule(name: string): Promise<string> {
  const file = join(CACHE, `${name.replace(/\W/g, '_')}.lua`)
  if (!refresh && existsSync(file)) return readFileSync(file, 'utf8')
  const res = await fetch(`https://riskofrain2.wiki.gg/wiki/Module:${name}?action=raw`, {
    headers: { 'User-Agent': 'ror2-codex-data-script/0.1' },
  })
  if (!res.ok) throw new Error(`Cannot fetch Module:${name} (${res.status})`)
  const text = await res.text()
  writeFileSync(file, text)
  return text
}

const langDir = process.env.ROR2_LANG_DIR ?? DEFAULT_LANG_DIR
console.log(`Langues : ${langDir}`)
const FR = loadLanguage(join(langDir, 'FR'))
const EN = loadLanguage(join(langDir, 'en'))
const enNameToToken = new Map<string, string>()
for (const [k, v] of EN) if (k.endsWith('_NAME')) enNameToToken.set(v.trim().toLowerCase(), k.slice(0, -5))

const wikiItems = parseLuaAssignments(await wikiModule('Items/Data'), 'items')
const wikiEquip = parseLuaAssignments(await wikiModule('Equipment/Data'), 'equipment')
console.log(`Wiki : ${Object.keys(wikiItems).length} objets, ${Object.keys(wikiEquip).length} équipements`)

type StackOverride = Partial<Omit<Stacking, 'stat' | 'note'>> & {
  stat?: string
  index?: number
  note?: string
  remove?: boolean
  /** New English stat name (translated through stat-labels.fr.json). */
  rename?: string
  /** JS expression of n, evaluated at build time for model "table". */
  expr?: string
}

function tableFromExpr(expr: string): number[] {
  const fn = new Function('n', `return (${expr})`) as (n: number) => number
  return Array.from({ length: 100 }, (_, i) => Math.round(fn(i + 1) * 1e4) / 1e4)
}
type Override = {
  rarity?: RarityId
  dlc?: DlcId
  exclude?: boolean
  token?: string
  icon?: string
  tagsAdd?: string[]
  tagsRemove?: string[]
  stacking?: StackOverride[]
  addStacking?: (StackOverride & { stat: string; model: StackModel })[]
  limit?: string
  luck?: 'affected' | 'unaffected' | null
  procCoefficient?: number
  totalDamage?: boolean
  explain?: string
  links?: { kind: 'boost' | 'combo' | 'none'; id: string; why: string }[]
  /** Colour filter bucket, when the icon analysis gets it wrong (see dominantColor). */
  colorBucket?: string
}
const overridesRaw = readJson<Record<string, Override>>(join(ROOT, "data", "overrides.json"), {})
const statLabels = readJson<Record<string, string>>(join(ROOT, 'data', 'stat-labels.fr.json'), {})
/** English versions of the hand-written French texts of overrides.json, same keys. */
type EnText = { explain?: string; limit?: string; notes?: Record<string, string>; links?: Record<string, string> }
const enTextsRaw = readJson<Record<string, EnText>>(join(ROOT, 'data', 'overrides.en.json'), {})
// One cache file per algorithm version, so changing dominantColor recomputes every icon.
const COLOR_CACHE = join(CACHE, `colors.v${COLOR_ALGO_VERSION}.json`)
const colorCache = readJson<Record<string, { color: string; bucket: string }>>(COLOR_CACHE, {})

// ---------------------------------------------------------------- helpers
const str = (v: LuaValue | undefined) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '')
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const RARITY_MAP: Record<string, RarityId> = {
  Common: 'white',
  Uncommon: 'green',
  Legendary: 'red',
  Boss: 'boss',
  Lunar: 'lunar',
  Hallowed: 'hallowed',
  Hex: 'hex',
  Page: 'page',
  Meal: 'meal',
  Equipment: 'equipment',
  'Lunar Equipment': 'lunar-equipment',
  'Elite Equipment': 'elite',
  Untiered: 'untiered',
  'Untiered (Legendary)': 'untiered',
}
const VOID_FROM: Record<string, RarityId> = { Common: 'void-white', Uncommon: 'void-green', Legendary: 'void-red', Boss: 'void-boss' }
const DLC_MAP: Record<string, DlcId> = { SotV: 'sotv', SotS: 'sots', AC: 'ac', HC: 'hc' }

function parseNum(s: string): { n: number; unit: string } {
  const m = /([+-]?)\s*(\d+(?:\.\d+)?)\s*(%|seconds?|s\b|m\b|x\b|hp\b)?/i.exec(s)
  if (!m) return { n: NaN, unit: '' }
  let unit = (m[3] ?? '').toLowerCase()
  if (unit.startsWith('second')) unit = 's'
  return { n: (m[1] === '-' ? -1 : 1) * Number(m[2]), unit }
}

function buildStacking(stat: LuaTable): Stacking | 'proc' | null {
  const name = str(stat.Stat).trim()
  const kind = str(stat.Stack).trim()
  const rawValue = str(stat.Value).trim()
  const rawAdd = str(stat.Add).trim()
  if (kind === 'ProcCoeff') return 'proc'
  if (!name) return null
  const v = parseNum(rawValue)
  const a = parseNum(rawAdd)
  const unit = v.unit || a.unit
  const team = /team/i.test(rawAdd)
  let model: StackModel = 'special'
  let base = v.n
  let add = a.n
  let cap: number | undefined
  const pct = unit === '%'

  if (Number.isNaN(base)) model = 'special'
  else if (kind === 'None') model = 'none'
  else if (kind === 'Linear' && !Number.isNaN(add)) {
    model = 'linear'
    // Wiki writes "15%" for "+15%" sometimes; descriptions with "-" are negative stacks.
    if (!/^[+-]/.test(rawAdd) && base < 0) add = -Math.abs(add)
    if (pct && /chance/i.test(name) && base > 0 && add > 0) cap = 100
  } else if (kind === 'Hyperbolic' && !Number.isNaN(add)) {
    if (v.unit === '%') {
      model = 'hyperbolic'
      add = Math.abs(add)
      base = Math.abs(base)
    } else {
      model = 'reciprocal'
      add = Math.abs(add) / (a.unit === '%' ? 100 : 1)
    }
  } else if (kind === 'Exponential' && !Number.isNaN(add)) {
    const addFrac = a.unit === '%' || pct ? add / 100 : add
    if (v.unit === '%') {
      if (base < 0 || add < 0 || /reduc|cooldown|most/i.test(name)) {
        model = 'compound'
        add = Math.abs(addFrac)
        if (base > 0 && add > 0 && /reduc|cooldown/i.test(name)) base = Math.abs(base)
      } else {
        model = 'multiplier'
        add = addFrac
      }
    } else if (a.unit === '%') {
      model = 'geometric'
      add = addFrac
    }
  } else if (kind === 'Reciprocal' && !Number.isNaN(add)) {
    model = 'reciprocal'
    add = a.unit === '%' ? add / 100 : add
  }
  if (model === 'special') {
    base = Number.isNaN(base) ? 0 : base
    add = Number.isNaN(add) ? 0 : add
  }
  if (model === 'none') add = 0
  return {
    stat: { fr: statLabels[name] ?? name, en: name },
    model,
    base,
    add,
    unit: unit === 'hp' ? ' PV' : unit,
    ...(cap !== undefined ? { cap } : {}),
    raw: { value: rawValue, add: rawAdd },
    ...(team ? { team } : {}),
  }
}

function text(token: string, suffix: string, lang: Map<string, string>): string | undefined {
  return lang.get(`${token}_${suffix}`)?.trim()
}

// ---------------------------------------------------------------- build
const overrides: Record<string, Override> = Object.fromEntries(
  Object.entries(overridesRaw).map(([k, v]) => [slug(k), v]),
)
const enTexts: Record<string, EnText> = Object.fromEntries(Object.entries(enTextsRaw).map(([k, v]) => [slug(k), v]))
const report = {
  missingEn: 0,
  noToken: [] as string[],
  noFr: [] as string[],
  noIcon: [] as string[],
  untranslatedStats: new Set<string>(),
  special: [] as string[],
  tokenFixed: [] as string[],
}
const items: Item[] = []
const entries: [string, LuaTable, 'item' | 'equipment'][] = [
  ...Object.entries(wikiItems).map(([k, v]) => [k, v, 'item'] as [string, LuaTable, 'item']),
  ...Object.entries(wikiEquip).map(([k, v]) => [k, v, 'equipment'] as [string, LuaTable, 'equipment']),
]
const byWikiName = new Map(entries.map(([k, v]) => [k, v]))
const primaryTokens = new Set(
  entries.filter(([, v]) => !str(v.Rarity).startsWith('Untiered')).map(([, v]) => str(v.LocalizationInternalName)),
)

for (const [wikiName, w, kind] of entries) {
  const rarityRaw = str(w.Rarity)
  const id = str(w.ID) || slug(wikiName)
  const ov = overrides[slug(id)] ?? {}
  const en = enTexts[slug(id)] ?? {}
  const loc = (fr: string, enText?: string) => {
    if (!enText) report.missingEn++
    return { fr, en: enText ?? fr }
  }
  if (ov.exclude || w.Unused === true || rarityRaw.startsWith('Unused')) continue

  // Token: wiki value if valid, else lookup by English name.
  let token = ov.token ?? str(w.LocalizationInternalName)
  const byName = enNameToToken.get(wikiName.toLowerCase())
  if (!ov.token && byName && EN.get(`${token}_NAME`)?.trim().toLowerCase() !== wikiName.toLowerCase()) {
    if (EN.has(`${token}_NAME`)) report.tokenFixed.push(`${wikiName}: ${token} → ${byName}`)
    token = byName
  }
  if (rarityRaw.startsWith('Untiered') && primaryTokens.has(token)) continue // duplicate of a tiered entry
  const hasLang = EN.has(`${token}_NAME`)
  if (!hasLang && rarityRaw.startsWith('Untiered')) continue // internal hidden items
  if (!hasLang) report.noToken.push(`${wikiName} (${id})`)

  let rarity: RarityId | undefined = ov.rarity ?? RARITY_MAP[rarityRaw]
  if (!rarity && rarityRaw === 'Void') {
    const unc = w.Uncorrupt
    const first = typeof unc === 'string' ? unc : str(luaArray(unc)[0])
    const src = byWikiName.get(first.split(',')[0].trim())
    rarity = VOID_FROM[str(src?.Rarity)] ?? 'void-white'
  }
  if (!rarity) {
    console.warn(`  ! rareté inconnue "${rarityRaw}" pour ${wikiName}`)
    rarity = 'untiered'
  }
  if (kind === 'equipment' && ['white', 'green', 'red', 'boss', 'lunar'].includes(rarity)) {
    // A few entries in the equipment module carry item tiers; treat them as standard equipment.
    rarity = rarityRaw === 'Lunar' ? 'lunar-equipment' : 'equipment'
  }

  const wikiDesc = wikiToRich(str(w.Desc))
  const wikiPickup = wikiToRich(str(w.Quote))
  const looksLikeToken = (s: string) => /^[A-Z0-9_]+$/.test(s)
  const name = {
    en: text(token, 'NAME', EN) ?? wikiName,
    fr: text(token, 'NAME', FR) ?? text(token, 'NAME', EN) ?? wikiName,
  }
  const descEn = text(token, 'DESC', EN) ?? (looksLikeToken(wikiDesc) ? '' : wikiDesc)
  const pickupEn = text(token, 'PICKUP', EN) ?? (looksLikeToken(wikiPickup) ? '' : wikiPickup)
  const desc = { en: descEn, fr: text(token, 'DESC', FR) ?? descEn }
  const pickup = { en: pickupEn, fr: text(token, 'PICKUP', FR) ?? pickupEn }
  if (hasLang && !FR.has(`${token}_DESC`)) report.noFr.push(wikiName)

  // Stacking
  let procCoefficient: number | undefined
  let stacking: Stacking[] = []
  for (const s of luaArray(w.Stats)) {
    if (!s || typeof s !== 'object') continue
    const st = buildStacking(s)
    if (st === 'proc') {
      const n = Number(str(s.Value))
      if (!Number.isNaN(n)) procCoefficient = n
    } else if (st) stacking.push(st)
  }
  if (ov.procCoefficient !== undefined) procCoefficient = ov.procCoefficient
  for (const so of ov.stacking ?? []) {
    const idx = so.index ?? stacking.findIndex((s) => s.stat.en === so.stat)
    if (idx < 0 || !stacking[idx]) {
      console.warn(`  ! override stacking introuvable ${id} / ${so.stat ?? so.index}`)
      continue
    }
    if (so.remove) {
      stacking[idx] = null as any
      continue
    }
    const { index: _i, stat: _s, note, remove: _r, rename, expr, ...rest } = so
    const next: Stacking = { ...stacking[idx], ...rest, ...(note ? { note: loc(note, en.notes?.[rename ?? so.stat ?? '']) } : {}) }
    if (rename) next.stat = { fr: statLabels[rename] ?? rename, en: rename }
    if (expr) next.values = tableFromExpr(expr)
    stacking[idx] = next
  }
  stacking = stacking.filter(Boolean)
  for (const add of ov.addStacking ?? []) {
    const { stat, note, index: _i, remove: _r, ...rest } = add
    stacking.push({
      stat: { fr: statLabels[stat] ?? stat, en: stat },
      base: 0,
      add: 0,
      unit: '',
      raw: { value: '', add: '' },
      ...rest,
      ...(note ? { note: loc(note, en.notes?.[stat]) } : {}),
    } as Stacking)
  }
  for (const s of stacking) {
    if (!statLabels[s.stat.en]) report.untranslatedStats.add(s.stat.en)
    if (s.model === 'special') report.special.push(`${id}: ${s.stat.en} [${s.raw.value} | ${s.raw.add}]`)
  }

  // Tags
  const categories = luaArray(w.Category).map(str)
  const plain = richToPlain(desc.en).toLowerCase()
  const tags = new Set<string>()
  for (const t of TAGS) {
    if (t.categories?.some((c) => categories.includes(c))) tags.add(t.id)
    else if (t.match?.test(plain)) tags.add(t.id)
  }
  if (procCoefficient !== undefined && procCoefficient > 0) tags.add('on-hit')
  if (kind === 'equipment') tags.add('equipment')
  for (const t of ov.tagsAdd ?? []) tags.add(t)
  for (const t of ov.tagsRemove ?? []) tags.delete(t)

  // Hexes are curses: every stat hurts the holder.
  if (rarity === 'hex') for (const s of stacking) s.bad = true

  // Luck (57 Leaf Clover) rerolls failed chance rolls, except where the game says otherwise.
  const hasChance =
    stacking.some((s) => /chance/i.test(s.stat.en)) || /\d+(\.\d+)?% chance|chance to|chance on/.test(plain)
  const luck: Item['luck'] =
    ov.luck !== undefined
      ? ov.luck
      : rarity === 'hex'
        ? null
        : /unaffected by luck/.test(plain)
          ? 'unaffected'
          : hasChance
            ? 'affected'
            : null
  const totalDamage = ov.totalDamage ?? /total damage/.test(plain)

  const dlc: DlcId = ov.dlc ?? DLC_MAP[str(w.Expansion)] ?? 'base'
  const cd = typeof w.Cooldown === 'number' ? w.Cooldown : undefined
  const corrupt = typeof w.Corrupt === 'string' ? w.Corrupt : undefined
  const uncorrupt = typeof w.Uncorrupt === 'string' ? w.Uncorrupt : undefined

  items.push({
    id: slug(id),
    token,
    wikiName,
    name,
    pickup,
    desc,
    kind,
    rarity,
    dlc,
    color: '#888888',
    colorBucket: 'white',
    tags: [...tags],
    stacking,
    ...(procCoefficient !== undefined ? { procCoefficient } : {}),
    ...(cd !== undefined ? { cooldown: cd } : {}),
    ...(rarity.startsWith('void') && uncorrupt ? { corrupts: uncorrupt } : {}),
    ...(corrupt ? { corruptedBy: corrupt } : {}),
    ...(typeof w.Unlock === 'string' ? { unlock: w.Unlock } : {}),
    icon: ov.icon ?? null,
    luck,
    totalDamage,
    ...(ov.limit ? { limit: loc(ov.limit, en.limit) } : {}),
    ...(ov.explain ? { explain: loc(ov.explain, en.explain) } : {}),
    links: (ov.links ?? []).map((l) => ({ ...l, why: loc(l.why, en.links?.[l.id]) })),
  })
}

// Hand-written explanations sometimes cite items by their English name: use the French one.
const enToFr = items
  .filter((it) => it.name.en.length > 4 && it.name.en !== it.name.fr)
  .map((it) => [it.name.en, it.name.fr] as const)
  .sort((a, b) => b[0].length - a[0].length)
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
for (const it of items) {
  if (!it.explain) continue
  for (const [en, fr] of enToFr) it.explain.fr = it.explain.fr.replace(new RegExp(`\\b${escapeRe(en)}s?\\b`, 'g'), fr)
}

// Deduplicate ids (wiki sometimes reuses an internal ID).
const seen = new Map<string, number>()
for (const it of items) {
  const c = seen.get(it.id) ?? 0
  seen.set(it.id, c + 1)
  if (c) it.id = `${it.id}-${c + 1}`
}

// ---------------------------------------------------------------- icons + colours
const missingIcons = items.filter((it) => !existsSync(join(ICONS, `${it.id}.png`)))
if (missingIcons.length) {
  console.log(`Icônes : ${missingIcons.length} à télécharger…`)
  const titles = missingIcons.map((it) => overrides[it.id]?.icon ?? `${it.wikiName}.png`)
  const urls = await resolveFileUrls(titles)
  let i = 0
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (i < missingIcons.length) {
        const it = missingIcons[i]
        const title = titles[i++]
        const url = urls.get(title)
        if (url) await download(url, join(ICONS, `${it.id}.png`)).catch(() => false)
      }
    }),
  )
}
for (const it of items) {
  const file = join(ICONS, `${it.id}.png`)
  if (!existsSync(file)) {
    report.noIcon.push(`${it.wikiName} (${it.id})`)
    continue
  }
  it.icon = `/icons/${it.id}.png`
  if (refresh || !colorCache[it.id]) colorCache[it.id] = await dominantColor(file)
  it.color = colorCache[it.id].color
  it.colorBucket = overrides[it.id]?.colorBucket ?? colorCache[it.id].bucket
}
writeJson(COLOR_CACHE, colorCache)
// Remove icons that no longer belong to any entry.
const validIcons = new Set(items.map((it) => `${it.id}.png`))
for (const f of readdirSync(ICONS)) if (f.endsWith('.png') && !validIcons.has(f)) unlinkSync(join(ICONS, f))

// ---------------------------------------------------------------- output
items.sort((a, b) => a.name.fr.localeCompare(b.name.fr, 'fr'))
writeFileSync(OUT, JSON.stringify(items))
writeJson(join(CACHE, 'untranslated-stats.json'), [...report.untranslatedStats].sort())

const count = (key: keyof Item) =>
  Object.entries(
    items.reduce<Record<string, number>>((acc, it) => ((acc[String(it[key])] = (acc[String(it[key])] ?? 0) + 1), acc), {}),
  )
    .map(([k, v]) => `${k}=${v}`)
    .join(' ')
console.log(`\n✔ ${items.length} entrées → ${OUT}`)
console.log(`  rareté : ${count('rarity')}`)
console.log(`  DLC    : ${count('dlc')}`)
console.log(`  couleur: ${count('colorBucket')}`)
const show = (label: string, list: string[]) => list.length && console.log(`  ${label} (${list.length}) : ${list.join(', ')}`)
show('ℹ tokens corrigés', report.tokenFixed)
show('⚠ sans token de langue', report.noToken)
show('⚠ sans texte FR', report.noFr)
show('⚠ sans icône', report.noIcon)
if (report.untranslatedStats.size) console.log(`  ⚠ stats non traduites : ${report.untranslatedStats.size} (voir .cache/untranslated-stats.json)`)
if (report.special.length) console.log(`  ℹ stats « spéciales » : ${report.special.length}`)
