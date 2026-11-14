import { Link } from '@tanstack/react-router'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { RARITY_BY_ID, TIERS, TIER_OF, tileColors } from '#/lib/catalog'
import type { Search } from '#/lib/filters'
import { useLang } from '#/lib/i18n'
import { RichText } from '#/lib/richText'
import type { Item } from '#/lib/types'

type Hover = { item: Item; rect: DOMRect }

export function ItemTile({
  item,
  selected,
  size = 56,
  onHover,
}: {
  item: Item
  selected?: boolean
  size?: number
  onHover?: (h: Hover | null) => void
}) {
  const { lang } = useLang()
  const show = (el: HTMLElement) => onHover?.({ item, rect: el.getBoundingClientRect() })
  const hide = () => onHover?.(null)
  return (
    <Link
      to="/"
      search={(prev: Search) => ({ ...prev, item: item.id })}
      resetScroll={false}
      aria-label={lang === 'fr' ? `${item.name.fr} (${item.name.en})` : item.name.en}
      aria-current={selected ? 'true' : undefined}
      data-selected={selected || undefined}
      className="frame tile"
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={hide}
      onFocus={(e) => show(e.currentTarget)}
      onBlur={hide}
      onClick={hide}
      style={{ ...tileColors(item.rarity), width: size, height: size }}
    >
      {item.icon ? (
        <img
          src={item.icon}
          alt=""
          width={size - 10}
          height={size - 10}
          loading="lazy"
          decoding="async"
          className="pointer-events-none object-contain"
          style={{ width: size - 10, height: size - 10 }}
        />
      ) : (
        <span className="font-label text-xs text-ink-mute">{item.name.fr.slice(0, 2)}</span>
      )}
    </Link>
  )
}

const GAP = 8
const MARGIN = 8

/** Name + short effect, always kept inside the window (shifts sideways, flips below near the top). */
function TileTooltip({ hover }: { hover: Hover }) {
  const { lang } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const { rect } = hover
    const w = el.offsetWidth
    const h = el.offsetHeight
    const vw = document.documentElement.clientWidth
    const left = Math.min(Math.max(rect.left + rect.width / 2 - w / 2, MARGIN), vw - w - MARGIN)
    const above = rect.top - GAP - h
    const top = above >= MARGIN ? above : rect.bottom + GAP
    setPos({ left, top })
  }, [hover])
  const { item } = hover
  const rarity = RARITY_BY_ID[item.rarity]
  const pickup = item.pickup[lang] || item.pickup.fr
  return (
    <div
      ref={ref}
      role="tooltip"
      className="tile-tip"
      style={{
        ...tileColors(item.rarity),
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      <div className="font-pixel text-[17px] font-semibold leading-tight">{item.name[lang]}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-xs">
        <span className="px-label" style={{ color: rarity.color }}>
          {rarity[lang]}
        </span>
        {lang === 'fr' && item.name.en !== item.name.fr && <span className="truncate text-ink-mute">· {item.name.en}</span>}
      </div>
      {pickup && (
        <p className="m-0 mt-1.5 text-[13px] leading-snug text-ink-soft">
          <RichText text={pickup} />
        </p>
      )}
    </div>
  )
}

type Group = { id: string; label: string; sub?: string; color: string; items: Item[] }

/**
 * Splits a rarity-sorted list into tier groups ("Commun", "Peu commun"…), in order of first appearance.
 * A tier can span non-adjacent rarities (elite aspects sort after lunar equipment but belong to "Équipement").
 */
function groupByTier(items: Item[], lang: 'fr' | 'en'): Group[] {
  const tiers = Object.fromEntries(TIERS.map((t) => [t.id, t]))
  const groups = new Map<string, Group>()
  for (const it of items) {
    const id = TIER_OF[it.rarity]
    let g = groups.get(id)
    if (!g) {
      const t = tiers[id]
      // "Sacré (Hallowed Concepts)" → label "Sacré", sub "Hallowed Concepts"
      const m = t[lang].match(/^(.*?)\s*\((.*)\)$/)
      g = { id, label: m ? m[1] : t[lang], sub: m?.[2], color: t.color, items: [] }
      groups.set(id, g)
    }
    g.items.push(it)
  }
  return [...groups.values()]
}

function TileWall({ items, search, onHover }: { items: Item[]; search: Search; onHover: (h: Hover | null) => void }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,56px)] justify-center gap-1.5 sm:justify-start">
      {items.map((it) => (
        <ItemTile key={it.id} item={it} selected={search.item === it.id} onHover={onHover} />
      ))}
    </div>
  )
}

