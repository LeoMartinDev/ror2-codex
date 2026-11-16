import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo } from 'react'
import { useHydrated } from '#/lib/hydrated'
import { useLang } from '#/lib/i18n'
import { FilterBar } from '#/components/FilterBar'
import { ItemDetail } from '#/components/ItemDetail'
import { ItemGrid } from '#/components/ItemGrid'
import { matches, searchSchema, sortItems, type Search } from '#/lib/filters'
import { BY_ID, BY_SLUG, BY_WIKI_NAME, ITEMS, itemSlug } from '#/lib/items'

/**
 * The catalogue page. "/" and "/items/$slug" are its children, so moving between items or closing
 * the panel keeps the grid mounted (scroll position, search box). Filters live in the query string
 * on both paths, so every view can be shared as a link.
 */
export const Route = createFileRoute('/_catalog')({
  validateSearch: searchSchema,
  component: CatalogPage,
})

const EMPTY_SEARCH: Search = {}

function CatalogPage() {
  // Pages are prerendered without query params, and that same HTML is served for every query
  // string (?q=…, ?r=…). Hydrate against that empty state first, then apply the URL, so React
  // never sees a mismatch. The item comes from the path, so it is part of the prerendered HTML.
  const hydrated = useHydrated()
  const urlSearch = Route.useSearch()
  const search = hydrated ? urlSearch : EMPTY_SEARCH
  const { slug } = useParams({ strict: false })
  const selected = slug ? BY_SLUG.get(slug) : undefined
  const navigate = useNavigate()

  // Old links opened an item with ?item=<id>: move them to the item's own URL.
  useEffect(() => {
    const legacy = urlSearch.item ? BY_ID.get(urlSearch.item) : undefined
    if (!hydrated || !urlSearch.item) return
    navigate({
      to: legacy ? '/items/$slug' : '.',
      params: legacy ? { slug: itemSlug(legacy) } : undefined,
      search: (prev) => ({ ...prev, item: undefined }),
      replace: true,
      resetScroll: false,
    })
  }, [hydrated, urlSearch.item, navigate])

  const update = useCallback(
    (patch: Partial<Search>) =>
      navigate({ to: '.', search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false }),
    [navigate],
  )
  const close = useCallback(() => navigate({ to: '/', search: true, resetScroll: false }), [navigate])

  const { lang, tr } = useLang()
  const filtered = useMemo(() => sortItems(ITEMS.filter((it) => matches(it, search)), search, lang), [search, lang])
  useEffect(() => {
    document.title = selected
      ? `${selected.name[lang]}${lang === 'fr' ? ` (${selected.name.en})` : ''} — RoR2 Codex`
      : tr('RoR2 Codex — Objets', 'RoR2 Codex — Items')
  }, [selected, lang, tr])

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Outlet />
      <div className="relative z-20 shrink-0">
        <FilterBar
          items={ITEMS}
          search={search}
          total={ITEMS.length}
          shown={filtered.length}
          onChange={update}
          onReset={() => navigate({ to: '.', search: {}, replace: true, resetScroll: false })}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <main className="bg-dots scrollbar-thin min-w-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-8 sm:px-4 lg:px-6">
          {/* Top spacing lives inside the scroll content so sticky group headers pin flush to the top. */}
          <div className="pt-3">
            <ItemGrid items={filtered} search={search} selectedId={selected?.id} />
          </div>
        </main>

        {selected && (
          <>
            <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-[2px] lg:hidden" onClick={close} aria-hidden />
            <aside
              className="panel-in fixed inset-0 z-40 overflow-hidden bg-panel lg:static lg:z-auto lg:w-[460px] lg:shrink-0 lg:border-l-2 lg:border-line lg:shadow-[-16px_0_40px_-20px_rgba(0,0,0,0.9)]"
              role="dialog"
              aria-label={selected.name[lang]}
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
