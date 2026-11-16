import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import { RARITY_BY_ID, tileColors } from '#/lib/catalog'
import { txt, type Build, type Text } from '#/lib/builds'
import { useLang } from '#/lib/i18n'
import { BY_ID, BY_WIKI_NAME, itemSlug } from '#/lib/items'
import { buildSynergies } from '#/lib/related'
import { RichText } from '#/lib/richText'
import { SURVIVOR_BY_ID, survivorIcon, type SurvivorId } from '#/lib/survivors'
import type { Item } from '#/lib/types'
import { useTileTooltip } from './ItemGrid'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

type OnHover = ReturnType<typeof useTileTooltip>['onHover']

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 flex items-center gap-2.5">
        <span className="px-label text-ink-dim">{title}</span>
        {aside}
        <span aria-hidden className="h-0.5 flex-1 bg-gradient-to-r from-line-2 to-transparent" />
      </h2>
      {children}
    </section>
  )
}

/** Survivor portrait in a square frame, or the "generic" glyph when the build has no survivor. */
export function SurvivorPortrait({ id, size = 48 }: { id: SurvivorId | null; size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden border-2 border-line-2 bg-[#14171d]"
      style={{ width: size, height: size }}
    >
      {id ? (
        <img src={survivorIcon(id)} alt="" width={size} height={size} loading="lazy" className="size-full object-cover" />
      ) : (
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill="#f2c94c">
          <rect x="0" y="0" width="3" height="3" />
          <rect x="4" y="0" width="3" height="3" opacity=".55" />
          <rect x="0" y="4" width="3" height="3" opacity=".55" />
          <rect x="4" y="4" width="3" height="3" />
        </svg>
      )}
    </span>
  )
}

export function survivorLabel(id: SurvivorId | null, lang: 'fr' | 'en') {
  return id ? SURVIVOR_BY_ID[id].name[lang] : lang === 'fr' ? 'Générique' : 'Generic'
}

/** Small item icon linking to its page, with the shared hover tooltip. */
export function ItemIcon({ item, size = 40, onHover }: { item: Item; size?: number; onHover?: OnHover }) {
  const { lang } = useLang()
  const show = (el: HTMLElement) => onHover?.({ item, rect: el.getBoundingClientRect() })
  const hide = () => onHover?.(null)
  return (
    <Link
      to="/items/$slug"
      params={{ slug: itemSlug(item) }}
      search={{}}
      aria-label={item.name[lang]}
      className="frame tile shrink-0"
      style={{ ...tileColors(item.rarity), width: size, height: size }}
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={hide}
      onFocus={(e) => show(e.currentTarget)}
      onBlur={hide}
      onClick={hide}
    >
      {item.icon && <img src={item.icon} alt="" loading="lazy" className="pointer-events-none object-contain" style={{ width: size - 8, height: size - 8 }} />}
    </Link>
  )
}

function ItemCard({ item, role, core }: { item: Item; role?: Text; core?: boolean }) {
  const { lang, tr } = useLang()
  const rarity = RARITY_BY_ID[item.rarity]
  const pickup = item.pickup[lang] || item.pickup.fr
  return (
    <Link
      to="/items/$slug"
      params={{ slug: itemSlug(item) }}
      search={{}}
      className="px-focus group flex flex-col gap-2.5 border-2 border-line bg-card p-3 transition-colors hover:border-[#3a404c] hover:bg-[#161920]"
      style={{ boxShadow: `inset 0 2px 0 ${rarity.color}` }}
    >
      <span className="flex items-center gap-3">
        <span className="frame size-[52px] shrink-0" style={tileColors(item.rarity)}>
          {item.icon && <img src={item.icon} alt="" loading="lazy" className="size-[42px] object-contain" />}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="px-label" style={{ color: rarity.color }}>
              {rarity[lang]}
            </span>
            {core && <span className="px-label bg-accent px-1 text-bg">{tr('Essentiel', 'Core')}</span>}
          </span>
          <span className="font-pixel text-[17px] font-semibold leading-tight text-ink">{item.name[lang]}</span>
          {lang === 'fr' && item.name.en !== item.name.fr && <span className="truncate text-xs leading-none text-ink-mute">{item.name.en}</span>}
        </span>
      </span>
      {pickup && (
        <span className="text-sm leading-snug text-ink-dim">
          <RichText text={pickup} />
        </span>
      )}
      {role && <span className="mt-auto text-[13px] font-medium leading-snug text-accent">{txt(role, lang)}</span>}
    </Link>
  )
}

/** Author notes plus the synergies the app finds on its own between the build's items. */
export function BuildSynergies({ build, onHover, compact }: { build: Build; onHover: OnHover; compact?: boolean }) {
  const { lang, tr } = useLang()
  const items = useMemo(() => build.items.map((i) => BY_ID.get(i.id)).filter((x): x is Item => !!x), [build.items])
  const { combos, warnings } = useMemo(() => buildSynergies(items, BY_WIKI_NAME, lang), [items, lang])
  const notes = build.synergies.filter((s) => txt(s.text, lang).trim())

  if (!notes.length && !combos.length && !warnings.length)
    return compact ? (
      <p className="m-0 text-sm text-ink-mute">{tr('Ajoute des objets : les synergies trouvées apparaîtront ici.', 'Add items: the synergies found will show up here.')}</p>
    ) : null

  return (
    <div className="flex flex-col gap-4">
      {warnings.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {warnings.map((w, i) => (
            <li key={i} className="flex items-center gap-3 border-2 border-bad/50 bg-bad/5 p-2 pr-3">
              <span className="flex shrink-0 gap-1">
                <ItemIcon item={w.a} size={36} onHover={onHover} />
                <ItemIcon item={w.b} size={36} onHover={onHover} />
              </span>
              <span className="text-sm leading-snug text-ink-soft">
                <strong className="font-semibold text-bad">{tr('Attention · ', 'Heads-up · ')}</strong>
                {w.why}
              </span>
            </li>
          ))}
        </ul>
      )}

      {notes.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {notes.map((n, i) => (
            <li key={i} className="flex flex-col gap-2 border-2 border-line bg-card p-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="flex shrink-0 flex-wrap items-center gap-1">
                {n.items.map((id, j) => {
                  const it = BY_ID.get(id)
                  return (
                    it && (
                      <span key={id} className="flex items-center gap-1">
                        {j > 0 && <span className="font-label text-xs text-ink-mute">+</span>}
                        <ItemIcon item={it} size={40} onHover={onHover} />
                      </span>
                    )
                  )
                })}
              </span>
              <span className="whitespace-pre-line text-[15px] leading-snug text-ink-soft">{txt(n.text, lang)}</span>
            </li>
          ))}
        </ul>
      )}

      {combos.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="px-label text-ink-mute">{tr('Trouvées automatiquement', 'Found automatically')}</div>
          <ul className="m-0 grid list-none gap-2 p-0 md:grid-cols-2">
            {combos.map((c) => (
              <li key={c.title} className="flex flex-col gap-2 border-2 border-dashed border-line-2 p-3">
                <span className="font-pixel text-base font-semibold leading-tight text-info">{c.title}</span>
                <span className="flex flex-wrap items-center gap-1">
                  {c.from.map((it) => (
                    <ItemIcon key={it.id} item={it} size={34} onHover={onHover} />
                  ))}
                  {c.from.length > 0 && <span className="px-1 font-label text-xs text-ink-mute">×</span>}
                  {c.items.map((it) => (
                    <ItemIcon key={it.id} item={it} size={34} onHover={onHover} />
                  ))}
                </span>
                <span className="text-sm leading-snug text-ink-dim">{c.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** A whole build, as a page. `actions` are the buttons shown under the title (share, edit…). */
export function BuildView({ build, actions, notice }: { build: Build; actions?: ReactNode; notice?: ReactNode }) {
  const { lang, tr } = useLang()
  const { onHover, tooltip } = useTileTooltip()
  const items = build.items.map((b) => ({ ...b, item: BY_ID.get(b.id) })).filter((b) => b.item)
  const howTo = build.howTo.map((h) => txt(h, lang)).filter((h) => h.trim())
  const tagline = txt(build.tagline, lang)
  const tag = txt(build.tag, lang)
  const summary = txt(build.summary, lang)

  return (
    <article className="flex flex-col gap-8">
      {notice}
      <header className="flex flex-col gap-4 border-b-2 border-line pb-6 sm:flex-row sm:items-start sm:gap-5">
        <SurvivorPortrait id={build.survivor} size={88} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-label text-accent">
              {build.survivor ? `Build · ${survivorLabel(build.survivor, lang)}` : tr('Build générique', 'Generic build')}
            </span>
            {tag && <span className="border-2 border-line-2 px-1.5 py-0.5 text-xs font-medium text-ink-soft">{tag}</span>}
          </div>
          <h1 className="m-0 font-pixel text-[34px] font-semibold leading-[1.05] [text-wrap:balance] sm:text-[42px]">{txt(build.name, lang)}</h1>
          {tagline && <p className="m-0 font-pixel text-xl leading-tight text-accent">{tagline}</p>}
          {build.author && (
            <p className="m-0 text-sm text-ink-mute">
              {tr('par', 'by')} <span className="text-ink-soft">{build.author}</span>
            </p>
          )}
          {summary && <p className="m-0 mt-1 max-w-3xl whitespace-pre-line text-base leading-relaxed text-ink-soft">{summary}</p>}
          {actions && <div className="mt-2 flex flex-wrap gap-2">{actions}</div>}
        </div>
      </header>

      {build.skills && txt(build.skills.text, lang) && (
        <div className="border-l-2 border-accent pl-4">
          <div className="font-pixel text-base font-semibold">{txt(build.skills.label, lang) || tr('Compétences', 'Skills')}</div>
          <div className="whitespace-pre-line text-[15px] leading-snug text-ink-dim">{txt(build.skills.text, lang)}</div>
        </div>
      )}

      {items.length > 0 && (
        <Section title={tr('Objets', 'Items')} aside={<span className="font-label text-[11px] text-ink-mute">{items.length}</span>}>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <ItemCard key={b.id} item={b.item!} role={b.role} core={b.core} />
            ))}
          </div>
        </Section>
      )}

      {howTo.length > 0 && (
        <Section title={tr('Comment le jouer', 'How to play')}>
          <div className="flex max-w-3xl flex-col gap-3">
            {howTo.map((h, i) => (
              <p key={i} className="m-0 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                {h}
              </p>
            ))}
          </div>
        </Section>
      )}

      <Section title={tr('Synergies', 'Synergies')}>
        <BuildSynergies build={build} onHover={onHover} />
      </Section>

      {build.sources && build.sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-line pt-4 text-sm">
          <span className="px-label text-ink-mute">{tr('Sources', 'Sources')}</span>
          {build.sources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="px-focus text-accent underline-offset-2 hover:underline">
              {s.label}
            </a>
          ))}
        </div>
      )}
      {tooltip}
    </article>
  )
}

