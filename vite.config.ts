import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import items from './src/data/items.json'
import { itemSlug } from './src/lib/slug'
import { OFFICIAL_BUILDS } from './src/data/builds'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      // autoSubfolderIndex off: /items/x is written as items/x.html, which Workers assets serve at
      // /items/x (an items/x/index.html would get a redirect to /items/x/).
      prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: false },
      pages: [
        { path: '/' },
        ...items.map((it) => ({ path: `/items/${itemSlug(it)}` })),
        { path: '/builds' },
        { path: '/builds/view' },
        { path: '/builds/edit' },
        { path: '/teleporters' },
        ...OFFICIAL_BUILDS.map((b) => ({ path: `/builds/${b.slug}` })),
      ],
    }),
    viteReact(),
  ],
})
