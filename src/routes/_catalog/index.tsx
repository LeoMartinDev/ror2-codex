import { createFileRoute } from '@tanstack/react-router'

/** The catalogue with no item open. The page itself is the parent layout (src/routes/_catalog.tsx). */
export const Route = createFileRoute('/_catalog/')({
  component: () => null,
})
