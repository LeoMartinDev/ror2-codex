import type { Lang, Stacking } from './types'

/** Value of a stat for `n` copies (n >= 1). Returns null when there is no closed formula. */
export function valueAt(s: Stacking, n: number): number | null {
  const k = Math.max(1, Math.floor(n))
  const extra = k - 1
  let v: number
  switch (s.model) {
    case 'none':
      v = s.base
      break
    case 'linear':
      v = s.base + s.add * extra
      break
    case 'hyperbolic': {
      const amp = (s.base + s.add * extra) / 100
      v = 100 * (1 - 1 / (1 + amp))
      break
    }
    case 'compound': {
      const sign = s.base < 0 ? -1 : 1
      const b = Math.abs(s.base) / 100
      const a = Math.abs(s.add)
      v = sign * 100 * (1 - (1 - b) * Math.pow(1 - a, extra))
      break
    }
    case 'multiplier':
      v = 100 * ((1 + s.base / 100) * Math.pow(1 + s.add, extra) - 1)
      break
    case 'geometric':
      v = s.base * Math.pow(1 + s.add, extra)
      break
    case 'reciprocal':
      v = s.base / (1 + s.add * extra)
      break
    case 'table':
      if (!s.values?.length) return null
      v = s.values[Math.min(k, s.values.length) - 1]
      break
    default:
      return null
  }
  if (s.cap !== undefined) v = s.base >= 0 ? Math.min(v, s.cap) : Math.max(v, s.cap)
  return v
}

/** Gain brought by the n-th copy (value(n) − value(n−1)); for n = 1 it is the value itself. */
export function gainAt(s: Stacking, n: number): number | null {
  const cur = valueAt(s, n)
  if (cur === null) return null
  if (n <= 1) return cur
  const prev = valueAt(s, n - 1)
  return prev === null ? null : cur - prev
}

/** Number of copies at which the cap is reached, or null if never (within 1000 copies). */
export function stacksToCap(s: Stacking): number | null {
  if (s.cap === undefined) return null
  for (let n = 1; n <= 1000; n++) {
    const v = valueAt(s, n)
    if (v === null) return null
    if (Math.abs(v - s.cap) < 1e-9) return n
  }
  return null
}

export function hasCurve(s: Stacking): boolean {
  return s.model !== 'special' && s.model !== 'none'
}

/** How the stat behaves as copies pile up, in player terms. */
export type Trend = 'linear' | 'capped' | 'diminishing' | 'growing' | 'shrinking' | 'fixed' | 'special'

export function trendOf(s: Stacking): Trend {
  if (s.cap !== undefined) return 'capped'
  switch (s.model) {
    case 'linear':
      return s.add === 0 ? 'fixed' : s.add > 0 ? 'linear' : 'shrinking'
    case 'hyperbolic':
    case 'compound':
      return 'diminishing'
    case 'multiplier':
      return 'growing'
    case 'geometric':
      return s.add >= 0 ? 'growing' : 'shrinking'
    case 'reciprocal':
      return 'shrinking'
    case 'none':
      return 'fixed'
    case 'table': {
      const v = [1, 2, 3].map((n) => valueAt(s, n) ?? 0)
      if (v[1] < v[0]) return 'shrinking'
      return v[2] - v[1] < v[1] - v[0] - 1e-9 ? 'diminishing' : v[2] - v[1] > v[1] - v[0] + 1e-9 ? 'growing' : 'linear'
    }
    default:
      return 'special'
  }
}

type Tone = 'good' | 'neutral' | 'warn' | 'growing' | 'bad'

const VERDICTS: Record<Lang, { good: Record<Trend, string>; bad: Record<Trend, string>; cap: (n: string) => string }> = {
  fr: {
    good: {
      linear: 'Gain constant',
      diminishing: 'Rendement décroissant',
      growing: 'Effet multiplié',
      shrinking: 'Baisse à chaque copie',
      fixed: 'Ne change pas',
      capped: '',
      special: 'Formule spéciale',
    },
    bad: {
      linear: 'Malus constant',
      diminishing: 'Malus cumulé',
      growing: 'Malus multiplié',
      shrinking: 'Malus qui s’aggrave',
      fixed: 'Malus fixe',
      capped: '',
      special: 'Malus spécial',
    },
    cap: (n) => `Max à ${n} copies`,
  },
  en: {
    good: {
      linear: 'Steady gain',
      diminishing: 'Diminishing returns',
      growing: 'Multiplies',
      shrinking: 'Drops each stack',
      fixed: 'Does not change',
      capped: '',
      special: 'Special formula',
    },
    bad: {
      linear: 'Steady penalty',
      diminishing: 'Stacking penalty',
      growing: 'Multiplying penalty',
      shrinking: 'Penalty gets worse',
      fixed: 'Fixed penalty',
      capped: '',
      special: 'Special penalty',
    },
    cap: (n) => `Max at ${n} stacks`,
  },
}

const TONE: Record<Trend, Tone> = {
  linear: 'good',
  diminishing: 'warn',
  growing: 'growing',
  shrinking: 'good',
  fixed: 'neutral',
  capped: 'bad',
  special: 'neutral',
}

export function verdictOf(s: Stacking, lang: Lang = 'fr'): { label: string; tone: Tone } {
  const t = trendOf(s)
  const L = VERDICTS[lang]
  if (t === 'capped') return { label: L.cap(String(stacksToCap(s) ?? '?')), tone: 'bad' }
  if (s.bad) return { label: L.bad[t], tone: 'bad' }
  return { label: L.good[t], tone: TONE[t] }
}

/** Unit suffix as written after a number. */
function unitSuffix(unit: string, lang: Lang): string {
  if (unit === 'x') return '×'
  if (unit === '%') return lang === 'fr' ? ' %' : '%'
  return unit ? ` ${unit.trim()}` : ''
}