/** One build in a list: portrait, name, tagline and its items. Links to an official build or a saved one. */
export function BuildCard({ build, target }: { build: Build; target: { slug: string } | { id: string } }) {
  const { lang } = useLang()
  const items = build.items.map((b) => BY_ID.get(b.id)).filter((x): x is Item => !!x)
  const shown = items.slice(0, 7)
  const tagline = txt(build.tagline, lang) || txt(build.summary, lang)
  const link = 'slug' in target ? ({ to: '/builds/$slug', params: { slug: target.slug } } as const) : ({ to: '/builds/view', search: { id: target.id } } as const)
  return (
    <Link
      {...link}
      className={cx(
        'px-focus group flex flex-col gap-3 border-2 border-line bg-card p-3.5 transition-[border-color,background-color,transform]',
        'hover:-translate-y-0.5 hover:border-[#3a404c] hover:bg-[#161920]',
      )}
    >
      <span className="flex items-start gap-3">
        <SurvivorPortrait id={build.survivor} size={44} />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="px-label text-ink-mute">{survivorLabel(build.survivor, lang)}</span>
          <span className="font-pixel text-lg font-semibold leading-tight text-ink group-hover:text-accent">{txt(build.name, lang) || '—'}</span>
        </span>
      </span>
      {tagline && <span className="line-clamp-2 text-sm leading-snug text-ink-dim">{tagline}</span>}
      <span className="mt-auto flex items-center gap-1">
        {shown.map((it) => (
          <span key={it.id} className="frame size-8 shrink-0" style={tileColors(it.rarity)}>
            {it.icon && <img src={it.icon} alt="" loading="lazy" className="size-6 object-contain" />}
          </span>
        ))}
        {items.length > shown.length && <span className="pl-1 font-label text-xs text-ink-mute">+{items.length - shown.length}</span>}
      </span>
    </Link>
  )
}
