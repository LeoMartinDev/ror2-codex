import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { z } from 'zod'
import { BuildCard, SurvivorPortrait } from '#/components/BuildView'
import { buttonClass, CONTROL_TEXT } from '#/components/ui'
import { OFFICIAL_BUILDS } from '#/data/builds'
import { useSavedBuilds, type Build } from '#/lib/builds'
import { normalize } from '#/lib/filters'
import { useHydrated } from '#/lib/hydrated'
import { useLang } from '#/lib/i18n'
import { BY_ID } from '#/lib/items'
import { isSurvivorId, SURVIVOR_BY_ID, SURVIVORS, survivorIcon, type SurvivorId } from '#/lib/survivors'

/** `survivor`: a survivor id, or "generic". `q`: words to find in a build's texts or item names. */
const searchSchema = z.object({
  survivor: z.string().optional().catch(undefined),
  q: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/builds/')({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: 'Builds — RoR2 Codex' },
      {
        name: 'description',
        content: 'Builds Risk of Rain 2 génériques ou par survivant : objets, comment les jouer et synergies. Crée et partage les tiens.',
      },
    ],
  }),
  component: BuildsPage,
})

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
type Key = SurvivorId | 'generic'
const keyOf = (b: Build): Key => b.survivor ?? 'generic'
const KEYS: Key[] = ['generic', ...SURVIVORS.map((s) => s.id)]

/** Everything a search can match in a build: its texts in both languages and its items' names. */
function haystack(b: Build) {
  const parts = [b.name, b.tagline, b.summary, b.tag].flatMap((v) => (v === undefined ? [] : typeof v === 'string' ? [v] : [v.fr, v.en]))
  for (const i of b.items) {
    const it = BY_ID.get(i.id)
    if (it) parts.push(it.name.fr, it.name.en)
  }
  if (b.survivor) parts.push(SURVIVOR_BY_ID[b.survivor].name.fr, SURVIVOR_BY_ID[b.survivor].name.en)
  return normalize(parts.join(' '))
}

