import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Logo, SiteNav } from '#/components/SiteNav'
import { LangSwitch, useLang } from '#/lib/i18n'

/** Frame of every /builds page: the site header, then the page in a readable column. */
export const Route = createFileRoute('/builds')({
  component: BuildsLayout,
})

function BuildsLayout() {
  const { tr } = useLang()
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="topbar sticky top-0 z-30 border-b-2 border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 lg:gap-5">
          <Logo subtitle={tr('Builds & synergies', 'Builds & synergies')} />
          <SiteNav current="builds" />
          <div className="ml-auto">
            <LangSwitch />
          </div>
        </div>
      </header>
      <main className="bg-dots flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
