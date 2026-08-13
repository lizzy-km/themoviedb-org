import { useEffect, useState } from 'react'

/**
 * Returns `value` after it has stopped changing for `delay` ms.
 *
 * Debouncing the *value* rather than the event handler (the old code called
 * `lodash.debounce` inline during render, creating a fresh debounced function
 * every render and so never actually debouncing anything) keeps the input fully
 * controlled and responsive while the query lags behind.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}
