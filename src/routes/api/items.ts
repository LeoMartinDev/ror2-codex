import { createFileRoute } from '@tanstack/react-router'
import { matches } from '#/lib/filters'
import { ITEMS, itemSlug } from '#/lib/items'
import { plainText } from '#/lib/richText'
import { SURVIVORS } from '#/lib/survivors'

/**
 * Items and survivors as JSON, for AI agents writing builds (see /llms.txt).
 * ?q=<words> keeps the items whose name or effect matches, like the catalogue's search box (survivors are
 * then left out). ?lang=en|fr keeps one language.
 */
export const Route = createFileRoute('/api/items')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url)
        const q = url.searchParams.get('q')?.trim()
        const lang = url.searchParams.get('lang')
        const pick = (v: { en: string; fr: string }) => (lang === 'en' || lang === 'fr' ? v[lang] : v)
        const items = ITEMS.filter((it) => it.rarity !== 'untiered' && (!q || matches(it, { q })))
        return Response.json(
          {
            survivors: q ? undefined : SURVIVORS.map((s) => ({ id: s.id, name: pick(s.name) })),
            items: items.map((it) => ({
              id: it.id,
              name: pick(it.name),
              rarity: it.rarity,
              kind: it.kind,
              dlc: it.dlc,
              effect: pick({ en: plainText(it.pickup.en), fr: plainText(it.pickup.fr) }),
              page: `${url.origin}/items/${itemSlug(it)}`,
            })),
          },
          { headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=3600' } },
        )
      },
    },
  },
})
