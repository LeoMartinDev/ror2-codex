import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { useLang } from '#/lib/i18n'
import data from '#/data/items.json'
import { FilterBar } from '#/components/FilterBar'
import { ItemDetail } from '#/components/ItemDetail'
import { ItemGrid } from '#/components/ItemGrid'
import { matches, searchSchema, sortItems, type Search } from '#/lib/filters'
import type { Item } from '#/lib/types'

const ITEMS = data as Item[]
const BY_ID = new Map(ITEMS.map((it) => [it.id, it]))
const BY_WIKI_NAME = new Map(ITEMS.map((it) => [it.wikiName, it]))

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  head: ({ match }) => {
    const it = match.search.item ? BY_ID.get(match.search.item) : undefined
    return { meta: it ? [{ title: `${it.name.fr} (${it.name.en}) — RoR2 Codex` }] : [] }
  },
  component: ItemsPage,
})

const EMPTY_SEARCH: Search = {}
const noop = () => () => {}

/** False during SSR and the hydration pass, true afterwards (and on any later client-only mount). */
function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}

function ItemsPage() {
  // "/" is prerendered without query params, and that same HTML is served for every query string
  // (?item=…, ?r=…). Hydrate against that empty state first, then apply the URL, so React
  // never sees a mismatch.
  const urlSearch = Route.useSearch()
  const search = useHydrated() ? urlSearch : EMPTY_SEARCH
  const navigate = useNavigate({ from: '/' })

  const update = useCallback(
    (patch: Partial<Search>) =>
      navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false }),
    [navigate],
  )
  const close = useCallback(
    () => navigate({ search: (prev) => ({ ...prev, item: undefined }), resetScroll: false }),
    [navigate],
  )

  const { lang, tr } = useLang()
  const filtered = useMemo(() => sortItems(ITEMS.filter((it) => matches(it, search)), search, lang), [search, lang])
  const selected = search.item ? BY_ID.get(search.item) : undefined
  useEffect(() => {
    document.title = selected
      ? `${selected.name[lang]}${lang === 'fr' ? ` (${selected.name.en})` : ''} — RoR2 Codex`
      : tr('RoR2 Codex — Objets', 'RoR2 Codex — Items')
  }, [selected, lang, tr])

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="relative z-20 shrink-0">
        <FilterBar
          items={ITEMS}
          search={search}
          total={ITEMS.length}
          shown={filtered.length}
          onChange={update}
          onReset={() => navigate({ search: {}, replace: true })}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <main className="bg-dots scrollbar-thin min-w-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-8 sm:px-4 lg:px-6">
          {/* Top spacing lives inside the scroll content so sticky group headers pin flush to the top. */}
          <div className="pt-3">
            <ItemGrid items={filtered} search={search} />
          </div>
        </main>

        {selected && (
          <>
            <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-[2px] lg:hidden" onClick={close} aria-hidden />
            <aside
              className="panel-in fixed inset-0 z-40 overflow-hidden bg-panel lg:static lg:z-auto lg:w-[460px] lg:shrink-0 lg:border-l-2 lg:border-line lg:shadow-[-16px_0_40px_-20px_rgba(0,0,0,0.9)]"
              role="dialog"
              aria-label={selected.name.fr}
            >
              <ItemDetail
                key={selected.id}
                item={selected}
                all={ITEMS}
                byId={BY_ID}
                byWikiName={BY_WIKI_NAME}
                onClose={close}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