/** One plain-language sentence describing the scaling. */
export function ruleText(s: Stacking, lang: Lang = 'fr'): string {
  const u = unitSuffix(s.unit, lang)
  const f = (x: number) => formatNumber(x, 2, lang)
  const capAt = stacksToCap(s)
  const fr = lang === 'fr'
  switch (s.model) {
    case 'linear': {
      if (s.add === 0) return fr ? 'Ne change pas avec les copies.' : 'Does not change with stacks.'
      const per = `${s.add > 0 ? '+' : '−'}${f(Math.abs(s.add))}${u} ${fr ? 'par copie' : 'per stack'}`
      const start =
        s.base !== s.add ? (fr ? `${f(s.base)}${u} avec 1 copie, puis ${per}` : `${f(s.base)}${u} with 1 stack, then ${per}`) : per
      if (s.cap !== undefined && capAt)
        return fr
          ? `${start} jusqu’à ${f(s.cap)}${u}. Rien de plus après ${capAt} copies.`
          : `${start} up to ${f(s.cap)}${u}. Nothing more after ${capAt} stacks.`
      return fr ? `${start}, sans limite.` : `${start}, no limit.`
    }
    case 'hyperbolic':
      return fr
        ? 'Chaque copie rapporte un peu moins que la précédente. N’atteint jamais 100 %.'
        : 'Each stack gives a bit less than the previous one. Never reaches 100%.'
    case 'compound':
      return fr
        ? `Chaque copie retire encore ${f(Math.abs(s.add) * 100)} % de ce qui reste : n’atteint jamais 100 %.`
        : `Each stack removes another ${f(Math.abs(s.add) * 100)}% of what is left: never reaches 100%.`
    case 'multiplier':
      return fr
        ? `Multiplié par ${f(1 + s.add)} à chaque copie : plus on en a, plus chaque copie rapporte.`
        : `Multiplied by ${f(1 + s.add)} each stack: the more you have, the more each one gives.`
    case 'geometric':
      if (s.add < 0 && 1 + s.add === 0.5) return fr ? 'Divisé par 2 à chaque copie supplémentaire.' : 'Halved with each extra stack.'
      return fr ? `Multiplié par ${f(1 + s.add)} à chaque copie supplémentaire.` : `Multiplied by ${f(1 + s.add)} with each extra stack.`
    case 'reciprocal':
      if (s.add === 1 && s.base !== 50) return fr ? 'Divisé par le nombre de copies : ½, ⅓, ¼…' : 'Divided by the number of stacks: ½, ⅓, ¼…'
      return fr ? 'Baisse à chaque copie, de moins en moins vite.' : 'Drops with each stack, more and more slowly.'
    case 'table':
      return s.note?.[lang] ?? (fr ? 'Courbe propre à cet objet.' : 'Curve specific to this item.')
    case 'none':
      return fr ? 'Ne change pas avec les copies.' : 'Does not change with stacks.'
    default:
      return fr
        ? `${s.raw.value || '?'}${s.raw.add ? `, ${s.raw.add} par copie` : ''} : formule particulière.`
        : `${s.raw.value || '?'}${s.raw.add ? `, ${s.raw.add} per stack` : ''}: special formula.`
  }
}

/** "50 % dès 7 copies" style milestones for diminishing percentage stats. */
export function milestones(s: Stacking): { target: number; n: number | null }[] {
  if (s.unit !== '%' || s.bad || trendOf(s) !== 'diminishing') return []
  const first = valueAt(s, 1) ?? 0
  return [50, 75]
    .filter((t) => first < t)
    .map((target) => {
      for (let n = 1; n <= 1000; n++) if ((valueAt(s, n) ?? 0) >= target) return { target, n }
      return { target, n: null }
    })
}

/** Value written in the game's description for n copies, when it differs from the real one. */
export function displayedTrap(s: Stacking): { shown1: number; real1: number; shown3: number; real3: number } | null {
  if (s.unit !== '%' || (s.model !== 'hyperbolic' && s.model !== 'table')) return null
  if (!/\d/.test(s.raw.value) || !/%/.test(s.raw.add)) return null
  const shown = (n: number) => s.base + s.add * (n - 1)
  const real1 = valueAt(s, 1) ?? 0
  const real3 = valueAt(s, 3) ?? 0
  if (Math.abs(shown(1) - real1) < 0.05 && Math.abs(shown(3) - real3) < 0.5) return null
  return { shown1: shown(1), real1, shown3: shown(3), real3 }
}

/** Value formatted for display; multiplicative damage shows as a factor (×2, ×4…). */
export function displayValue(s: Stacking, v: number | null, lang: Lang = 'fr'): string {
  if (v === null) return '—'
  if (s.model === 'multiplier') return `×${formatNumber(1 + v / 100, 1, lang)}`
  if (s.unit === '%' && v > 0 && v < 0.1) return `≈0${unitSuffix('%', lang)}`
  return formatValue(v, s.unit, Math.abs(v) >= 10 ? 0 : 1, lang)
}

const LOCALE: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US' }

export function formatNumber(x: number, digits = 2, lang: Lang = 'fr'): string {
  if (Math.abs(x) >= 10000) return x.toLocaleString(LOCALE[lang], { notation: 'compact', maximumFractionDigits: 1 })
  const r = Math.round(x * 10 ** digits) / 10 ** digits
  return r.toLocaleString(LOCALE[lang], { maximumFractionDigits: digits })
}

export function formatValue(x: number | null, unit: string, digits = 2, lang: Lang = 'fr'): string {
  if (x === null) return '—'
  return `${formatNumber(x, digits, lang)}${unitSuffix(unit, lang)}`
}
