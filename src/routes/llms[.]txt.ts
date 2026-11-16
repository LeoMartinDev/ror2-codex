import { createFileRoute } from '@tanstack/react-router'
import { OFFICIAL_BUILDS } from '#/data/builds'
import { LIMITS, txt } from '#/lib/builds'
import { SURVIVORS } from '#/lib/survivors'

/**
 * Instructions for AI agents (the llms.txt convention): what the site is, and how to make a build
 * and hand it to the user with nothing but HTTP GET. URLs are absolute, built from the request.
 */
const EXAMPLE = {
  name: 'Commando éclairs',
  survivor: 'Commando',
  tagline: 'Chaque balle appelle la foudre.',
  tag: 'Facile · SotV',
  summary: 'Le tir principal du Commando touche très souvent : chaque impact peut relancer le Polyluth.',
  skills: { label: 'Compétences', text: 'Double Tap · Phase Round · Tactical Dive · Suppressive Fire' },
  items: [
    { item: 'Polylute', role: '×1 ou plus · impacts répétés', core: true },
    { item: "Soldier's Syringe", role: 'Plusieurs · cadence', core: true },
    { item: '57 Leaf Clover', role: '×1 · plus de déclenchements' },
    "Paul's Goat Hoof",
  ],
  howTo: ['Tire en continu avec Double Tap.', 'Garde Tactical Dive pour esquiver.'],
  synergies: [{ items: ['Polylute', "Soldier's Syringe"], text: 'Plus de balles, plus d’éclairs.' }],
  author: 'Claude',
}

function text(origin: string) {
  const readable = `${origin}/builds/view?b=${encodeURIComponent(JSON.stringify(EXAMPLE))}`
  return `# RoR2 Codex

> Every Risk of Rain 2 item with its effect in French and English, how it stacks, and builds: which items to gather for a run, generic or for one survivor, how to play them and why they work together.

Pages for people: ${origin}/ (item catalogue), ${origin}/items/<item-slug> (one item), ${origin}/builds (builds), ${origin}/builds/edit (build editor).

## Make a build for the user

Builds need no account and no server storage: the whole build lives in its link. To make one:

1. Pick the items. Use the game names, in English or French. Unsure of a name or looking for items by effect? GET ${origin}/api/items?q=<words>&lang=en (for example ?q=lightning or ?q=crit), or ${origin}/api/items for all of them and the survivors. Items are not tied to a survivor: choose them from the survivor's play style (fast hits, big hits, mobility…), as the site's own builds below do.
2. Write the build as JSON (format below).
3. Check it: GET ${origin}/api/builds?b=<the JSON, URL-encoded>
   - 200 {"ok": true, "url": "…", "understood": {…}}: give "url" to the user. It is a short link to the build's page: the build is compressed in the part after "#", which browsers never send to a server, so the page decodes it itself (fetching it with curl shows an empty page, that is normal). "understood" is the build as the site read it, with item names: check it is what you meant.
   - 422 {"ok": false, "errors": [...]}: each error names the field and suggests the right name for unknown items ("did you mean …"). Fix and check again.
   - POST ${origin}/api/builds with the JSON as body works the same.
4. If you cannot call the API, give the user the readable link directly: ${origin}/builds/view?b=<the JSON, URL-encoded>. The page shows the build, and lists any problem at the top.

Write the build's texts in the user's language. The page then lets the user save the build, edit a copy and share it.

## Build format

Only "name" and "items" are required.

- name: string, max ${LIMITS.name} characters.
- survivor: a survivor's name (English or French) or id; omit it, or "generic", for a build playable with several survivors. Survivors: ${SURVIVORS.map((s) => (s.name.en === s.name.fr ? s.name.en : `${s.name.en} (${s.name.fr})`)).join(', ')}.
- tagline: one punchy line. tag: a short badge (difficulty, DLC needed…). Max ${LIMITS.line} characters each.
- summary: the idea of the build in a few sentences, max ${LIMITS.text} characters.
- skills: the skills to pick, or the loop the build runs on. A string, or {"label": "Build loop", "text": "…"}.
- items: up to ${LIMITS.items}, in the order to show them. Each one is a name, or {"item": name, "role": why it is here and how many copies (max ${LIMITS.line} characters), "core": true when the build does not work without it}.
- howTo: how to play it. A list of paragraphs (max ${LIMITS.howTo}), or one string with one paragraph per line.
- synergies: up to ${LIMITS.synergies} combos, each {"items": [names of items of this build], "text": "what they do together"}. The page also finds common synergies and conflicts (a void item corrupting another one) on its own: write the ones a player would not guess.
- author: your name or the user's, max ${LIMITS.author} characters.

Example:

${JSON.stringify(EXAMPLE, null, 2)}

Its readable link:
${readable}

## The site's own builds (good examples)

${OFFICIAL_BUILDS.map((b) => `- [${txt(b.name, 'en')}](${origin}/builds/${b.slug}) (${b.survivor ? SURVIVORS.find((s) => s.id === b.survivor)!.name.en : 'generic'}): ${txt(b.tagline, 'en')}`).join('\n')}

GET ${origin}/api/builds lists them as JSON, with their items.
`
}

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(text(new URL(request.url).origin), {
          headers: { 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=3600' },
        }),
    },
  },
})
