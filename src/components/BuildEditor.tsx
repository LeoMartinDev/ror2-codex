import { useMemo, useState, type ReactNode } from 'react'
import { RARITY_ORDER, tileColors } from '#/lib/catalog'
import { LIMITS, type Build, type BuildItem } from '#/lib/builds'
import { matches } from '#/lib/filters'
import { useLang } from '#/lib/i18n'
import { BY_ID, ITEMS } from '#/lib/items'
import { SURVIVORS, type SurvivorId } from '#/lib/survivors'
import type { Item } from '#/lib/types'
import { BuildSynergies, Section, SurvivorPortrait, survivorLabel } from './BuildView'
import { useTileTooltip } from './ItemGrid'
import { Button, CONTROL_TEXT } from './ui'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const FIELD = cx(
  'px-focus w-full border-2 border-line-2 bg-[#0b0d10] px-3 py-2 text-ink outline-none transition-colors',
  'placeholder:text-[#6f7682] hover:border-[#3a404c] focus:border-accent',
  CONTROL_TEXT,
  'leading-snug',
)

/** Items that can go in a build: everything a player can hold. */
const PICKABLE = ITEMS.filter((it) => it.rarity !== 'untiered').sort(
  (a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity] || a.name.en.localeCompare(b.name.en),
)

function Field({ label, hint, count, children }: { label: string; hint?: string; count?: [number, number]; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline gap-2">
        <span className="px-label text-ink-dim">{label}</span>
        {hint && <span className="text-xs text-ink-mute">{hint}</span>}
        {count && (
          <span className={cx('ml-auto font-label text-[11px] tabular-nums', count[0] > count[1] ? 'text-bad' : 'text-ink-mute')}>
            {count[0]}/{count[1]}
          </span>
        )}
      </span>
      {children}
    </label>
  )
}

function SurvivorPicker({ value, onChange }: { value: SurvivorId | null; onChange: (v: SurvivorId | null) => void }) {
  const { lang, tr } = useLang()
  const options: (SurvivorId | null)[] = [null, ...SURVIVORS.map((s) => s.id)]
  return (
    <div role="radiogroup" aria-label={tr('Personnage', 'Survivor')} className="grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-1.5">
      {options.map((id) => {
        const active = value === id
        return (
          <button
            key={id ?? 'generic'}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cx(
              'px-focus flex flex-col items-center gap-1 border-2 p-1.5 transition-colors',
              active ? 'border-accent bg-[#2a2410] text-accent' : 'border-line bg-card text-ink-soft hover:border-[#3a404c] hover:text-ink',
            )}
          >
            <SurvivorPortrait id={id} size={44} />
            <span className="w-full truncate text-center text-xs font-medium leading-tight">{survivorLabel(id, lang)}</span>
          </button>
        )
      })}
    </div>
  )
}

function ItemPicker({ selected, onToggle }: { selected: Set<string>; onToggle: (it: Item) => void }) {
  const { lang, tr } = useLang()
  const [q, setQ] = useState('')
  const { onHover, tooltip } = useTileTooltip()
  const list = useMemo(() => (q.trim() ? PICKABLE.filter((it) => matches(it, { q })) : PICKABLE), [q])
  return (
    <div className="flex flex-col gap-2 border-2 border-line bg-[#0c0e12] p-2.5">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={tr('Chercher un objet (nom FR / EN ou effet)…', 'Search an item (name or effect)…')}
        aria-label={tr('Chercher un objet', 'Search an item')}
        className={FIELD}
      />
      <div className="scrollbar-thin grid max-h-[300px] grid-cols-[repeat(auto-fill,48px)] gap-1.5 overflow-y-auto p-1">
        {list.map((it) => {
          const on = selected.has(it.id)
          return (
            <button
              key={it.id}
              type="button"
              aria-pressed={on}
              aria-label={`${it.name[lang]}${on ? tr(' (dans le build)', ' (in build)') : ''}`}
              onClick={() => onToggle(it)}
              onMouseEnter={(e) => onHover({ item: it, rect: e.currentTarget.getBoundingClientRect() })}
              onMouseLeave={() => onHover(null)}
              onFocus={(e) => onHover({ item: it, rect: e.currentTarget.getBoundingClientRect() })}
              onBlur={() => onHover(null)}
              data-selected={on || undefined}
              className="frame tile size-12"
              style={tileColors(it.rarity)}
            >
              {it.icon && <img src={it.icon} alt="" loading="lazy" className="pointer-events-none size-10 object-contain" />}
            </button>
          )
        })}
        {!list.length && <p className="col-span-full m-0 p-2 text-sm text-ink-mute">{tr('Aucun objet trouvé.', 'No item found.')}</p>}
      </div>
      {tooltip}
    </div>
  )
}

