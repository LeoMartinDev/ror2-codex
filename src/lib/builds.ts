import { useCallback, useSyncExternalStore } from 'react'
import { z } from 'zod'
import { BY_ID } from './items'
import { isSurvivorId, type SurvivorId } from './survivors'
import type { Lang, Loc } from './types'

/**
 * A build: a direction for a run (items to gather, how to play them, why they work together).
 *
 * Official builds (src/data/builds.ts) are written in both languages, so their texts are `Loc`.
 * Builds made in the editor are written in one language, so their texts are plain strings.
 * Player builds have no server: they travel inside the link (see encodeBuild) and are kept in
 * the browser's localStorage ("My builds").
 */
export type Text = string | Loc

export type BuildItem = {
  id: string
  /** Why this item is here, how many copies ("×3 · keeps the buff up"). */
  role?: Text
  /** Needed for the build to work, as opposed to items that only make it better. */
  core?: boolean
}

/** A combo written by the author: the items involved and what they do together. */
export type SynergyNote = { items: string[]; text: Text }

export type Build = {
  name: Text
  /** null: generic build, playable with several survivors. */
  survivor: SurvivorId | null
  /** One punchy line under the name. */
  tagline?: Text
  /** Short badge: difficulty, requirements ("DLC required", "Easy to assemble"). */
  tag?: Text
  summary?: Text
  /** Skills to pick, or the loop the build runs on. */
  skills?: { label?: Text; text: Text }
  items: BuildItem[]
  /** "How to play", one paragraph per entry. */
  howTo: Text[]
  synergies: SynergyNote[]
  sources?: { label: string; url: string }[]
  author?: string
}

export type OfficialBuild = Build & { slug: string }

export const txt = (v: Text | undefined, lang: Lang): string => (v === undefined ? '' : typeof v === 'string' ? v : v[lang] || v.fr)

/** Same build with every text in one language, ready for the editor. Sources are not copied: links only carry text. */
export function flatten(b: Build, lang: Lang): Build {
  const t = (v: Text | undefined) => (v === undefined ? undefined : txt(v, lang))
  return {
    name: txt(b.name, lang),
    survivor: b.survivor,
    tagline: t(b.tagline),
    tag: t(b.tag),
    summary: t(b.summary),
    skills: b.skills && { label: t(b.skills.label), text: txt(b.skills.text, lang) },
    items: b.items.map((i) => ({ id: i.id, role: t(i.role), core: i.core })),
    howTo: b.howTo.map((h) => txt(h, lang)),
    synergies: b.synergies.map((s) => ({ items: [...s.items], text: txt(s.text, lang) })),
    author: b.author,
  }
}

export const emptyBuild = (): Build => ({ name: '', survivor: null, items: [], howTo: [], synergies: [] })

// ---------------------------------------------------------------- share links

/** Limits keep links short enough to paste in a chat. The editor enforces the same ones. */
export const LIMITS = { name: 60, line: 140, text: 1200, items: 30, howTo: 12, synergies: 12, author: 40 } as const

const str = (max: number) => z.string().trim().max(max)
const opt = (max: number) => str(max).optional()

/** Wire format: short keys, empty fields left out. Version 1. */
const wireSchema = z.object({
  v: z.literal(1),
  n: str(LIMITS.name).min(1),
  s: z.string().optional(),
  g: opt(LIMITS.line),
  t: opt(LIMITS.line),
  d: opt(LIMITS.text),
  kl: opt(LIMITS.line),
  k: opt(LIMITS.text),
  i: z.array(z.tuple([z.string(), z.string().max(LIMITS.line), z.union([z.literal(0), z.literal(1)])])).max(LIMITS.items),
  h: z.array(str(LIMITS.text)).max(LIMITS.howTo).default([]),
  y: z.array(z.tuple([str(LIMITS.text), z.array(z.string()).max(LIMITS.items)])).max(LIMITS.synergies).default([]),
  a: opt(LIMITS.author),
})
type Wire = z.infer<typeof wireSchema>

