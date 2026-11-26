import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState, type CSSProperties } from 'react'
import { ItemIcon, Section } from '#/components/BuildView'
import { useTileTooltip } from '#/components/ItemGrid'
import { PageLayout } from '#/components/SiteNav'
import { Segmented } from '#/components/ui'
import { PORTAL_RULES, PORTALS, type Portal } from '#/data/portals'
import { DLC_BY_ID, DLCS } from '#/lib/catalog'
import { useLang } from '#/lib/i18n'
import { BY_ID } from '#/lib/items'
import type { DlcId } from '#/lib/types'

/** Every teleporter and portal: where it leads, what is there, and how to make it appear (src/data/portals.ts). */
export const Route = createFileRoute('/teleporters')({
  head: () => ({
    meta: [
      { title: 'Téléporteurs et portails — RoR2 Codex' },
      {
        name: 'description',
        content:
          'Tous les téléporteurs et portails de Risk of Rain 2 (base et DLC) : où ils mènent, ce qu’on y trouve et comment les faire apparaître.',
      },
    ],
  }),
  component: TeleportersPage,
})

type Filter = DlcId | 'all'

/** Pixel glyph: a ring for portals, a base with two horns for teleporters. */
function PortalGlyph({ kind, color, size = 44 }: { kind: Portal['kind']; color: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center border-2 border-line-2 bg-[#14171d]"
      style={{ width: size, height: size, boxShadow: `inset 0 0 14px -4px ${color}` }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 9 9" aria-hidden shapeRendering="crispEdges" fill={color}>
        {kind === 'portal' ? (
          <>
            <rect x="3" y="0" width="3" height="1" />
            <rect x="1" y="1" width="2" height="1" />
            <rect x="6" y="1" width="2" height="1" />
            <rect x="0" y="3" width="1" height="3" />
            <rect x="1" y="2" width="1" height="1" />
            <rect x="7" y="2" width="1" height="1" />
            <rect x="8" y="3" width="1" height="3" />
            <rect x="1" y="6" width="1" height="1" />
            <rect x="7" y="6" width="1" height="1" />
            <rect x="1" y="7" width="2" height="1" />
            <rect x="6" y="7" width="2" height="1" />
            <rect x="3" y="8" width="3" height="1" />
            <rect x="3" y="3" width="3" height="3" opacity=".45" />
          </>
        ) : (
          <>
            <rect x="0" y="1" width="1" height="4" />
            <rect x="1" y="4" width="1" height="2" />
            <rect x="8" y="1" width="1" height="4" />
            <rect x="7" y="4" width="1" height="2" />
            <rect x="4" y="2" width="1" height="3" opacity=".55" />
            <rect x="1" y="6" width="7" height="1" />
            <rect x="0" y="7" width="9" height="2" />
          </>
        )}
      </svg>
    </span>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="px-label text-ink-mute">{title}</div>
      {children}
    </div>
  )
}

function PortalCard({ portal, onHover }: { portal: Portal; onHover: ReturnType<typeof useTileTooltip>['onHover'] }) {
  const { lang, tr, loc } = useLang()
  const other = lang === 'fr' ? portal.name.en : portal.name.fr
  const items = (portal.items ?? []).map((id) => BY_ID.get(id)).filter((it) => it !== undefined)
  return (
    <article
      id={portal.id}
      className="flex scroll-mt-44 flex-col sm:scroll-mt-24 gap-4 border-2 border-line-2 bg-card p-4 shadow-[0_2px_0_rgba(0,0,0,0.5)]"
      style={{ borderTopColor: portal.color } as CSSProperties}
    >
      <header className="flex items-start gap-3">
        <PortalGlyph kind={portal.kind} color={portal.color} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="m-0 font-pixel text-2xl font-semibold leading-none">{loc(portal.name)}</h3>
            {other !== loc(portal.name) && <span className="text-sm text-ink-mute">{other}</span>}
          </div>
          <p className="m-0 text-[15px] leading-snug">
            <span className="text-ink-mute">{tr('Mène à ', 'Leads to ')}</span>
            <span className="font-medium" style={{ color: portal.color }}>
              {loc(portal.leadsTo)}
            </span>
          </p>
        </div>
        <span className="shrink-0 border-2 border-line-2 px-1.5 py-0.5 text-xs font-medium text-ink-soft" title={DLC_BY_ID[portal.dlc][lang]}>
          {DLC_BY_ID[portal.dlc].short}
        </span>
      </header>

      <Block title={tr('Ce qu’on y trouve', 'What it does')}>
        {portal.what.map((w, i) => (
          <p key={i} className="m-0 text-[15px] leading-relaxed text-ink-soft">
            {loc(w)}
          </p>
        ))}
      </Block>

      <Block title={portal.how.length > 1 ? tr('Comment l’obtenir · au choix', 'How to get it · any of') : tr('Comment l’obtenir', 'How to get it')}>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {portal.how.map((h, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
              <span
                aria-hidden
                className="mt-[3px] grid size-5 shrink-0 place-items-center font-label text-[11px] leading-none text-bg"
                style={{ background: portal.color }}
              >
                {i + 1}
              </span>
              <span>{loc(h)}</span>
            </li>
          ))}
        </ol>
      </Block>

      {portal.notes && portal.notes.length > 0 && (
        <div className="flex flex-col gap-1 border-l-2 border-line-2 pl-3">
          {portal.notes.map((n, i) => (
            <p key={i} className="m-0 text-sm leading-relaxed text-ink-dim">
              {loc(n)}
            </p>
          ))}
        </div>
      )}

      <footer className="mt-auto flex flex-wrap items-center gap-3 border-t-2 border-line pt-3">
        {items.length > 0 && (
          <div className="flex items-center gap-1.5">
            {items.map((it) => (
              <ItemIcon key={it.id} item={it} size={36} onHover={onHover} />
            ))}
          </div>
        )}
        <a
          href={portal.wiki}
          target="_blank"
          rel="noopener noreferrer"
          className="px-focus ml-auto text-sm text-accent underline-offset-2 hover:underline"
        >
          {tr('Source : wiki', 'Source: wiki')}
        </a>
      </footer>
    </article>
  )
}

function TeleportersPage() {
  const { lang, tr, loc } = useLang()
  const [filter, setFilter] = useState<Filter>('all')
  const { onHover, tooltip } = useTileTooltip()
  const groups = useMemo(
    () =>
      DLCS.map((d) => ({ dlc: d, portals: PORTALS.filter((p) => p.dlc === d.id) })).filter(
        (g) => g.portals.length > 0 && (filter === 'all' || g.dlc.id === filter),
      ),
    [filter],
  )
  const shown = groups.flatMap((g) => g.portals)

  return (
    <PageLayout current="teleporters" subtitle={tr('Téléporteurs & portails', 'Teleporters & portals')}>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b-2 border-line pb-6">
          <span className="px-label text-accent">{tr('Guide', 'Guide')}</span>
          <h1 className="m-0 font-pixel text-[34px] font-semibold leading-[1.05] sm:text-[42px]">
            {tr('Téléporteurs et portails', 'Teleporters and portals')}
          </h1>
          <p className="m-0 max-w-3xl text-base leading-relaxed text-ink-soft">
            {tr(
              `Les ${PORTALS.length} façons de quitter une étape : où chacune mène, ce qu’on y trouve et comment la faire apparaître.`,
              `The ${PORTALS.length} ways to leave a stage: where each one leads, what you find there and how to make it appear.`,
            )}
          </p>
        </header>

        <Section title={tr('À savoir', 'Good to know')}>
          <ul className="m-0 flex max-w-3xl list-none flex-col gap-2 p-0">
            {PORTAL_RULES.map((r, i) => (
              <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 bg-accent" />
                <span>{loc(r)}</span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="flex flex-col gap-3">
          <Segmented<Filter>
            label={tr('Extension', 'Expansion')}
            value={filter}
            onChange={setFilter}
            className="max-w-full self-start overflow-x-auto"
            options={[
              { value: 'all', label: tr('Tous', 'All') },
              ...DLCS.filter((d) => PORTALS.some((p) => p.dlc === d.id)).map((d) => ({ value: d.id as Filter, label: d.short, title: d[lang] })),
            ]}
          />
          <nav aria-label={tr('Aller à', 'Jump to')} className="flex flex-wrap gap-1.5">
            {shown.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="px-focus inline-flex items-center gap-1.5 border-2 border-line-2 bg-card px-2 py-1 text-sm text-ink-soft transition-colors hover:border-[#3a404c] hover:text-ink"
              >
                <span aria-hidden className="size-2.5 shrink-0" style={{ background: p.color }} />
                {loc(p.name)}
              </a>
            ))}
          </nav>
        </div>

        {groups.map((g) => (
          <Section key={g.dlc.id} title={g.dlc[lang]} aside={<span className="font-label text-[11px] text-ink-mute">{g.portals.length}</span>}>
            <div className="grid gap-3 lg:grid-cols-2">
              {g.portals.map((p) => (
                <PortalCard key={p.id} portal={p} onHover={onHover} />
              ))}
            </div>
          </Section>
        ))}
      </div>
      {tooltip}
    </PageLayout>
  )
}
