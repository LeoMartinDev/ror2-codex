import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { LangSwitch, useLang } from '#/lib/i18n'
import { CONTROL_TEXT } from './ui'

/** The square logo and the app name. `subtitle` is the small line shown on wide screens. */
export function Logo({ subtitle }: { subtitle: string }) {
  const { tr } = useLang()
  return (
    <a href="/" className="px-focus group flex items-center gap-2.5" aria-label={tr('RoR2 Codex, accueil', 'RoR2 Codex, home')}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 11 11"
        aria-hidden
        shapeRendering="crispEdges"
        className="drop-shadow-[0_0_8px_rgba(242,201,76,0.45)] transition-transform group-hover:rotate-90"
      >
        <rect width="11" height="11" fill="#f2c94c" />
        <rect x="2" y="2" width="7" height="7" fill="#0a0b0e" />
        <rect x="4" y="4" width="3" height="3" fill="#f2c94c" />
      </svg>
      <span className="flex flex-col">
        <span className="font-label text-xl leading-none tracking-wide">
          RoR2<span className="text-accent"> Codex</span>
        </span>
        <span className="mt-1 hidden text-[11px] leading-none text-ink-mute xl:block">{subtitle}</span>
      </span>
    </a>
  )
}

const TAB = 'px-focus flex h-9 items-center px-3 border-b-2 transition-colors'

export type SiteSection = 'items' | 'builds' | 'teleporters'

/** "Items | Builds | Teleporters": the sections of the app. */
export function SiteNav({ current }: { current: SiteSection }) {
  const { tr } = useLang()
  const tab = (active: boolean) =>
    [TAB, CONTROL_TEXT, active ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'].join(' ')
  return (
    <nav aria-label={tr('Sections', 'Sections')} className="flex shrink-0 items-center">
      <Link to="/" className={tab(current === 'items')} aria-current={current === 'items' ? 'page' : undefined}>
        {tr('Objets', 'Items')}
      </Link>
      <Link to="/builds" className={tab(current === 'builds')} aria-current={current === 'builds' ? 'page' : undefined}>
        Builds
      </Link>
      <Link to="/teleporters" className={tab(current === 'teleporters')} aria-current={current === 'teleporters' ? 'page' : undefined}>
        {tr('Téléporteurs', 'Teleporters')}
      </Link>
    </nav>
  )
}

/** Frame of the text pages (builds, teleporters): the site header, then the page in a readable column. */
export function PageLayout({ current, subtitle, children }: { current: SiteSection; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="topbar sticky top-0 z-30 border-b-2 border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 lg:gap-5">
          <Logo subtitle={subtitle} />
          <SiteNav current={current} />
          <div className="ml-auto">
            <LangSwitch />
          </div>
        </div>
      </header>
      <main className="bg-dots flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </main>
    </div>
  )
}
