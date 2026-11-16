import { LIMITS, type Build } from './builds'
import { ITEMS } from './items'
import { itemSlug } from './slug'
import { SURVIVORS, type SurvivorId } from './survivors'
import type { Item } from './types'

/**
 * Builds written by hand or by an AI agent: readable JSON where items and survivors are named
 * (French or English game names, ids or URL slugs all work). Used by the readable link
 * /builds/view?b=<json>, the /api/builds endpoint and `bun run build-link`.
 * The format is documented for agents in src/routes/llms[.]txt.ts.
 *
 * {
 *   "name": "Automatic doll",                     // required
 *   "survivor": "Commando",                       // omit or "generic" for a generic build
 *   "tagline": "…", "tag": "…", "summary": "…",
 *   "skills": "Dice · Sear · Roll · Glaze",       // or { "label": "Build loop", "text": "…" }
 *   "items": ["Ukulele", { "item": "Polylute", "role": "×2 · repeated hits", "core": true }],  // required
 *   "howTo": ["One paragraph per entry."],        // or one string, one paragraph per line
 *   "synergies": [{ "items": ["Polylute", "57 Leaf Clover"], "text": "What they do together." }],
 *   "author": "Claude"
 * }
 */
export type BuildInputResult = {
  /** The build with everything that could be read; null when there is not even a name or an item. */
  build: Build | null
  /** One line per problem, with suggestions for unknown names. Empty when the build is valid. */
  errors: string[]
}

const key = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')

const PICKABLE = ITEMS.filter((x) => x.rarity !== 'untiered')
const ITEM_KEYS = new Map<string, Item>()
for (const it of PICKABLE)
  for (const n of [it.id, it.name.en, it.name.fr, it.wikiName, itemSlug(it)]) if (!ITEM_KEYS.has(key(n))) ITEM_KEYS.set(key(n), it)
const ITEM_NAMES = PICKABLE.flatMap((x) => [x.name.en, x.name.fr].map((n) => [n, x.name.en] as const))
const SURVIVOR_NAMES = SURVIVORS.flatMap((x) => [x.name.en, x.name.fr, x.id].map((n) => [n, x.name.en] as const))

function distance(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[b.length]
}

/** Close names for a typo ("Ukelele") or a half-remembered name ("bandeau de runald"). */
export function suggest(name: string, candidates: readonly (readonly [label: string, answer: string])[]): string[] {
  const k = key(name)
  const words = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4)
  return [
    ...new Set(
      candidates
        .map(([label, answer]) => {
          const c = key(label)
          const score = c.includes(k) || k.includes(c) ? 0 : distance(k, c) <= Math.max(2, k.length / 4) ? distance(k, c) : words.some((w) => c.includes(w)) ? 10 : Infinity
          return { answer, score }
        })
        .filter((x) => x.score < Infinity)
        .sort((a, b) => a.score - b.score)
        .map((x) => x.answer),
    ),
  ].slice(0, 5)
}

export function findItem(name: string): Item | undefined {
  return ITEM_KEYS.get(key(name))
}

