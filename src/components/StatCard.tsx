import { tint } from '#/lib/catalog'
import {
  displayValue,
  displayedTrap,
  hasCurve,
  milestones,
  ruleText,
  stacksToCap,
  valueAt,
  verdictOf,
} from '#/lib/stacking'
import { useLang } from '#/lib/i18n'
import type { Stacking } from '#/lib/types'

const TONES = {
  good: { color: '#7cc4f5', bg: '#0f1d27', border: '#1f4a66' },
  warn: { color: '#f2c94c', bg: '#1d1a0d', border: '#4a3f17' },
  growing: { color: '#ff8fd0', bg: '#24101c', border: '#5c2346' },
  bad: { color: '#ff7f7f', bg: '#261012', border: '#5c2326' },
  neutral: { color: '#a3a9b4', bg: '#15181d', border: '#2b303a' },
} as const

const LADDER = [1, 2, 3, 5, 10, 20]
const BARS = 20

export function StatCard({ s, color }: { s: Stacking; color: string }) {
  const { lang, tr } = useLang()
  const dv = (v: number | null) => displayValue(s, v, lang)
  const verdict = verdictOf(s, lang)
  const tone = TONES[verdict.tone]
  const curve = hasCurve(s)
  const capAt = stacksToCap(s)
  const trap = displayedTrap(s)
  const marks = milestones(s)
  const accent = s.bad ? '#ff7f7f' : '#f2c94c'
  const barColor = s.bad ? '#ff7f7f' : color

  const vals = Array.from({ length: BARS }, (_, i) => valueAt(s, i + 1) ?? 0)
  const log = s.model === 'multiplier'
  const norm = (v: number) => (log ? Math.log2(Math.max(1, 1 + v / 100)) : Math.abs(v))
  const max = Math.max(...vals.map(norm)) || 1

  return (
    <div className="flex flex-col gap-3 border-2 border-line bg-[linear-gradient(180deg,#14171d,#101216)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_0_rgba(0,0,0,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="m-0 font-pixel text-[19px] font-semibold leading-tight">{s.stat[lang]}</h3>
        {verdict.label && (
          <span
            className="px-label shrink-0 whitespace-nowrap border-2 px-1.5 py-0.5"
            style={{ color: tone.color, background: tone.bg, borderColor: tone.border }}
          >
            {verdict.label}
          </span>
        )}
      </div>
      <p className="m-0 text-[15px] leading-snug text-ink-soft">{ruleText(s, lang)}</p>

      {curve ? (
        <>
          <div>
            <div className="mb-1 text-[13px] text-ink-mute">{tr('Valeur selon le nombre de copies', 'Value by number of stacks')}</div>
            <div className="grid grid-cols-6 border-2 border-line bg-[#0c0e12]">
              {LADDER.map((k, i) => {
                const dead = capAt !== null && k > capAt
                const isCap = capAt !== null && k >= capAt && (i === 0 || LADDER[i - 1] < capAt)
                const text = dead ? tr('idem', 'same') : dv(valueAt(s, k))
                const size = text.length >= 8 ? 11 : text.length >= 6 ? 13 : 15
                return (
                  <div
                    key={k}
                    className={['flex flex-col items-center gap-0.5 px-0.5 py-1.5', i ? 'border-l-2 border-line' : ''].join(' ')}
                    style={{ background: dead ? '#16100f' : isCap ? '#261012' : undefined }}
                  >
                    <span className="px-label text-ink-mute">{k}</span>
                    <span
                      className="whitespace-nowrap font-bold tabular-nums leading-5"
                      style={{ fontSize: size, color: dead ? '#6b4a4f' : isCap ? '#ff7f7f' : k === 1 ? '#ecebe4' : accent }}
                    >
                      {text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex h-12 items-end gap-0.5 border-b-2 border-line pt-1" role="img" aria-label={tr(`Courbe de ${s.stat.fr} de 1 à ${BARS} copies`, `${s.stat.en} curve from 1 to ${BARS} stacks`)}>
              {vals.map((v, i) => {
                const n = i + 1
                const dead = capAt !== null && n > capAt
                const h = Math.max(2, Math.round(((norm(v) / max) * 42) / 2) * 2)
                const bg = dead
                  ? '#3a2226'
                  : capAt === n
                    ? '#ff7f7f'
                    : `linear-gradient(180deg, ${tint(barColor, 0.95)} 0 2px, ${tint(barColor, 0.7)} 2px, ${tint(barColor, 0.4)})`
                return (
                  <div
                    key={n}
                    title={`${n} ${tr(n > 1 ? 'copies' : 'copie', n > 1 ? 'stacks' : 'stack')} : ${dv(v)}${dead ? tr(' (plafond)', ' (capped)') : ''}`}
                    className="flex-1 transition-[filter] hover:brightness-125"
                    style={{ height: h, background: bg }}
                  />
                )
              })}
            </div>
            <div className="mt-1 flex justify-between text-xs text-ink-mute">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>{tr('20 copies', '20 stacks')}</span>
            </div>
          </div>
        </>
      ) : s.model === 'none' ? (
        <div className="text-[15px] text-ink-dim">
          {tr('Valeur fixe', 'Fixed value')} : <strong className="text-lg" style={{ color: accent }}>{dv(s.base)}</strong>
        </div>
      ) : null}

      {marks.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {marks.map((m) => (
            <span key={m.target} className="border-2 border-line-2 bg-bar px-2 py-0.5 text-[13px] text-ink-soft">
              {dv(m.target)} {m.n ? tr(`dès ${m.n} copies`, `from ${m.n} stacks`) : tr(': plus de 1000 copies', ': over 1000 stacks')}
            </span>
          ))}
        </div>
      )}

      {s.team && (
        <p className="m-0 text-[13px] text-info">{tr('Compte les copies de toute l’équipe.', 'Counts the stacks of the whole team.')}</p>
      )}

      {trap && (
        <p className="m-0 border-2 border-[#4a3f17] bg-[#1d1a0d] px-2 py-1.5 text-[13px] leading-snug text-accent">
          {tr(
            `Piège : le jeu affiche ${dv(trap.shown1)} pour 1 copie (puis ${dv(trap.shown3)} pour 3), la vraie valeur est ${dv(trap.real1)} (puis ${dv(trap.real3)}).`,
            `Trap: the game shows ${dv(trap.shown1)} for 1 stack (then ${dv(trap.shown3)} for 3), the real value is ${dv(trap.real1)} (then ${dv(trap.real3)}).`,
          )}
        </p>
      )}

      {s.note && s.model !== 'table' && <p className="m-0 text-[13px] italic text-ink-dim">{s.note[lang] || s.note.fr}</p>}
    </div>
  )
}
