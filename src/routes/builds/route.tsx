import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PageLayout } from '#/components/SiteNav'
import { useLang } from '#/lib/i18n'

/** Frame of every /builds page: the site header, then the page in a readable column. */
export const Route = createFileRoute('/builds')({
  component: BuildsLayout,
})

function BuildsLayout() {
  const { tr } = useLang()
  return (
    <PageLayout current="builds" subtitle={tr('Builds & synergies', 'Builds & synergies')}>
      <Outlet />
    </PageLayout>
  )
}
