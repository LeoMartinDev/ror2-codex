import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { BuildView } from '#/components/BuildView'
import { Button, buttonClass, LinkIcon } from '#/components/ui'
import { OFFICIAL_BY_SLUG } from '#/data/builds'
import { txt } from '#/lib/builds'
import { useLang } from '#/lib/i18n'
import { useShareLink } from '#/lib/share'

/** A build written for the Codex (src/data/builds.ts). Prerendered, with link preview tags. */
export const Route = createFileRoute('/builds/$slug')({
  beforeLoad: ({ params }) => {
    if (!OFFICIAL_BY_SLUG.has(params.slug)) throw redirect({ to: '/builds', replace: true })
  },
  head: ({ params }) => {
    const b = OFFICIAL_BY_SLUG.get(params.slug)
    if (!b) return {}
    const title = `${txt(b.name, 'fr')} — Builds RoR2 Codex`
    const description = txt(b.summary, 'fr')
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: 'RoR2 Codex' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { name: 'twitter:card', content: 'summary' },
      ],
    }
  },
  component: OfficialBuildPage,
})

function OfficialBuildPage() {
  const { slug } = Route.useParams()
  const build = OFFICIAL_BY_SLUG.get(slug)!
  const { lang, tr } = useLang()
  const { share, copied } = useShareLink()
  useEffect(() => {
    document.title = `${txt(build.name, lang)} — ${tr('Builds RoR2 Codex', 'RoR2 Codex builds')}`
  }, [build, lang, tr])

  return (
    <BuildView
      build={build}
      actions={
        <>
          <Button onClick={() => share(`${window.location.origin}/builds/${slug}`, txt(build.name, lang))}>
            <LinkIcon done={copied} />
            {copied ? tr('Lien copié', 'Link copied') : tr('Partager', 'Share')}
          </Button>
          <Link to="/builds/edit" search={{ from: slug }} className={buttonClass()}>
            {tr('Modifier une copie', 'Edit a copy')}
          </Link>
        </>
      }
    />
  )
}
