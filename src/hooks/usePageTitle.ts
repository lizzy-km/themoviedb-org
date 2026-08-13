import { useEffect } from 'react'

const BASE_TITLE = 'Movie Explorer'

/**
 * Sets `document.title` for the current route and restores it on unmount.
 *
 * Pass `undefined` while data is still loading to leave the previous title in
 * place rather than flashing a placeholder.
 */
export function usePageTitle(title: string | undefined): void {
  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = title.includes(BASE_TITLE) ? title : `${title} — ${BASE_TITLE}`
    return () => {
      document.title = previous
    }
  }, [title])
}
