import { useEffect, useRef } from 'react'

export interface UseIntersectionOptions {
  /** Called when the sentinel scrolls into view. */
  onIntersect: () => void
  /** When false, the observer is detached (e.g. no further pages to load). */
  enabled?: boolean
  /** Distance ahead of the viewport at which to trigger. */
  rootMargin?: string
}

/**
 * Fires `onIntersect` when the returned ref's element enters the viewport.
 *
 * Used to drive infinite scroll. A ref holds the callback so a changing
 * `onIntersect` identity doesn't tear down and rebuild the observer on
 * every render.
 */
export function useIntersection<T extends HTMLElement = HTMLDivElement>({
  onIntersect,
  enabled = true,
  rootMargin = '400px',
}: UseIntersectionOptions) {
  const targetRef = useRef<T | null>(null)
  const callbackRef = useRef(onIntersect)

  useEffect(() => {
    callbackRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const element = targetRef.current
    if (!element || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callbackRef.current()
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [enabled, rootMargin])

  return targetRef
}
