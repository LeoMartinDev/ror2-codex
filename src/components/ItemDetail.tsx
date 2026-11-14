import { Link } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import { DLC_BY_ID, RARITY_BY_ID, RARITY_ORDER, tileColors } from '#/lib/catalog'
import type { Search } from '#/lib/filters'
import { useLang } from '#/lib/i18n'
import { itemFacts, relatedItems, synergyGroups } from '#/lib/related'
import { RichText } from '#/lib/richText'
import type { Item, LinkKind } from '#/lib/types'
import { ItemTile, useTileTooltip } from './ItemGrid'
import { StatCard } from './StatCard'
import { Button } from './ui'

type Props = {
  item: Item
  all: Item[]
  byId: Map<string, Item>
  byWikiName: Map<string, Item>
  onClose: () => void
}

const GROUPS: { kind: LinkKind; fr: string; en: string; color: string }[] = [
  { kind: 'boost', fr: 'Le renforcent', en: 'Boosted by', color: '#9ad13b' },
  { kind: 'combo', fr: 'Bon combo', en: 'Good combo', color: '#7cc4f5' },
  { kind: 'none', fr: 'Ne marche pas avec', en: 'Does not work with', color: '#ff7f7f' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="m-0 flex items-center gap-2.5">
        <span className="px-label text-ink-dim">{title}</span>
        <span aria-hidden className="h-0.5 flex-1 bg-gradient-to-r from-line-2 to-transparent" />
      </h2>
      {children}
    </section>
  )
}

