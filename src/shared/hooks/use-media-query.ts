'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Live result of a CSS media query, e.g. useMediaQuery('(min-width: 48rem)').
 * `serverValue` is used for the server render and the first client render, then React
 * switches to the real value — no hydration mismatch.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)
      return () => mediaQuery.removeEventListener('change', onChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}