function ItemRows({ items, onChange }: { items: BuildItem[]; onChange: (items: BuildItem[]) => void }) {
  const { lang, tr } = useLang()
  const move = (i: number, d: number) => {
    const next = [...items]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const patch = (i: number, p: Partial<BuildItem>) => onChange(items.map((x, j) => (j === i ? { ...x, ...p } : x)))
  if (!items.length)
    return <p className="m-0 border-2 border-dashed border-line-2 p-4 text-sm text-ink-mute">{tr('Choisis des objets ci-dessous.', 'Pick items below.')}</p>
  return (
    <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
      {items.map((b, i) => {
        const it = BY_ID.get(b.id)
        if (!it) return null
        return (
          <li key={b.id} className="flex flex-wrap items-center gap-2 border-2 border-line bg-card p-1.5 sm:flex-nowrap">
            <span className="frame size-10 shrink-0" style={tileColors(it.rarity)}>
              {it.icon && <img src={it.icon} alt="" className="size-8 object-contain" />}
            </span>
            <span className="w-36 shrink-0 truncate font-pixel text-[15px] font-semibold leading-tight" title={it.name[lang]}>
              {it.name[lang]}
            </span>
            <input
              value={typeof b.role === 'string' ? b.role : ''}
              maxLength={LIMITS.line}
              onChange={(e) => patch(i, { role: e.target.value })}
              placeholder={tr('Rôle, nombre (×3 · cadence)…', 'Role, copies (×3 · fire rate)…')}
              aria-label={tr(`Rôle de ${it.name.fr}`, `Role of ${it.name.en}`)}
              className={cx(FIELD, 'h-9 min-w-0 flex-1 basis-full py-0 sm:basis-auto')}
            />
            <label className={cx('flex shrink-0 cursor-pointer items-center gap-1.5 px-1', CONTROL_TEXT, b.core ? 'text-accent' : 'text-ink-soft')}>
              <input type="checkbox" className="px-check" checked={!!b.core} onChange={() => patch(i, { core: !b.core || undefined })} />
              {tr('Essentiel', 'Core')}
            </label>
            <span className="ml-auto flex shrink-0 gap-1">
              <Button className="px-2" disabled={i === 0} onClick={() => move(i, -1)} aria-label={tr('Monter', 'Move up')}>
                ↑
              </Button>
              <Button className="px-2" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={tr('Descendre', 'Move down')}>
                ↓
              </Button>
              <Button className="px-2 hover:text-bad" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={tr('Retirer', 'Remove')}>
                ✕
              </Button>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function SynergyRows({ build, onChange }: { build: Build; onChange: (s: Build['synergies']) => void }) {
  const { lang, tr } = useLang()
  const notes = build.synergies
  const patch = (i: number, p: Partial<Build['synergies'][number]>) => onChange(notes.map((x, j) => (j === i ? { ...x, ...p } : x)))
  return (
    <div className="flex flex-col gap-2">
      {notes.map((n, i) => (
        <div key={i} className="flex flex-col gap-2 border-2 border-line bg-card p-2.5">
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label={tr('Objets concernés', 'Items involved')}>
            {build.items.map((b) => {
              const it = BY_ID.get(b.id)
              if (!it) return null
              const on = n.items.includes(b.id)
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={on}
                  title={it.name[lang]}
                  aria-label={it.name[lang]}
                  onClick={() => patch(i, { items: on ? n.items.filter((x) => x !== b.id) : [...n.items, b.id] })}
                  className={cx('frame tile size-9 transition-opacity', !on && 'opacity-35 grayscale hover:opacity-80')}
                  data-selected={on || undefined}
                  style={tileColors(it.rarity)}
                >
                  {it.icon && <img src={it.icon} alt="" className="pointer-events-none size-7 object-contain" />}
                </button>
              )
            })}
            {!build.items.length && <span className="text-sm text-ink-mute">{tr('Ajoute d’abord des objets.', 'Add items first.')}</span>}
            <Button variant="ghost" className="ml-auto hover:text-bad" onClick={() => onChange(notes.filter((_, j) => j !== i))}>
              {tr('Supprimer', 'Delete')}
            </Button>
          </div>
          <textarea
            value={typeof n.text === 'string' ? n.text : ''}
            maxLength={LIMITS.text}
            rows={2}
            onChange={(e) => patch(i, { text: e.target.value })}
            placeholder={tr('Ce que ces objets font ensemble…', 'What these items do together…')}
            aria-label={tr('Explication de la synergie', 'Synergy explanation')}
            className={cx(FIELD, 'resize-y')}
          />
        </div>
      ))}
      {notes.length < LIMITS.synergies && (
        <Button className="self-start" onClick={() => onChange([...notes, { items: [], text: '' }])}>
          + {tr('Ajouter une synergie', 'Add a synergy')}
        </Button>
      )}
    </div>
  )
}

/** "How to play" is typed as free text: one paragraph per line. */
export const splitParagraphs = (raw: string) => {
  const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  return lines.length > LIMITS.howTo ? [...lines.slice(0, LIMITS.howTo - 1), lines.slice(LIMITS.howTo - 1).join('\n')] : lines
}

export type EditorActions = (build: Build, valid: boolean) => ReactNode

/** Form to write a build. The parent owns saving and sharing through `actions`. */
export function BuildEditor({ initial, actions }: { initial: Build; actions: EditorActions }) {
  const { tr } = useLang()
  const [draft, setDraft] = useState<Build>(initial)
  const [howTo, setHowTo] = useState(() => initial.howTo.map(String).join('\n'))
  const { onHover, tooltip } = useTileTooltip()
  const set = (p: Partial<Build>) => setDraft((d) => ({ ...d, ...p }))
  const s = (v: unknown) => (typeof v === 'string' ? v : '')

  const build: Build = useMemo(() => ({ ...draft, howTo: splitParagraphs(howTo) }), [draft, howTo])
  const selected = useMemo(() => new Set(draft.items.map((i) => i.id)), [draft.items])
  const valid = !!s(draft.name).trim() && draft.items.length > 0
  const detection = useMemo(() => ({ ...build, synergies: [] }), [build])

  // Functional update: several quick clicks in the picker must all count.
  const toggle = (it: Item) =>
    setDraft((d) => {
      const had = d.items.some((x) => x.id === it.id)
      if (!had && d.items.length >= LIMITS.items) return d
      return {
        ...d,
        items: had ? d.items.filter((x) => x.id !== it.id) : [...d.items, { id: it.id }],
        // A removed item also leaves the synergy notes.
        synergies: had ? d.synergies.map((n) => ({ ...n, items: n.items.filter((x) => x !== it.id) })) : d.synergies,
      }
    })

  return (
    <div className="flex flex-col gap-8 pb-28">
      <Section title={tr('Le build', 'The build')}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={tr('Nom', 'Name')} hint="*" count={[s(draft.name).length, LIMITS.name]}>
            <input value={s(draft.name)} maxLength={LIMITS.name} onChange={(e) => set({ name: e.target.value })} className={FIELD} placeholder={tr('Poupée automatique', 'Automatic doll')} />
          </Field>
          <Field label={tr('Auteur', 'Author')} hint={tr('facultatif', 'optional')}>
            <input value={draft.author ?? ''} maxLength={LIMITS.author} onChange={(e) => set({ author: e.target.value || undefined })} className={FIELD} placeholder={tr('Ton pseudo', 'Your nickname')} />
          </Field>
          <Field label={tr('Accroche', 'Tagline')} hint={tr('une phrase', 'one line')}>
            <input value={s(draft.tagline)} maxLength={LIMITS.line} onChange={(e) => set({ tagline: e.target.value || undefined })} className={FIELD} placeholder={tr('La poupée déclenche toute la chaîne.', 'The doll sets off the whole chain.')} />
          </Field>
          <Field label={tr('Étiquette', 'Badge')} hint={tr('difficulté, DLC…', 'difficulty, DLC…')}>
            <input value={s(draft.tag)} maxLength={LIMITS.line} onChange={(e) => set({ tag: e.target.value || undefined })} className={FIELD} placeholder={tr('Simple à assembler · SotV', 'Easy to assemble · SotV')} />
          </Field>
        </div>
        <Field label={tr('Description', 'Description')} count={[s(draft.summary).length, LIMITS.text]}>
          <textarea value={s(draft.summary)} maxLength={LIMITS.text} rows={3} onChange={(e) => set({ summary: e.target.value || undefined })} className={cx(FIELD, 'resize-y')} placeholder={tr('Le principe du build en quelques phrases.', 'The idea of the build in a few sentences.')} />
        </Field>
      </Section>

      <Section title={tr('Personnage', 'Survivor')}>
        <SurvivorPicker value={draft.survivor} onChange={(survivor) => set({ survivor })} />
      </Section>

      <Section title={tr('Compétences ou boucle', 'Skills or loop')}>
        <div className="grid gap-4 md:grid-cols-[minmax(0,14rem)_1fr]">
          <Field label={tr('Titre', 'Title')}>
            <input value={s(draft.skills?.label)} maxLength={LIMITS.line} onChange={(e) => set({ skills: { text: s(draft.skills?.text), label: e.target.value || undefined } })} className={FIELD} placeholder={tr('Compétences', 'Skills')} />
          </Field>
          <Field label={tr('Contenu', 'Content')}>
            <input value={s(draft.skills?.text)} maxLength={LIMITS.text} onChange={(e) => set({ skills: { label: draft.skills?.label, text: e.target.value } })} className={FIELD} placeholder={tr('Hachoir · Lance-flammes · Roulade · Huile', 'Dice · Sear · Roll · Glaze')} />
          </Field>
        </div>
      </Section>

      <Section title={tr('Objets', 'Items')} aside={<span className="font-label text-[11px] text-ink-mute">{draft.items.length}/{LIMITS.items}</span>}>
        <ItemRows items={draft.items} onChange={(items) => set({ items })} />
        <ItemPicker selected={selected} onToggle={toggle} />
      </Section>

      <Section title={tr('Comment le jouer', 'How to play')}>
        <Field label={tr('Conseils', 'Tips')} hint={tr('un paragraphe par ligne', 'one paragraph per line')}>
          <textarea value={howTo} rows={5} maxLength={LIMITS.text * 4} onChange={(e) => setHowTo(e.target.value)} className={cx(FIELD, 'resize-y')} placeholder={tr('Par quoi commencer, quoi éviter, comment se placer…', 'What to start with, what to avoid, how to position…')} />
        </Field>
      </Section>

      <Section title={tr('Synergies', 'Synergies')}>
        <SynergyRows build={draft} onChange={(synergies) => set({ synergies })} />
        <div className="flex flex-col gap-2 border-t-2 border-line pt-3">
          <span className="text-sm text-ink-mute">{tr('Ce que le Codex repère entre tes objets :', 'What the Codex spots between your items:')}</span>
          <BuildSynergies build={detection} onHover={onHover} compact />
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-bar/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
          {!valid && <span className="text-sm text-ink-mute">{tr('Il faut un nom et au moins un objet.', 'A name and at least one item are needed.')}</span>}
          <span className="ml-auto flex flex-wrap gap-2">{actions(build, valid)}</span>
        </div>
      </div>
      {tooltip}
    </div>
  )
}
