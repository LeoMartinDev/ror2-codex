import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * False during SSR and the hydration pass, true afterwards (and on any later client-only mount).
 * Pages are prerendered once and served for every query string or hash, so anything read from the
 * URL or the browser must wait for this to be true.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