/**
 * Hover state for item tiles: pass `onHover` to each ItemTile and render `tooltip` once.
 * The tooltip hides on any scroll or resize, since it is positioned from the tile's rect.
 */
export function useTileTooltip() {
  const [hover, setHover] = useState<Hover | null>(null)
  useLayoutEffect(() => {
    if (!hover) return
    const hide = () => setHover(null)
    window.addEventListener('scroll', hide, { passive: true, capture: true })
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', hide, { capture: true })
      window.removeEventListener('resize', hide)
    }
  }, [hover])
  return { onHover: setHover, tooltip: hover ? <TileTooltip hover={hover} /> : null }
}

export function ItemGrid({ items, search }: { items: Item[]; search: Search }) {
  const { lang, tr } = useLang()
  const { onHover: setHover, tooltip } = useTileTooltip()

  // Group by tier only when the list is in rarity order (searching ranks name matches first).
  const grouped = (search.s ?? 'rarity') === 'rarity' && !search.q?.trim()
  const groups = useMemo(() => (grouped ? groupByTier(items, lang) : []), [grouped, items, lang])

  if (!items.length)
    return (
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 border-2 border-dashed border-line-2 px-6 py-10 text-center">
        <svg width="40" height="40" viewBox="0 0 10 10" aria-hidden shapeRendering="crispEdges" fill="#3a404c">
          <rect x="1" y="1" width="8" height="1" />
          <rect x="1" y="8" width="8" height="1" />
          <rect x="1" y="2" width="1" height="6" />
          <rect x="8" y="2" width="1" height="6" />
          <rect x="4" y="3" width="2" height="2" fill="#5a6170" />
          <rect x="4" y="6" width="2" height="1" fill="#5a6170" />
        </svg>
        <div className="font-pixel text-lg font-semibold text-ink-soft">{tr('Aucun objet trouvé', 'No item found')}</div>
        <p className="m-0 text-sm text-ink-mute">
          {tr('Essayez un autre mot ou retirez un filtre.', 'Try another word or remove a filter.')}
        </p>
      </div>
    )

  return (
    <>
      {grouped ? (
        <div className="flex flex-col gap-5">
          {groups.map((g) => (
            <section key={g.id} aria-labelledby={`tier-${g.id}`}>
              <h2 id={`tier-${g.id}`} className="group-head m-0 -mx-1 mb-2 flex items-center gap-2.5 px-1 py-1.5">
                <span className="size-2.5 shrink-0" style={{ background: g.color, boxShadow: `0 0 10px ${g.color}` }} />
                <span className="px-label text-[12px] text-ink">{g.label}</span>
                {g.sub && <span className="hidden text-xs text-ink-mute sm:inline">{g.sub}</span>}
                <span className="font-label text-[11px] tabular-nums text-ink-mute">{g.items.length}</span>
                <span
                  aria-hidden
                  className="h-0.5 flex-1"
                  style={{ background: `linear-gradient(90deg, ${g.color}55, transparent 70%)` }}
                />
              </h2>
              <TileWall items={g.items} search={search} onHover={setHover} />
            </section>
          ))}
        </div>
      ) : (
        <TileWall items={items} search={search} onHover={setHover} />
      )}
      {tooltip}
    </>
  )
}
