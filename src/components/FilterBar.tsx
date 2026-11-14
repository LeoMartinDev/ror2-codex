import { useEffect, useRef, useState } from 'react'
import { COLOR_BUCKETS, DLCS, EFFECT_FILTERS, EFFECT_FILTER_BY_ID, EFFECT_GROUPS, TIERS, TIER_OF } from '#/lib/catalog'
import { countBy, effectIds, joinList, list, type Search } from '#/lib/filters'
import { LangSwitch, useLang } from '#/lib/i18n'
import type { Item } from '#/lib/types'
import { Button, CheckRow, CONTROL_TEXT, Dropdown, FilterChip, Label, Segmented, Select, Swatch } from './ui'

type Props = {
  items: Item[]
  search: Search
  total: number
  shown: number
  onChange: (patch: Partial<Search>) => void
  onReset: () => void
}

function toggle(current: string | undefined, id: string) {
  const l = list(current)
  return joinList(l.includes(id) ? l.filter((x) => x !== id) : [...l, id])
}

export function FilterBar({ items, search, total, shown, onChange, onReset }: Props) {
  const { lang, tr } = useLang()
  const [q, setQ] = useState(search.q ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => setQ(search.q ?? ''), [search.q])
  // "/" focuses the search, like most catalogues.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      e.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    const id = setTimeout(() => {
      if ((search.q ?? '') !== q) onChange({ q: q || undefined })
    }, 150)
    return () => clearTimeout(id)
  }, [q])

  const rarityCounts = countBy(items, search, 'r', (it) => [TIER_OF[it.rarity]])
  const colorCounts = countBy(items, search, 'c', (it) => [it.colorBucket])
  const tagCounts = countBy(items, search, 't', effectIds)
  const dlcCounts = countBy(items, search, 'd', (it) => [it.dlc])
  const kindCounts = countBy(items, search, 'k', (it) => [it.kind])

  const r = list(search.r), c = list(search.c), t = list(search.t), d = list(search.d)
  const hasFilters = !!(search.q || r.length || c.length || t.length || d.length || search.k)

  return (
    <div className="topbar border-b-2 border-line">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:gap-5 lg:px-6">
        <a href="/" className="px-focus group flex items-center gap-2.5" aria-label={tr('RoR2 Codex, accueil', 'RoR2 Codex, home')}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 11 11"
            aria-hidden
            shapeRendering="crispEdges"
            className="drop-shadow-[0_0_8px_rgba(242,201,76,0.45)] transition-transform group-hover:rotate-90"
          >
            <rect width="11" height="11" fill="#f2c94c" />
            <rect x="2" y="2" width="7" height="7" fill="#0a0b0e" />
            <rect x="4" y="4" width="3" height="3" fill="#f2c94c" />
          </svg>
          <span className="flex flex-col">
            <span className="font-label text-xl leading-none tracking-wide">
              RoR2<span className="text-accent"> Codex</span>
            </span>
            <span className="mt-1 hidden text-[11px] leading-none text-ink-mute xl:block">
              {tr('Objets, effets & cumuls', 'Items, effects & stacking')}
            </span>
          </span>
        </a>

        <label className="order-last flex h-10 w-full items-center gap-2.5 border-2 border-line-2 bg-[#0b0d10] px-3 shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] transition-colors focus-within:border-accent hover:border-[#3a404c] sm:order-none sm:w-auto sm:flex-[1_1_280px] sm:max-w-[480px]">
          <svg width="14" height="14" viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill="#8e94a0">
            <rect x="1" width="3" height="1" />
            <rect y="1" width="1" height="3" />
            <rect x="4" y="1" width="1" height="3" />
            <rect x="1" y="4" width="3" height="1" />
            <rect x="5" y="5" width="1" height="1" />
            <rect x="6" y="6" width="1" height="1" />
          </svg>
          <span className="sr-only">{tr('Rechercher un objet', 'Search an item')}</span>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (setQ(''), e.currentTarget.blur())}
            placeholder={tr('Nom FR / EN ou effet…', 'Name (EN / FR) or effect…')}
            className={['min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-[#7d8491]', CONTROL_TEXT].join(' ')}
          />
          {!q && (
            <kbd className="key hidden sm:inline" title={tr('Raccourci : /', 'Shortcut: /')}>
              /
            </kbd>
          )}
        </label>

        <div className="ml-auto flex items-center gap-2">
          <span className={['mr-1 flex items-baseline gap-1 text-ink-mute', CONTROL_TEXT].join(' ')} aria-live="polite">
            <strong className="font-label text-base font-normal tabular-nums text-accent">{shown}</strong>
            {shown !== total && <span className="tabular-nums">/ {total}</span>}
            <span>{tr('objets', 'items')}</span>
          </span>
          <Select
            aria-label={tr('Trier par', 'Sort by')}
            value={search.s ?? 'rarity'}
            onChange={(e) => onChange({ s: e.target.value === 'rarity' ? undefined : (e.target.value as Search['s']) })}
          >
            <option value="rarity">{tr('Tri : Rareté', 'Sort: Rarity')}</option>
            <option value="name">{tr('Tri : Nom', 'Sort: Name')}</option>
            <option value="color">{tr('Tri : Couleur', 'Sort: Colour')}</option>
          </Select>
          <LangSwitch />
        </div>
      </div>

      <div className="no-scrollbar flex items-center gap-x-6 gap-y-2 overflow-x-auto border-t-2 border-[#171a20] bg-[#0b0d10]/60 px-4 py-2.5 lg:flex-wrap lg:overflow-visible lg:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <Label>{tr('Rareté', 'Rarity')}</Label>
          <div className="flex gap-1.5 py-1">
            {TIERS.map((x) => (
              <Swatch
                key={x.id}
                color={x.color}
                label={x[lang]}
                active={r.includes(x.id)}
                dimmed={r.length > 0}
                count={rarityCounts[x.id] ?? 0}
                onClick={() => onChange({ r: toggle(search.r, x.id) })}
              />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Label>{tr('Couleur', 'Colour')}</Label>
          <div className="flex gap-1.5 py-1">
            {COLOR_BUCKETS.map((x) => (
              <Swatch
                key={x.id}
                color={x.swatch}
                label={x[lang]}
                active={c.includes(x.id)}
                dimmed={c.length > 0}
                count={colorCounts[x.id] ?? 0}
                onClick={() => onChange({ c: toggle(search.c, x.id) })}
              />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Segmented
            label={tr('Type', 'Type')}
            value={search.k}
            onChange={(k) => onChange({ k })}
            options={[
              { value: undefined, label: tr('Tout', 'All'), title: `${total}` },
              { value: 'item' as const, label: tr('Objets', 'Items'), title: `${kindCounts.item ?? 0}` },
              { value: 'equipment' as const, label: tr('Équipements', 'Equipment'), title: `${kindCounts.equipment ?? 0}` },
            ]}
          />

          <Dropdown label={tr('Effet', 'Effect')} count={t.length}>
            {t.length > 1 && (
              <Segmented
                className="mb-1.5"
                label={tr('Combinaison', 'Match')}
                value={search.tm ?? 'any'}
                onChange={(m) => onChange({ tm: m === 'any' ? undefined : 'all' })}
                options={[
                  { value: 'any' as const, label: tr('Au moins un', 'Any of them') },
                  { value: 'all' as const, label: tr('Tous à la fois', 'All of them') },
                ]}
              />
            )}
            {EFFECT_GROUPS.map((g) => (
              <div key={g.id} role="group" aria-label={g[lang]} className="pb-1">
                <div className="px-label flex items-center gap-2 px-2 pb-1 pt-2 text-ink-mute">
                  {g[lang]}
                  <span aria-hidden className="h-0.5 flex-1 bg-gradient-to-r from-line-2 to-transparent" />
                </div>
                {EFFECT_FILTERS.filter((x) => x.group === g.id).map((x) => (
                  <CheckRow
                    key={x.id}
                    checked={t.includes(x.id)}
                    count={tagCounts[x.id] ?? 0}
                    onChange={() => onChange({ t: toggle(search.t, x.id) })}
                  >
                    {x[lang]}
                  </CheckRow>
                ))}
              </div>
            ))}
          </Dropdown>

          <Dropdown label={tr('Contenu', 'Content')} count={d.length}>
            {DLCS.map((x) => (
              <CheckRow
                key={x.id}
                checked={d.includes(x.id)}
                count={dlcCounts[x.id] ?? 0}
                onChange={() => onChange({ d: toggle(search.d, x.id) })}
              >
                {x[lang]}
              </CheckRow>
            ))}
          </Dropdown>
        </div>

        {t.map((id) => (
          <FilterChip
            key={id}
            onRemove={() => onChange({ t: toggle(search.t, id) })}
            removeLabel={`${tr('Retirer le filtre', 'Remove filter')} ${EFFECT_FILTER_BY_ID[id]?.[lang] ?? id}`}
          >
            {EFFECT_FILTER_BY_ID[id]?.[lang] ?? id}
          </FilterChip>
        ))}

        {hasFilters && (
          <Button variant="ghost" onClick={onReset}>
            {tr('Tout effacer', 'Clear all')}
          </Button>
        )}
      </div>
    </div>
  )
}
