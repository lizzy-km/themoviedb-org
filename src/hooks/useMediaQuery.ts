import { useEffect, useState } from 'react'

/**
 * Subscribes to a CSS media query.
 *
 * Replaces react-responsive. Note that layout should prefer CSS breakpoints —
 * this is only for cases where the *markup* must differ (e.g. rendering a
 * drawer instead of an inline nav), not just its styling.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    // Sync immediately in case the query changed between render and effect.
    setMatches(mediaQuery.matches)

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Tailwind-aligned breakpoint helpers. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')
