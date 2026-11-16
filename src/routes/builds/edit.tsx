import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { BuildEditor } from '#/components/BuildEditor'
import { Button, LinkIcon } from '#/components/ui'
import { OFFICIAL_BY_SLUG } from '#/data/builds'
import { decodeBuild, emptyBuild, encodeBuild, flatten, readHashCode, shareUrl, txt, useSavedBuilds, type Build } from '#/lib/builds'
import { useHydrated } from '#/lib/hydrated'
import { useLang } from '#/lib/i18n'
import { useShareLink } from '#/lib/share'
import { isSurvivorId } from '#/lib/survivors'

/**
 * The build editor. Starts from:
 *  - ?id=<id>: a build saved in this browser (saving updates it);
 *  - ?from=<slug>: a copy of an official build;
 *  - #<code>: a copy of a shared build;
 *  - ?survivor=<id>: a new build for that survivor;
 *  - nothing: a blank build.
 */
export const Route = createFileRoute('/builds/edit')({
  validateSearch: z.object({
    id: z.string().optional().catch(undefined),
    from: z.string().optional().catch(undefined),
    survivor: z.string().optional().catch(undefined),
  }),
  head: () => ({ meta: [{ title: 'Créer un build — RoR2 Codex' }, { name: 'robots', content: 'noindex' }] }),
  component: EditPage,
})

function EditPage() {
  const search = Route.useSearch()
  const hydrated = useHydrated()
  const { lang, tr } = useLang()
  const navigate = useNavigate()
  const router = useRouter()
  const { get, save } = useSavedBuilds()
  const { share, copied } = useShareLink()
  const [initial, setInitial] = useState<Build | null>(null)

  // Pick the starting build once, after hydration (the language is known by then).
  useEffect(() => {
    if (!hydrated || initial) return
    const code = readHashCode()
    const official = search.from ? OFFICIAL_BY_SLUG.get(search.from) : undefined
    const saved = search.id ? get(search.id) : undefined
    if (saved) setInitial(saved.build)
    else if (official) setInitial({ ...flatten(official, lang), name: `${txt(official.name, lang)} (${tr('copie', 'copy')})` })
    else if (code) decodeBuild(code).then((b) => setInitial(b ?? emptyBuild()))
    else setInitial({ ...emptyBuild(), survivor: isSurvivorId(search.survivor) ? search.survivor : null })
  }, [hydrated, initial, search, get, lang, tr])

  useEffect(() => {
    document.title = search.id ? tr('Modifier un build — RoR2 Codex', 'Edit a build — RoR2 Codex') : tr('Créer un build — RoR2 Codex', 'Create a build — RoR2 Codex')
  }, [search.id, tr])

  // Editing an existing saved build keeps its id; anything else becomes a new saved build.
  const savedId = search.id && get(search.id) ? search.id : undefined

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="px-label text-accent">Builds</span>
        <h1 className="m-0 font-pixel text-[34px] font-semibold leading-none">
          {savedId ? tr('Modifier le build', 'Edit the build') : tr('Nouveau build', 'New build')}
        </h1>
        <p className="m-0 max-w-2xl text-sm leading-relaxed text-ink-mute">
          {tr(
            'Le build est enregistré dans ce navigateur. Pour le partager, copie son lien : il contient tout le build, sans compte ni serveur.',
            'The build is saved in this browser. To share it, copy its link: it carries the whole build, no account or server needed.',
          )}
        </p>
      </header>

      {initial ? (
        <BuildEditor
          initial={initial}
          actions={(build, valid) => (
            <>
              <Button variant="ghost" onClick={() => (window.history.length > 1 ? router.history.back() : navigate({ to: '/builds' }))}>
                {tr('Annuler', 'Cancel')}
              </Button>
              <Button disabled={!valid} onClick={async () => share(shareUrl(await encodeBuild(build)), txt(build.name, lang))}>
                <LinkIcon done={copied} />
                {copied ? tr('Lien copié', 'Link copied') : tr('Copier le lien', 'Copy link')}
              </Button>
              <Button active disabled={!valid} onClick={() => navigate({ to: '/builds/view', search: { id: save(build, savedId) }, hash: '' })}>
                {tr('Enregistrer', 'Save')}
              </Button>
            </>
          )}
        />
      ) : (
        <div className="h-64" aria-busy />
      )}
    </div>
  )
}
