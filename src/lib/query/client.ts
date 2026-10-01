import { QueryCache, QueryClient } from '@tanstack/react-query'
import { TmdbError } from '@/lib/tmdb/client'
import { trackEvent } from '@/lib/analytics'

/**
 * Shared QueryClient.
 *
 * TMDB list/detail data is effectively static for minutes at a time, so the
 * defaults lean heavily on caching: a revisit to a page you've already seen
 * renders instantly from cache with no refetch. The old implementation used
 * `useMutation` for reads, so every mount refetched from scratch.
 */
export const queryClient = new QueryClient({
  // Fires once per query after retries are exhausted, not per attempt.
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Aborts are navigation, not failures.
      if (error instanceof DOMException && error.name === 'AbortError') return
      trackEvent('api_error', {
        endpoint: query.queryKey.slice(0, 2).map(String).join('/'),
        status: error instanceof TmdbError ? error.status : 0,
        message: error.message,
      })
    },
  }),
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes — no refetch on remount/focus.
      staleTime: 5 * 60 * 1000,
      // Keep unused data around for 30 minutes so back-navigation is instant.
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Don't burn retries on 401/404 — only on transient failures.
      retry: (failureCount, error) => {
        if (error instanceof TmdbError && !error.retryable) return false
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
    },
  },
})
