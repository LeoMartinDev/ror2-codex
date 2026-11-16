import { createFileRoute, redirect } from '@tanstack/react-router'
import { BY_SLUG } from '#/lib/items'

const plain = (s: string) => s.replace(/<[^>]+>/g, '')

/**
 * One item's page: the catalogue with that item's panel open. Rendered by the parent layout
 * (src/routes/_catalog.tsx); this route only owns the URL and the link preview tags.
 */
export const Route = createFileRoute('/_catalog/items/$slug')({
  beforeLoad: ({ params }) => {
    if (!BY_SLUG.has(params.slug)) throw redirect({ to: '/', replace: true })
  },
  head: ({ params }) => {
    const it = BY_SLUG.get(params.slug)
    if (!it) return {}
    const title = it.name.fr === it.name.en ? `${it.name.fr} — RoR2 Codex` : `${it.name.fr} (${it.name.en}) — RoR2 Codex`
    const description = plain(it.pickup.fr || it.desc.fr)
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
  component: () => null,
})
