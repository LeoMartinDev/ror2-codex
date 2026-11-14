import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://riskofrain2.wiki.gg/api.php'
const UA = 'ror2-codex-data-script/0.1'

/** Resolves wiki file URLs for a list of file titles (without "File:" prefix). */
export async function resolveFileUrls(titles: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  for (let i = 0; i < titles.length; i += 40) {
    const batch = titles.slice(i, i + 40)
    const url = `${API}?action=query&format=json&prop=imageinfo&iiprop=url&redirects=1&titles=${encodeURIComponent(
      batch.map((t) => `File:${t}`).join('|'),
    )}`
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) throw new Error(`wiki API ${res.status}`)
    const json: any = await res.json()
    const normalized = new Map<string, string>()
    for (const n of json.query?.normalized ?? []) normalized.set(n.to, n.from)
    for (const r of json.query?.redirects ?? []) normalized.set(r.to, normalized.get(r.from) ?? r.from)
    for (const page of Object.values<any>(json.query?.pages ?? {})) {
      const info = page.imageinfo?.[0]
      if (!info) continue
      const original = (normalized.get(page.title) ?? page.title).replace(/^File:/, '')
      out.set(original, info.url)
    }
  }
  return out
}

export async function download(url: string, dest: string): Promise<boolean> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) return false
  const buf = Buffer.from(await res.arrayBuffer())
  // Normalise to a 128px PNG to keep the bundle light.
  await sharp(buf).resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(dest)
  return true
}

function rgbToHsv(r: number, g: number, b: number) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max ? d / max : 0, v: max }
}

const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0')

const SIZE = 64

/**
 * Keeps only pixels deep inside the silhouette. Wiki icons have a glowing outline in the rarity
 * colour plus a few sparkles around the object; eroding the opaque mask removes both, so the
 * colour comes from the object itself.
 */
function interiorMask(data: Buffer): Uint8Array {
  const opaque = new Uint8Array(SIZE * SIZE)
  for (let p = 0; p < SIZE * SIZE; p++) opaque[p] = data[p * 4 + 3] > 128 ? 1 : 0
  for (const r of [4, 3, 2, 1]) {
    const keep = new Uint8Array(SIZE * SIZE)
    let count = 0
    for (let y = r; y < SIZE - r; y++)
      for (let x = r; x < SIZE - r; x++) {
        let ok = 1
        for (let dy = -r; dy <= r && ok; dy++)
          for (let dx = -r; dx <= r; dx++)
            if (!opaque[(y + dy) * SIZE + x + dx]) {
              ok = 0
              break
            }
        if (ok) {
          keep[y * SIZE + x] = 1
          count++
        }
      }
    // Thin objects (daggers, glasses) may vanish: fall back to a smaller erosion.
    if (count >= 60) return keep
  }
  return opaque
}

/** Dominant colour of an icon: hue histogram weighted by chroma, on the object's interior only. */
export async function dominantColor(file: string): Promise<{ color: string; bucket: string }> {
  const { data } = await sharp(file).resize(SIZE, SIZE, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const mask = interiorMask(data)
  const bins = Array.from({ length: 36 }, () => ({ w: 0, r: 0, g: 0, b: 0, v: 0 }))
  let total = 0
  let chromaTotal = 0
  let lum = 0
  let sr = 0, sg = 0, sb = 0
  for (let p = 0; p < SIZE * SIZE; p++) {
    if (!mask[p]) continue
    const i = p * 4
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255
    const { h, s, v } = rgbToHsv(r, g, b)
    total++
    lum += v
    sr += r; sg += g; sb += b
    const w = s * v
    chromaTotal += w
    if (s < 0.22 || v < 0.15) continue
    const bin = bins[Math.floor(h / 10) % 36]
    bin.w += w; bin.r += r * w; bin.g += g * w; bin.b += b * w; bin.v += v * w
  }
  if (!total) return { color: '#888888', bucket: 'white' }
  const avgV = lum / total
  // Colourless icon (or only faint colour that never reaches the saturation threshold)
  const vivid = bins.reduce((s, b) => s + b.w, 0)
  if (chromaTotal / total < 0.12 || vivid / total < 0.04) {
    const c = `#${hex((sr / total) * 255)}${hex((sg / total) * 255)}${hex((sb / total) * 255)}`
    return { color: c, bucket: avgV < 0.35 ? 'black' : 'white' }
  }
  // Smooth histogram over neighbouring bins and pick the peak.
  let best = 0, bestW = -1
  for (let i = 0; i < 36; i++) {
    const w = bins[(i + 35) % 36].w * 0.5 + bins[i].w + bins[(i + 1) % 36].w * 0.5
    if (w > bestW) { bestW = w; best = i }
  }
  const group = [bins[(best + 35) % 36], bins[best], bins[(best + 1) % 36]]
  const W = group.reduce((s, b) => s + b.w, 0) || 1
  const r = group.reduce((s, b) => s + b.r, 0) / W
  const g = group.reduce((s, b) => s + b.g, 0) / W
  const b = group.reduce((s, b2) => s + b2.b, 0) / W
  const { h, s, v } = rgbToHsv(r, g, b)
  let bucket: string
  if (h < 14 || h >= 338) bucket = "red"
  else if (h < 42) bucket = v < 0.6 && s < 0.85 ? 'brown' : 'orange'
  else if (h < 68) bucket = v < 0.5 ? 'brown' : 'yellow'
  else if (h < 165) bucket = 'green'
  else if (h < 195) bucket = 'cyan'
  else if (h < 248) bucket = 'blue'
  else if (h < 290) bucket = 'purple'
  else bucket = 'pink'
  return { color: `#${hex(r * 255)}${hex(g * 255)}${hex(b * 255)}`, bucket }
}

export function readJson<T>(file: string, fallback: T): T {
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback
}
export function writeJson(file: string, value: unknown) {
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
}