function ItemRow({ item, why, border }: { item: Item; why?: string; border?: string }) {
  const { lang } = useLang()
  return (
    <Link
      to="/"
      search={(prev: Search) => ({ ...prev, item: item.id })}
      resetScroll={false}
      className="px-focus group flex items-center gap-3 border-2 border-line bg-card p-1.5 pr-3 transition-colors hover:border-[#3a404c] hover:bg-[#171a20]"
      style={{ borderColor: border }}
    >
      <span className="frame size-[44px] shrink-0" style={tileColors(item.rarity)}>
        {item.icon && <img src={item.icon} alt="" className="size-[34px] object-contain" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-pixel text-base font-semibold leading-tight text-ink">{item.name[lang]}</span>
        {why && <span className="text-sm leading-snug text-ink-dim">{why}</span>}
      </span>
      <span aria-hidden className="text-ink-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink">
        ›
      </span>
    </Link>
  )
}

export function ItemDetail({ item, all, byId, byWikiName, onClose }: Props) {
  const { lang, tr, loc } = useLang()
  const { onHover, tooltip } = useTileTooltip()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rarity = RARITY_BY_ID[item.rarity]
  const dlc = DLC_BY_ID[item.dlc]
  const facts = itemFacts(item, lang)
  const related = relatedItems(item, byId, lang)
  const synergies = synergyGroups(item, all, RARITY_ORDER, new Set(related.map((r) => r.item.id)), lang)
  const corrupts = (item.corrupts?.split(/,\s*/).map((n) => byWikiName.get(n)).filter(Boolean) ?? []) as Item[]
  const corruptedBy = item.corruptedBy ? byWikiName.get(item.corruptedBy) : undefined
  // In French, the English name is shown as a subtitle (it is what the wiki and most guides use).
  const subtitle = lang === 'fr' && item.name.en !== item.name.fr ? item.name.en : null

  return (
    <div className="flex h-full flex-col">
      <header
        className="relative flex shrink-0 items-center gap-4 overflow-hidden border-b-2 border-line px-5 pb-4 pt-5 pr-16"
        style={{
          ...tileColors(item.rarity),
          background: `radial-gradient(260px 160px at 52px 50%, ${rarity.color}38, transparent 75%), linear-gradient(180deg, ${rarity.color}14, transparent 70%), #0d0f13`,
          boxShadow: `inset 0 3px 0 ${rarity.color}`,
        }}
      >
        {/* Faint scanlines over the banner */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px)' }}
        />
        <div className="frame fade-up size-[76px] shrink-0" style={{ boxShadow: `0 0 28px -6px ${rarity.color}, 0 3px 0 #000` }}>
          {item.icon && <img src={item.icon} alt="" className="size-[62px] object-contain" />}
        </div>
        <div className="relative flex min-w-0 flex-col gap-1.5">
          <h1 className="m-0 font-pixel text-[26px] font-semibold leading-[1.05] [text-wrap:balance]">{item.name[lang]}</h1>
          {subtitle && <div className="truncate text-sm leading-none text-ink-mute">{subtitle}</div>}
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span
              className="px-label px-1.5 py-0.5 text-bg"
              style={{ background: rarity.color, boxShadow: `0 0 12px -2px ${rarity.color}` }}
            >
              {rarity[lang]}
            </span>
            <span className="px-label border-2 border-line-2 bg-black/30 px-1.5 py-px text-ink-dim" title={dlc[lang]}>
              {dlc.short}
            </span>
          </div>
        </div>
        <Button
          onClick={onClose}
          aria-label={tr('Fermer', 'Close')}
          title={tr('Fermer (Échap)', 'Close (Esc)')}
          className="absolute right-4 top-4 w-9 justify-center px-0"
        >
          <svg width="12" height="12" viewBox="0 0 6 6" aria-hidden shapeRendering="crispEdges" fill="currentColor">
            <rect x="0" y="0" width="1" height="1" /><rect x="1" y="1" width="1" height="1" /><rect x="2" y="2" width="2" height="2" />
            <rect x="4" y="4" width="1" height="1" /><rect x="5" y="5" width="1" height="1" /><rect x="5" y="0" width="1" height="1" />
            <rect x="4" y="1" width="1" height="1" /><rect x="1" y="4" width="1" height="1" /><rect x="0" y="5" width="1" height="1" />
          </svg>
        </Button>
      </header>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-3 px-5 pb-4 pt-4">
          <p className="m-0 text-[17px] leading-snug">
            <RichText text={item.pickup[lang] || item.desc[lang]} />
          </p>
          {item.explain && (
            <div className="relative border-2 border-[#1f4a66] bg-[linear-gradient(180deg,#10202c,#0d1820)] py-2.5 pl-4 pr-3 shadow-[inset_3px_0_0_var(--color-info)]">
              <div className="px-label mb-1 flex items-center gap-1.5 text-info">
                <svg width="10" height="10" viewBox="0 0 5 5" aria-hidden shapeRendering="crispEdges" fill="currentColor">
                  <rect x="2" y="0" width="1" height="1" />
                  <rect x="2" y="2" width="1" height="3" />
                </svg>
                {tr('Comment ça marche', 'How it works')}
              </div>
              <p className="m-0 text-[15px] leading-snug text-ink-soft">{loc(item.explain)}</p>
            </div>
          )}
        </div>
        {facts.length > 0 && (
          <dl className="m-0 mx-5 mb-1 grid grid-cols-[max-content_1fr] border-2 border-line bg-[#0c0e12]">
            {facts.map((f, i) => (
              <div key={f.k} className="contents">
                <dt className={['px-label px-3 py-2 text-ink-mute', i > 0 && 'border-t-2 border-[#191c23]'].filter(Boolean).join(' ')}>
                  {f.k}
                </dt>
                <dd className={['m-0 px-3 py-1.5 text-[15px] leading-snug', i > 0 && 'border-t-2 border-[#191c23]'].filter(Boolean).join(' ')}>
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex flex-col gap-6 px-5 py-5">
          <Section title={tr('Évolution avec les copies', 'Scaling with stacks')}>
            {item.stacking.length ? (
              item.stacking.map((s, i) => <StatCard key={i} s={s} color={rarity.color} />)
            ) : (
              <p className="m-0 border-2 border-dashed border-line-2 p-3 text-[15px] text-ink-dim">
                {item.kind === 'equipment'
                  ? tr('Un seul équipement à la fois : il ne se cumule pas.', 'One equipment at a time: it does not stack.')
                  : tr('Pas de stat de cumul connue pour cet objet. Voir le texte du jeu.', 'No known stacking stat for this item. See the game text.')}
              </p>
            )}
          </Section>

          {(related.length > 0 || synergies.length > 0) && (
            <Section title={tr('Synergies', 'Synergies')}>
              {GROUPS.map((g) => {
                const rows = related.filter((r) => r.kind === g.kind)
                if (!rows.length) return null
                return (
                  <div key={g.kind} className="flex flex-col gap-1.5">
                    <div className="px-label flex items-center gap-1.5" style={{ color: g.color }}>
                      <span className="size-1.5" style={{ background: g.color }} />
                      {g[lang]}
                    </div>
                    {rows.map((r) => (
                      <ItemRow key={`${g.kind}-${r.item.id}`} item={r.item} why={r.why} />
                    ))}
                  </div>
                )
              })}
              {synergies.map((g) => (
                <div key={g.title} className="flex flex-col gap-1.5 border-2 border-line bg-card p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="font-pixel text-base font-semibold leading-tight">{g.title}</div>
                  <p className="m-0 text-sm leading-snug text-ink-dim">{g.why}</p>
                  <div className="mt-1 grid grid-cols-[repeat(auto-fill,44px)] gap-1.5">
                    {g.items.map((it) => (
                      <ItemTile key={it.id} item={it} size={44} onHover={onHover} />
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {(corrupts.length > 0 || corruptedBy) && (
            <Section title={tr('Vide', 'Void')}>
              {corruptedBy && (
                <div className="flex flex-col gap-1">
                  <div className="px-label text-[#ed7fcd]">{tr('Version du Vide', 'Void version')}</div>
                  <ItemRow
                    item={corruptedBy}
                    why={tr(
                      'Si vous la ramassez, elle remplace toutes vos copies de cet objet.',
                      'If you pick it up, it replaces every stack of this item.',
                    )}
                    border="#5c2a66"
                  />
                </div>
              )}
              {corrupts.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="px-label text-[#ed7fcd]">{tr('Remplace', 'Replaces')}</div>
                  {corrupts.map((c) => (
                    <ItemRow
                      key={c.id}
                      item={c}
                      why={tr('Toutes vos copies de cet objet deviennent celui-ci.', 'All your stacks of that item turn into this one.')}
                      border="#5c2a66"
                    />
                  ))}
                </div>
              )}
            </Section>
          )}

          <details className="border-2 border-line bg-bar transition-colors hover:border-line-2">
            <summary className="px-focus flex items-center gap-2 px-3 py-2.5">
              <span className="px-label flex items-center gap-2 text-ink-mute">
                <span className="chev inline-block transition-transform">›</span>
                {tr('Texte du jeu', 'Game text')}
              </span>
            </summary>
            <p className="m-0 px-3 pb-3 text-[15px] leading-relaxed text-ink-soft">
              <RichText text={item.desc[lang] || item.pickup[lang]} />
            </p>
          </details>

          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-sm text-ink-mute">
            {item.unlock ? <span>{tr(`Défi : « ${item.unlock} »`, `Challenge: “${item.unlock}”`)}</span> : <span />}
            <a
              href={`https://riskofrain2.wiki.gg/wiki/${encodeURIComponent(item.wikiName.replace(/ /g, '_'))}`}
              target="_blank"
              rel="noreferrer"
              className="px-focus text-accent hover:underline"
            >
              {tr('Wiki (EN) ↗', 'Wiki ↗')}
            </a>
          </div>
        </div>
      </div>
      {tooltip}
    </div>
  )
}
