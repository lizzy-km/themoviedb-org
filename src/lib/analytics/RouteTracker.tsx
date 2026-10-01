import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from './client'

/** `/movie/603/cast` → `/movie/:id/cast`, so detail pages group in reports. */
function pageTemplate(pathname: string): string {
  return pathname.replace(/\/\d+(?=\/|$)/g, '/:id') || '/'
}

/**
 * Sends a `page_view` on every client-side navigation.
 *
 * Firebase's automatic page view only fires on the initial load, which misses
 * every in-app route change in an SPA. Must render inside the router.
 */
export function RouteTracker() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Defer one frame so the route's `usePageTitle` effect has run and the
    // event carries the new page's title rather than the previous one.
    const frame = requestAnimationFrame(() => {
      trackEvent('page_view', {
        page_path: pathname + search,
        page_location: window.location.href,
        page_title: document.title,
        page_template: pageTemplate(pathname),
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, search])

  return null
}