function toWire(b: Build): Wire {
  const s = (v: Text | undefined) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
  return {
    v: 1,
    n: s(b.name) ?? '',
    s: b.survivor ?? undefined,
    g: s(b.tagline),
    t: s(b.tag),
    d: s(b.summary),
    kl: s(b.skills?.label),
    k: s(b.skills?.text),
    i: b.items.map((it) => [it.id, s(it.role) ?? '', it.core ? 1 : 0]),
    h: b.howTo.map(s).filter((x): x is string => !!x),
    y: b.synergies.filter((x) => s(x.text)).map((x) => [s(x.text)!, x.items]),
    a: s(b.author),
  }
}

const knownItem = (id: string) => BY_ID.has(id)

/** Rebuilds a build from the wire format, dropping items this version of the app does not know. */
function fromWire(w: Wire): Build {
  const items = w.i.filter(([id]) => knownItem(id))
  const seen = new Set<string>()
  return {
    name: w.n,
    survivor: isSurvivorId(w.s) ? w.s : null,
    tagline: w.g,
    tag: w.t,
    summary: w.d,
    skills: w.k ? { label: w.kl, text: w.k } : undefined,
    items: items
      .filter(([id]) => !seen.has(id) && !!seen.add(id))
      .map(([id, role, core]) => ({ id, role: role || undefined, core: core === 1 || undefined })),
    howTo: w.h,
    synergies: w.y.map(([text, ids]) => ({ text, items: ids.filter(knownItem) })),
    author: w.a,
  }
}

const b64url = (bytes: Uint8Array) => {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const unb64url = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}
async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}
const canCompress = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined'

/**
 * Build → short URL-safe code. "z" + deflated JSON when the browser can compress (all current ones),
 * "j" + plain JSON otherwise. Texts are compressed well by deflate, which keeps links pasteable.
 */
export async function encodeBuild(b: Build): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(toWire(b)))
  if (!canCompress()) return 'j' + b64url(json)
  return 'z' + b64url(await pipe(json, new CompressionStream('deflate-raw')))
}

/** Code → build, or null when the code is damaged or not a build. */
export async function decodeBuild(code: string): Promise<Build | null> {
  try {
    const kind = code[0]
    let bytes = unb64url(code.slice(1))
    if (kind === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'))
    else if (kind !== 'j') return null
    const parsed = wireSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)))
    return parsed.success ? fromWire(parsed.data) : null
  } catch {
    return null
  }
}

/** The code lives in the hash: it never reaches the server and the page can stay prerendered. */
export const shareUrl = (code: string) => `${window.location.origin}/builds/view#${code}`
export const readHashCode = () => window.location.hash.replace(/^#/, '')

// ---------------------------------------------------------------- "My builds" (localStorage)

export type SavedBuild = { id: string; updated: number; build: Build }

/** Saved builds are stored in the wire format, so they go through the same checks as shared links. */
type Stored = { id: string; updated: number; w: unknown }

const STORAGE_KEY = 'ror2-codex-builds'
const NONE: SavedBuild[] = []
let cache: SavedBuild[] | null = null
const listeners = new Set<() => void>()
function read(): SavedBuild[] {
  if (cache) return cache
  const out: SavedBuild[] = []
  try {
    const raw: Stored[] = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    for (const x of Array.isArray(raw) ? raw : []) {
      const w = wireSchema.safeParse(x?.w)
      if (typeof x?.id === 'string' && w.success) out.push({ id: x.id, updated: Number(x.updated) || 0, build: fromWire(w.data) })
    }
  } catch {
    /* unreadable storage: start empty */
  }
  cache = out
  return out
}

function write(list: SavedBuild[]) {
  cache = [...list].sort((a, b) => b.updated - a.updated)
  try {
    const stored: Stored[] = cache.map((x) => ({ id: x.id, updated: x.updated, w: toWire(x.build) }))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* private mode or full storage: kept for this visit only */
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  // Another tab saved a build.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    cache = null
    l()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

const newId = () => Math.random().toString(36).slice(2, 10)

/** Builds saved in this browser. Empty during prerendering and hydration. */
export function useSavedBuilds() {
  const list = useSyncExternalStore(subscribe, read, () => NONE)
  const save = useCallback((build: Build, id?: string) => {
    const keep = id ?? newId()
    write([{ id: keep, updated: Date.now(), build }, ...read().filter((x) => x.id !== keep)])
    return keep
  }, [])
  const remove = useCallback((id: string) => write(read().filter((x) => x.id !== id)), [])
  return { list, save, remove, get: (id: string) => list.find((x) => x.id === id) }
}
