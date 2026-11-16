import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { z } from 'zod'
import { BuildView } from '#/components/BuildView'
import { Button, buttonClass, LinkIcon } from '#/components/ui'
import { parseBuildParam, queryParam } from '#/lib/buildInput'
import { decodeBuild, encodeBuild, readHashCode, shareUrl, txt, useSavedBuilds, type Build } from '#/lib/builds'
import { useHydrated } from '#/lib/hydrated'
import { useLang } from '#/lib/i18n'
import { useShareLink } from '#/lib/share'

/**
 * A player's build. Three sources:
 *  - /builds/view#<code>: a share link, the whole build compressed in the hash (see encodeBuild);
 *  - /builds/view?b=<json>: a readable link written by hand or by an AI agent (see buildInput.ts, /llms.txt);
 *  - /builds/view?id=<id>: a build saved in this browser.
 * The page is prerendered empty and filled once hydrated.
 */
export const Route = createFileRoute('/builds/view')({
  validateSearch: z.object({
    id: z.string().optional().catch(undefined),
    // The router parses JSON-looking values itself: b may already be an object.
    b: z.unknown().optional(),
  }),
  head: () => ({ meta: [{ title: 'Build partagé — RoR2 Codex' }, { name: 'robots', content: 'noindex' }] }),
  component: ViewPage,
})

type Shared = { state: 'loading' } | { state: 'missing'; errors?: string[] } | { state: 'ok'; build: Build; errors: string[] }

function Message({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mt-6 flex max-w-lg flex-col items-center gap-3 border-2 border-dashed border-line-2 px-6 py-10 text-center">
      <div className="font-pixel text-xl font-semibold text-ink-soft">{title}</div>
      {children}
    </div>
  )
}

function Problems({ errors }: { errors: string[] }) {
  const { tr } = useLang()
  return (
    <div className="flex flex-col gap-1.5 border-2 border-bad/50 bg-bad/5 p-3 text-left">
      <strong className="text-sm font-semibold text-bad">
        {tr(`Ce build contient ${errors.length} problème(s) :`, `This build has ${errors.length} problem(s):`)}
      </strong>
      <ul className="m-0 flex flex-col gap-0.5 pl-5 text-sm leading-snug text-ink-soft">
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  )
}

function ViewPage() {
  const { id, b } = Route.useSearch()
  const hydrated = useHydrated()
  const { lang, tr } = useLang()
  const navigate = useNavigate()
  const { get, save, remove } = useSavedBuilds()
  const { share, copied } = useShareLink()
  const [shared, setShared] = useState<Shared>({ state: 'loading' })
  const saved = hydrated && id ? get(id) : undefined

  // Read the readable link or the hash, and the hash again if another share link is opened here.
  useEffect(() => {
    if (!hydrated || id) return
    if (b !== undefined) {
      // Read from the raw URL rather than the router's value, to recover text sent in Windows-1252.
      const { build, errors } = parseBuildParam(queryParam(window.location.search, 'b') ?? b)
      setShared(build ? { state: 'ok', build, errors } : { state: 'missing', errors })
      return
    }
    let live = true
    const load = () => {
      const code = readHashCode()
      if (!code) return setShared({ state: 'missing' })
      decodeBuild(code).then((build) => live && setShared(build ? { state: 'ok', build, errors: [] } : { state: 'missing' }))
    }
    load()
    window.addEventListener('hashchange', load)
    return () => {
      live = false
      window.removeEventListener('hashchange', load)
    }
  }, [hydrated, id, b])

  const build = id ? saved?.build : shared.state === 'ok' ? shared.build : undefined
  useEffect(() => {
    if (build) document.title = `${txt(build.name, lang) || 'Build'} — ${tr('Builds RoR2 Codex', 'RoR2 Codex builds')}`
  }, [build, lang, tr])

  if (!hydrated || (!id && shared.state === 'loading')) return <div className="h-64" aria-busy />

  if (!build)
    return (
      <Message title={id ? tr('Build introuvable', 'Build not found') : tr('Lien de build invalide', 'Invalid build link')}>
        {shared.state === 'missing' && shared.errors?.length ? (
          <Problems errors={shared.errors} />
        ) : (
          <p className="m-0 text-sm text-ink-mute">
            {id
              ? tr('Il a peut-être été supprimé, ou enregistré dans un autre navigateur.', 'It may have been deleted, or saved in another browser.')
              : tr('Le lien est incomplet ou abîmé. Demande à son auteur de le recopier en entier.', 'The link is incomplete or damaged. Ask its author to copy it again in full.')}
          </p>
        )}
        <Link to="/builds" className={buttonClass()}>
          {tr('Voir les builds', 'See the builds')}
        </Link>
      </Message>
    )

  const shareButton = (
    <Button onClick={async () => share(shareUrl(await encodeBuild(build)), txt(build.name, lang))}>
      <LinkIcon done={copied} />
      {copied ? tr('Lien copié', 'Link copied') : tr('Partager', 'Share')}
    </Button>
  )

  if (id)
    return (
      <BuildView
        build={build}
        notice={<p className="m-0 text-sm text-ink-mute">{tr('Build enregistré dans ce navigateur.', 'Build saved in this browser.')}</p>}
        actions={
          <>
            {shareButton}
            <Link to="/builds/edit" search={{ id }} className={buttonClass()}>
              {tr('Modifier', 'Edit')}
            </Link>
            <Button
              variant="ghost"
              className="hover:text-bad"
              onClick={() => {
                if (!window.confirm(tr('Supprimer ce build de ce navigateur ?', 'Delete this build from this browser?'))) return
                remove(id)
                navigate({ to: '/builds' })
              }}
            >
              {tr('Supprimer', 'Delete')}
            </Button>
          </>
        }
      />
    )

  const errors = shared.state === 'ok' ? shared.errors : []
  return (
    <BuildView
      build={build}
      notice={
        <div className="flex flex-col gap-3">
          {errors.length > 0 && <Problems errors={errors} />}
          <p className="m-0 border-l-2 border-info pl-3 text-sm leading-snug text-ink-dim">
            {tr(
              'Build partagé. Enregistre-le pour le retrouver dans « Mes builds », ou modifie une copie.',
              'Shared build. Save it to find it in “My builds”, or edit a copy.',
            )}
          </p>
        </div>
      }
      actions={
        <>
          <Button active onClick={() => navigate({ to: '/builds/view', search: { id: save(build) }, hash: '', replace: true })}>
            {tr('Enregistrer dans mes builds', 'Save to my builds')}
          </Button>
          <Button onClick={async () => navigate({ to: '/builds/edit', hash: await encodeBuild(build) })}>{tr('Modifier une copie', 'Edit a copy')}</Button>
          {shareButton}
        </>
      }
    />
  )
}
