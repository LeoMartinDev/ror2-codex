// Converts wiki templates ({{Color|d|...}}, {{Stack|...}}) to the game's <style=...> rich text.

const STYLE: Record<string, string> = {
  d: 'cIsDamage',
  h: 'cIsHealing',
  u: 'cIsUtility',
  v: 'cIsVoid',
  void: 'cIsVoid',
  death: 'cDeath',
  human: 'cHumanObjective',
  shrine: 'cShrine',
  lunar: 'cIsLunar',
  hallowedgreen: 'cIsHealing',
}

export function wikiToRich(text: string): string {
  let s = text.replace(/\r/g, '')
  for (let guard = 0; guard < 20 && /\{\{[^{}]*\}\}/.test(s); guard++) {
    s = s.replace(/\{\{([^{}]*)\}\}/g, (_, inner: string) => {
      const parts = inner.split('|')
      const name = parts[0].trim().toLowerCase()
      if (name === 'stack') return `<style=cStack>${parts.slice(1).join('|')}</style>`
      if (name === 'color') {
        const key = (parts[1] ?? '').trim()
        const body = parts.slice(2).join('|')
        const style = STYLE[key.toLowerCase()]
        if (style) return `<style=${style}>${body}</style>`
        if (key.startsWith('#')) return `<color=${key}>${body}</color>`
        return body
      }
      return parts[parts.length - 1]
    })
  }
  return s.trim()
}

/** Plain lowercase text, tags removed (used for tag heuristics and search). */
export function richToPlain(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
