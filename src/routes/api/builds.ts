import { createFileRoute } from '@tanstack/react-router'
import { OFFICIAL_BUILDS } from '#/data/builds'
import { encodeBuild, txt, type Build } from '#/lib/builds'
import { decodeText, parseBuildParam, queryParam } from '#/lib/buildInput'
import { BY_ID } from '#/lib/items'
import { SURVIVOR_BY_ID } from '#/lib/survivors'

/**
 * Checks a build written by an AI agent and returns its share link (see /llms.txt).
 *   GET  /api/builds?b=<url-encoded JSON>
 *   POST /api/builds  (JSON body)
 *   GET  /api/builds  (no b): the format and the site's own builds, as examples.
 */
const HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
}

/** Everything that was understood, with item and survivor names, so the agent can check it. */
const readable = (b: Build) => {
  const t = (v: Parameters<typeof txt>[0]) => (v === undefined ? undefined : txt(v, 'en') || undefined)
  return {
    name: t(b.name),
    survivor: b.survivor ? SURVIVOR_BY_ID[b.survivor].name.en : 'generic',
    tagline: t(b.tagline),
    tag: t(b.tag),
    summary: t(b.summary),
    skills: b.skills && { label: t(b.skills.label), text: t(b.skills.text) },
    items: b.items.map((i) => ({ item: BY_ID.get(i.id)?.name.en, role: t(i.role), core: i.core || undefined })),
    howTo: b.howTo.map((h) => txt(h, 'en')),
    synergies: b.synergies.map((s) => ({ items: s.items.map((id) => BY_ID.get(id)?.name.en), text: t(s.text) })),
    author: b.author,
  }
}

async function check(raw: unknown, origin: string) {
  const { build, errors } = parseBuildParam(raw)
  const body: Record<string, unknown> = { ok: !errors.length && !!build, errors }
  if (build) {
    body.understood = readable(build)
    if (!errors.length) body.url = `${origin}/builds/view#${await encodeBuild(build)}`
  }
  if (errors.length) body.hint = `Fix the errors and try again. Format: ${origin}/llms.txt — item names: ${origin}/api/items?q=<words>`
  return Response.json(body, { status: errors.length ? 422 : 200, headers: HEADERS })
}

export const Route = createFileRoute('/api/builds')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const b = queryParam(url.search, 'b')
        if (b !== null) return check(b, url.origin)
        return Response.json(
          {
            usage: `GET ${url.origin}/api/builds?b=<url-encoded build JSON> checks a build and returns its share link. Format: ${url.origin}/llms.txt`,
            official: OFFICIAL_BUILDS.map((o) => ({ url: `${url.origin}/builds/${o.slug}`, ...readable(o) })),
          },
          { headers: HEADERS },
        )
      },
      POST: async ({ request }) => {
        const origin = new URL(request.url).origin
        try {
          return check(JSON.parse(decodeText(new Uint8Array(await request.arrayBuffer()))), origin)
        } catch {
          return Response.json({ ok: false, errors: ['The body is not valid JSON.'] }, { status: 400, headers: HEADERS })
        }
      },
      OPTIONS: () => new Response(null, { status: 204, headers: { ...HEADERS, 'access-control-allow-methods': 'GET, POST, OPTIONS' } }),
    },
  },
})
