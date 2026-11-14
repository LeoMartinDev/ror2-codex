import { z } from 'zod'
import { COLOR_BUCKETS, EFFECT_FILTERS, EFFECT_FILTER_BY_ID, RARITY_ORDER, TIER_OF, normalizeEffectIds } from './catalog'
import type { Item } from './types'

/** URL search params. Lists are comma-separated to keep URLs readable. */
export const searchSchema = z.object({
  q: z.string().optional(),
  r: z.string().optional(), // rarities
  c: z.string().optional(), // colour buckets
  // effect filters (EFFECT_FILTERS); old ids from shared links are mapped to their new filter
  t: z
    .string()
    .transform((v) => joinList(normalizeEffectIds(list(v))))
    .optional(),
  tm: z.enum(['any', 'all']).optional(), // tag match mode
  d: z.string().optional(), // DLCs
  k: z.enum(['item', 'equipment']).optional(),
  s: z.enum(['rarity', 'name', 'color']).optional(),
  item: z.string().optional(),
})
export type Search = z.infer<typeof searchSchema>

export const list = (v?: string) => (v ? v.split(',').filter(Boolean) : [])
export const joinList = (v: string[]) => (v.length ? v.join(',') : undefined)

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')
}

const searchIndex = new WeakMap<Item, string>()
function haystack(it: Item) {
  let h = searchIndex.get(it)
  if (!h) {
    h = normalize([it.name.fr, it.name.en, it.pickup.fr, it.pickup.en, it.desc.fr, it.desc.en].join(' | '))
    searchIndex.set(it, h)
  }
  return h
}
function nameHaystack(it: Item) {
  return normalize(`${it.name.fr} ${it.name.en}`)
}

type Group = 'q' | 'r' | 'c' | 't' | 'd' | 'k'

/** Applies every filter except `skip` (used to compute chip counts). */
export function matches(it: Item, s: Search, skip?: Group): boolean {
  if (skip !== 'k' && s.k && it.kind !== s.k) return false
  const r = list(s.r)
  if (skip !== 'r' && r.length && !r.includes(TIER_OF[it.rarity])) return false
  const c = list(s.c)
  if (skip !== 'c' && c.length && !c.includes(it.colorBucket)) return false
  const d = list(s.d)
  if (skip !== 'd' && d.length && !d.includes(it.dlc)) return false
  const t = list(s.t)
  if (skip !== 't' && t.length) {
    const hit = (id: string) => EFFECT_FILTER_BY_ID[id]?.test(it) ?? false
    const ok = s.tm === 'all' ? t.every(hit) : t.some(hit)
    if (!ok) return false
  }
  if (skip !== 'q' && s.q?.trim()) {
    const words = normalize(s.q).split(/\s+/).filter(Boolean)
    const h = haystack(it)
    if (!words.every((w) => h.includes(w))) return false
  }
  return true
}

const COLOR_ORDER = Object.fromEntries(COLOR_BUCKETS.map((c, i) => [c.id, i]))

function hue(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  if (!d) return 0
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  h *= 60
  return h < 0 ? h + 360 : h
}

export function sortItems(items: Item[], s: Search, lang: 'fr' | 'en' = 'fr'): Item[] {
  const by = s.s ?? 'rarity'
  const q = s.q?.trim() ? normalize(s.q) : ''
  const copy = [...items]
  copy.sort((a, b) => {
    // When searching, name matches come first.
    if (q) {
      const an = nameHaystack(a).includes(q) ? 0 : 1
      const bn = nameHaystack(b).includes(q) ? 0 : 1
      if (an !== bn) return an - bn
    }
    if (by === 'rarity') {
      const d = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]
      if (d) return d
    } else if (by === 'color') {
      const d = (COLOR_ORDER[a.colorBucket] ?? 99) - (COLOR_ORDER[b.colorBucket] ?? 99)
      if (d) return d
      const h = hue(a.color) - hue(b.color)
      if (h) return h
    }
    return a.name[lang].localeCompare(b.name[lang], lang)
  })
  return copy
}

/** Effect filter ids an item matches (for the dropdown counts). */
export const effectIds = (it: Item) => EFFECT_FILTERS.filter((f) => f.test(it)).map((f) => f.id)

export function countBy(items: Item[], s: Search, group: Group, key: (it: Item) => string[]) {
  const out: Record<string, number> = {}
  for (const it of items) {
    if (!matches(it, s, group)) continue
    for (const k of key(it)) out[k] = (out[k] ?? 0) + 1
  }
  return out
}
