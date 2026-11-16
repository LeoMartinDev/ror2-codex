import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { LangProvider } from '../lib/i18n'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'RoR2 Codex — Objets' },
      {
        name: 'description',
        content: 'Tous les objets de Risk of Rain 2 : effets, cumuls, plafonds et filtres par rareté, couleur et effet.',
      },
      { name: 'theme-color', content: '#0e1116' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/icons/syringe.png' },
      // For AI agents: how to read the items and make builds (see src/routes/llms[.]txt.ts).
      { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'Instructions for AI agents' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans min-h-dvh">
        <LangProvider>{children}</LangProvider>
        <Scripts />
      </body>
    </html>
  )
}
