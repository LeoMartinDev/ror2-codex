import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export const DEFAULT_LANG_DIR =
  'C:/Program Files (x86)/Steam/steamapps/common/Risk of Rain 2/Risk of Rain 2_Data/StreamingAssets/Language'

/** Game language files are "JSON with quirks" (BOM, trailing commas, comments, tabs). */
function parseLooseJson(text: string): any {
  const clean = text
    .replace(/^\uFEFF/, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/,(\s*[}\]])/g, '$1')
  return JSON.parse(clean)
}

export function loadLanguage(dir: string): Map<string, string> {
  const map = new Map<string, string>()
  if (!existsSync(dir)) throw new Error(`Language folder not found: ${dir}`)
  // output.json first (merged base strings), then specific files override.
  const files = readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'language.json')
  files.sort((a, b) => (a === 'output.json' ? -1 : b === 'output.json' ? 1 : a.localeCompare(b)))
  for (const f of files) {
    try {
      const json = parseLooseJson(readFileSync(join(dir, f), 'utf8'))
      const strings = json.strings ?? json
      for (const [k, v] of Object.entries(strings)) if (typeof v === 'string') map.set(k, v)
    } catch (e) {
      console.warn(`  ! could not parse ${f}: ${(e as Error).message}`)
    }
  }
  return map
}