export function parseBuildInput(input: unknown): BuildInputResult {
  const errors: string[] = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { build: null, errors: ['The build must be a JSON object.'] }
  const o = input as Record<string, any>

  const item = (name: unknown, where: string): Item | undefined => {
    if (typeof name !== 'string' || !name.trim()) return void errors.push(`${where}: expected an item name, got ${JSON.stringify(name)}`)
    const it = findItem(name)
    if (it) return it
    const close = suggest(name, ITEM_NAMES)
    errors.push(`${where}: unknown item "${name}"${close.length ? ` — did you mean ${close.map((n) => `"${n}"`).join(', ')}?` : ''}`)
  }

  const text = (v: unknown, where: string, max: number, required = false): string | undefined => {
    if (v === undefined || v === null || v === '') return void (required && errors.push(`${where}: required`))
    if (typeof v !== 'string') return void errors.push(`${where}: expected a string`)
    if (v.trim().length > max) errors.push(`${where}: ${v.trim().length} characters, max ${max}`)
    return v.trim().slice(0, max)
  }

  let survivor: SurvivorId | null = null
  const sv = o.survivor
  if (typeof sv === 'string' && !['', 'generic', 'generique', 'none'].includes(key(sv))) {
    const s = SURVIVORS.find((x) => [x.id, x.name.en, x.name.fr, x.wiki].some((n) => key(n) === key(sv)))
    if (s) survivor = s.id
    else {
      const close = suggest(sv, SURVIVOR_NAMES)
      errors.push(`survivor: unknown "${sv}" — ${close.length ? `did you mean "${close[0]}"?` : `one of ${SURVIVORS.map((x) => x.name.en).join(', ')}, or "generic"`}`)
    }
  } else if (sv !== undefined && sv !== null && typeof sv !== 'string') errors.push('survivor: expected a name or "generic"')

  const items: Build['items'] = []
  const rawItems: unknown[] = Array.isArray(o.items) ? o.items : []
  if (!rawItems.length) errors.push('items: a non-empty list is required')
  for (const [i, raw] of rawItems.entries()) {
    const entry: Record<string, any> = typeof raw === 'string' ? { item: raw } : raw && typeof raw === 'object' ? raw : {}
    const it = item(entry.item ?? entry.name ?? entry.id, `items[${i}]`)
    if (!it) continue
    if (items.some((x) => x.id === it.id)) {
      errors.push(`items[${i}]: "${it.name.en}" is listed twice`)
      continue
    }
    items.push({ id: it.id, role: text(entry.role, `items[${i}].role`, LIMITS.line), core: entry.core ? true : undefined })
  }
  if (items.length > LIMITS.items) errors.push(`items: ${items.length} items, max ${LIMITS.items}`)

  const howToRaw: unknown[] = typeof o.howTo === 'string' ? o.howTo.split(/\n+/) : Array.isArray(o.howTo) ? o.howTo : []
  const howTo = howToRaw.map((h, i) => text(h, `howTo[${i}]`, LIMITS.text)).filter((h): h is string => !!h)
  if (howTo.length > LIMITS.howTo) errors.push(`howTo: ${howTo.length} paragraphs, max ${LIMITS.howTo}`)

  const synergies: Build['synergies'] = []
  for (const [i, s] of (Array.isArray(o.synergies) ? o.synergies : []).entries()) {
    const ids = (Array.isArray(s?.items) ? s.items : [])
      .map((n: unknown, j: number) => item(n, `synergies[${i}].items[${j}]`)?.id)
      .filter((id: string | undefined): id is string => !!id)
    for (const id of ids) if (!items.some((x) => x.id === id)) errors.push(`synergies[${i}]: "${id}" is not one of the build's items`)
    const t = text(s?.text, `synergies[${i}].text`, LIMITS.text, true)
    if (t) synergies.push({ items: ids.filter((id: string) => items.some((x) => x.id === id)), text: t })
  }
  if (synergies.length > LIMITS.synergies) errors.push(`synergies: ${synergies.length}, max ${LIMITS.synergies}`)

  const sk = typeof o.skills === 'string' ? { text: o.skills } : o.skills && typeof o.skills === 'object' ? o.skills : undefined
  const skillsText = sk ? text(sk.text, 'skills.text', LIMITS.text) : undefined
  const name = text(o.name, 'name', LIMITS.name, true)

  const build: Build | null =
    name || items.length
      ? {
          name: name ?? '',
          survivor,
          tagline: text(o.tagline, 'tagline', LIMITS.line),
          tag: text(o.tag, 'tag', LIMITS.line),
          summary: text(o.summary, 'summary', LIMITS.text),
          skills: skillsText ? { label: text(sk.label, 'skills.label', LIMITS.line), text: skillsText } : undefined,
          items: items.slice(0, LIMITS.items),
          howTo: howTo.slice(0, LIMITS.howTo),
          synergies: synergies.slice(0, LIMITS.synergies),
          author: text(o.author, 'author', LIMITS.author),
        }
      : null
  return { build, errors }
}

/** The readable link format, from any JSON value or string. */
export function parseBuildParam(b: unknown): BuildInputResult {
  if (typeof b === 'string') {
    try {
      return parseBuildInput(JSON.parse(b))
    } catch (e) {
      return { build: null, errors: [`The "b" parameter is not valid JSON: ${(e as Error).message}`] }
    }
  }
  return parseBuildInput(b)
}

// ---------------------------------------------------------------- text encodings

/** Windows-1252 characters in 0x80-0x9F (the rest of the range 0x80-0xFF matches Unicode). */
const CP1252: Record<number, number> = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6,
  0x89: 0x2030, 0x8a: 0x0160, 0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201c,
  0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a,
  0x9c: 0x0153, 0x9e: 0x017e, 0x9f: 0x0178,
}

/**
 * UTF-8, or Windows-1252 when the bytes are not valid UTF-8. Agents running in a Windows shell often
 * send accented text that way ("dégâts" as %E9…), which would otherwise turn into "d�g�ts".
 */
export function decodeText(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return String.fromCharCode(...Array.from(bytes, (b) => CP1252[b] ?? b))
  }
}

/** One query parameter, read from the raw query string with decodeText (URLSearchParams assumes UTF-8). */
export function queryParam(search: string, name: string): string | null {
  for (const part of search.replace(/^\?/, '').split('&')) {
    const eq = part.indexOf('=')
    if ((eq < 0 ? part : part.slice(0, eq)) !== name) continue
    const raw = eq < 0 ? '' : part.slice(eq + 1).replace(/\+/g, ' ')
    const bytes: number[] = []
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === '%' && /^[0-9a-f]{2}$/i.test(raw.slice(i + 1, i + 3))) {
        bytes.push(parseInt(raw.slice(i + 1, i + 3), 16))
        i += 2
      } else bytes.push(...new TextEncoder().encode(raw[i]))
    }
    return decodeText(new Uint8Array(bytes))
  }
  return null
}