/** One tile of the roster: a survivor (or "all", "generic") with how many builds it has. */
function RosterTile({ id, label, count, active, onClick }: { id: Key | 'all'; label: string; count: number; active: boolean; onClick: () => void }) {
  const { tr } = useLang()
  const empty = count === 0 && !active
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${label} · ${count} build${count > 1 ? 's' : ''}`}
      title={`${label} · ${count}`}
      onClick={onClick}
      className={cx(
        'px-focus group relative flex w-[76px] shrink-0 flex-col items-center gap-1.5 pt-1 transition-transform sm:w-auto',
        !active && 'hover:-translate-y-0.5',
      )}
    >
      <span
        className={cx(
          'relative grid size-16 place-items-center overflow-hidden border-2 bg-[#14171d] transition-[border-color,box-shadow]',
          active ? 'border-accent shadow-[0_0_0_2px_#0a0b0e,0_0_18px_-2px_rgba(242,201,76,0.7)]' : 'border-line-2 group-hover:border-[#4a5160]',
        )}
      >
        {id === 'all' ? (
          <svg width="28" height="28" viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill={active ? '#f2c94c' : '#8e94a0'}>
            {[0, 2.5, 5].flatMap((x) => [0, 2.5, 5].map((y) => <rect key={`${x}${y}`} x={x} y={y} width="2" height="2" />))}
          </svg>
        ) : id === 'generic' ? (
          <svg width="28" height="28" viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill="#f2c94c" className={cx(empty && 'opacity-40')}>
            <rect x="0" y="0" width="3" height="3" />
            <rect x="4" y="0" width="3" height="3" opacity=".55" />
            <rect x="0" y="4" width="3" height="3" opacity=".55" />
            <rect x="4" y="4" width="3" height="3" />
          </svg>
        ) : (
          <img
            src={survivorIcon(id)}
            alt=""
            width={60}
            height={60}
            loading="lazy"
            className={cx('size-full object-cover transition-[filter,opacity]', empty ? 'opacity-40 grayscale group-hover:opacity-70' : '')}
          />
        )}
        {/* Bottom shade so the badge stays readable on bright portraits */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/70 to-transparent" />
        <span
          className={cx(
            'absolute bottom-0.5 right-0.5 min-w-4 px-1 text-center font-label text-[11px] leading-[14px]',
            count > 0 ? 'bg-accent text-bg' : 'bg-[#232731] text-ink-mute',
          )}
        >
          {count}
        </span>
      </span>
      <span
        className={cx(
          'w-full truncate text-center text-xs font-medium leading-tight',
          active ? 'text-accent' : empty ? 'text-ink-mute' : 'text-ink-soft group-hover:text-ink',
        )}
      >
        {label}
      </span>
      <span className="sr-only">{active ? tr('(sélectionné)', '(selected)') : ''}</span>
    </button>
  )
}

function Group({ title, portrait, count, children }: { title: string; portrait?: ReactNode; count: number; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 flex items-center gap-2.5">
        {portrait}
        <span className="font-pixel text-xl font-semibold">{title}</span>
        <span className="font-label text-[11px] text-ink-mute">{count}</span>
        <span aria-hidden className="h-0.5 flex-1 bg-gradient-to-r from-line-2 to-transparent" />
      </h2>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  )
}

/** Banner of the selected survivor: who they are and what to do next. */
function SurvivorBanner({ id, count, query }: { id: Key; count: number; query: string }) {
  const { lang, tr } = useLang()
  const s = id === 'generic' ? null : SURVIVOR_BY_ID[id]
  return (
    <div className="fade-up relative flex flex-col gap-4 overflow-hidden border-2 border-line bg-[linear-gradient(110deg,rgba(242,201,76,0.09),transparent_55%),#0f1115] p-4 sm:flex-row sm:items-center sm:gap-5">
      <SurvivorPortrait id={s?.id ?? null} size={96} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="px-label text-accent">{s ? s.subtitle[lang] : tr('Pour plusieurs survivants', 'For several survivors')}</span>
        <span className="font-pixel text-[30px] font-semibold leading-none">{s ? s.name[lang] : tr('Builds génériques', 'Generic builds')}</span>
        <span className="text-sm text-ink-dim">
          {count === 0
            ? query
              ? tr('Aucun build ne correspond à la recherche.', 'No build matches the search.')
              : tr('Pas encore de build : crée le premier.', 'No build yet: make the first one.')
            : tr(`${count} build${count > 1 ? 's' : ''}`, `${count} build${count > 1 ? 's' : ''}`)}
        </span>
      </div>
      <Link to="/builds/edit" search={s ? { survivor: s.id } : {}} className={cx(buttonClass({ active: count === 0 }), 'self-start sm:self-auto')}>
        + {s ? tr(`Créer un build ${s.name.fr}`, `New ${s.name.en} build`) : tr('Créer un build générique', 'New generic build')}
      </Link>
    </div>
  )
}

function BuildsPage() {
  const { lang, tr } = useLang()
  const hydrated = useHydrated()
  const urlSearch = Route.useSearch()
  const navigate = useNavigate()
  // Prerendered without query: apply the URL once hydrated (see useHydrated).
  const filter = hydrated && urlSearch.survivor && (urlSearch.survivor === 'generic' || isSurvivorId(urlSearch.survivor)) ? (urlSearch.survivor as Key) : null
  const query = hydrated ? (urlSearch.q ?? '') : ''
  const [q, setQ] = useState('')
  useEffect(() => setQ(query), [query])
  const update = (patch: { survivor?: Key | null; q?: string }) =>
    navigate({
      to: '.',
      search: (prev) => ({
        survivor: 'survivor' in patch ? patch.survivor ?? undefined : prev.survivor,
        q: 'q' in patch ? patch.q || undefined : prev.q,
      }),
      replace: true,
      resetScroll: false,
    })
  useEffect(() => {
    const id = setTimeout(() => q !== query && update({ q }), 150)
    return () => clearTimeout(id)
  }, [q])

  const { list: saved } = useSavedBuilds()
  useEffect(() => {
    document.title = tr('Builds — RoR2 Codex', 'Builds — RoR2 Codex')
  }, [tr])

  // Search first, then count per survivor, so the roster tells where the matches are.
  const words = normalize(query).split(/\s+/).filter(Boolean)
  const hit = useMemo(() => {
    const cache = new Map<Build, string>()
    return (b: Build) => {
      if (!words.length) return true
      let h = cache.get(b)
      if (h === undefined) cache.set(b, (h = haystack(b)))
      return words.every((w) => h!.includes(w))
    }
  }, [words.join(' ')])
  const official = OFFICIAL_BUILDS.filter(hit)
  const mine = saved.filter((s) => hit(s.build))
  const counts = new Map<Key, number>()
  for (const b of [...official, ...mine.map((s) => s.build)]) counts.set(keyOf(b), (counts.get(keyOf(b)) ?? 0) + 1)
  const total = official.length + mine.length

  const inFilter = (b: Build) => !filter || keyOf(b) === filter
  const shownMine = mine.filter((s) => inFilter(s.build))
  const shownOfficial = official.filter(inFilter)
  const groups = KEYS.filter((k) => !filter || k === filter)
    .map((k) => ({ key: k, list: shownOfficial.filter((b) => keyOf(b) === k) }))
    .filter((g) => g.list.length)
  const toggle = (k: Key) => update({ survivor: filter === k ? null : k })

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="px-label text-accent">{tr('Carnet de terrain', 'Field notes')}</span>
          <h1 className="m-0 font-pixel text-[40px] font-semibold leading-none">Builds</h1>
          <p className="m-0 max-w-2xl text-base leading-relaxed text-ink-soft">
            {tr(
              'Des directions de partie, génériques ou par survivant : les objets à réunir, comment les jouer et pourquoi ils marchent ensemble. Crée les tiens et partage-les par un simple lien.',
              'Run directions, generic or per survivor: the items to gather, how to play them and why they work together. Make your own and share them with a simple link.',
            )}
          </p>
        </div>
        <Link to="/builds/edit" className={cx(buttonClass({ active: true }), 'h-11 self-start px-4 sm:self-auto')}>
          + {tr('Créer un build', 'Create a build')}
        </Link>
      </header>

      <section aria-label={tr('Choisir un survivant', 'Pick a survivor')} className="flex flex-col gap-3 border-y-2 border-line bg-[#0c0e12]/70 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-label text-ink-dim">{tr('Survivant', 'Survivor')}</span>
          <label className="ml-auto flex h-9 w-full items-center gap-2 border-2 border-line-2 bg-[#0b0d10] px-3 transition-colors focus-within:border-accent hover:border-[#3a404c] sm:w-72">
            <svg width="12" height="12" viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill="#8e94a0">
              <rect x="1" width="3" height="1" />
              <rect y="1" width="1" height="3" />
              <rect x="4" y="1" width="1" height="3" />
              <rect x="1" y="4" width="3" height="1" />
              <rect x="5" y="5" width="1" height="1" />
              <rect x="6" y="6" width="1" height="1" />
            </svg>
            <span className="sr-only">{tr('Chercher un build', 'Search a build')}</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setQ('')}
              placeholder={tr('Build, objet…', 'Build, item…')}
              className={cx('min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-[#7d8491]', CONTROL_TEXT)}
            />
          </label>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(72px,1fr))] sm:overflow-visible sm:px-0">
          <RosterTile id="all" label={tr('Tous', 'All')} count={total} active={!filter} onClick={() => update({ survivor: null })} />
          {KEYS.map((k) => (
            <RosterTile
              key={k}
              id={k}
              label={k === 'generic' ? tr('Génériques', 'Generic') : SURVIVOR_BY_ID[k].name[lang]}
              count={counts.get(k) ?? 0}
              active={filter === k}
              onClick={() => toggle(k)}
            />
          ))}
        </div>
      </section>

      {filter && <SurvivorBanner id={filter} count={shownMine.length + shownOfficial.length} query={query} />}

      {shownMine.length > 0 && (
        <Group title={tr('Mes builds', 'My builds')} count={shownMine.length}>
          {shownMine.map((s) => (
            <BuildCard key={s.id} build={s.build} target={{ id: s.id }} />
          ))}
        </Group>
      )}

      {groups.map(({ key, list }) => (
        <Group
          key={key}
          // With a survivor selected the banner already names them.
          title={filter ? tr('Builds du Codex', 'Codex builds') : key === 'generic' ? tr('Builds génériques', 'Generic builds') : SURVIVOR_BY_ID[key].name[lang]}
          portrait={filter ? undefined : <SurvivorPortrait id={key === 'generic' ? null : key} size={32} />}
          count={list.length}
        >
          {list.map((b) => (
            <BuildCard key={b.slug} build={b} target={{ slug: b.slug }} />
          ))}
        </Group>
      ))}

      {!filter && total === 0 && (
        <div className="flex flex-col items-center gap-3 border-2 border-dashed border-line-2 px-6 py-10 text-center">
          <div className="font-pixel text-lg font-semibold text-ink-soft">{tr('Aucun build trouvé', 'No build found')}</div>
          <p className="m-0 text-sm text-ink-mute">{tr('Essaie un autre mot : nom du build ou d’un objet.', 'Try another word: a build’s or an item’s name.')}</p>
        </div>
      )}

      <p className="m-0 border-t-2 border-line pt-4 text-sm leading-relaxed text-ink-mute">
        {tr(
          'Adapte ces directions au butin trouvé : « générique » veut dire jouable avec plusieurs survivants. Les objets « essentiels » font marcher le build, les autres l’améliorent. Tes builds restent dans ce navigateur ; le lien de partage contient tout le build.',
          'Adapt these directions to the loot you find: “generic” means playable with several survivors. “Core” items make the build work, the others improve it. Your builds stay in this browser; the share link carries the whole build.',
        )}{' '}
        {tr('Un assistant IA peut aussi créer un build pour toi : donne-lui l’adresse du site, ses instructions sont dans ', 'An AI assistant can also make a build for you: give it the site’s address, its instructions are in ')}
        <a href="/llms.txt" className="px-focus text-accent underline-offset-2 hover:underline">
          /llms.txt
        </a>
        .
      </p>
    </div>
  )
}
