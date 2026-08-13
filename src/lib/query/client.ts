import { QueryClient } from '@tanstack/react-query'
import { TmdbError } from '@/lib/tmdb/client'

/**
 * Shared QueryClient.
 *
 * TMDB list/detail data is effectively static for minutes at a time, so the
 * defaults lean heavily on caching: a revisit to a page you've already seen
 * renders instantly from cache with no refetch. The old implementation used
 * `useMutation` for reads, so every mount refetched from scratch.
 */
export const queryClient = new QueryClient({
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
