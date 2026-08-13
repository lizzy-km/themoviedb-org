import { TmdbError } from '@/lib/tmdb/client'

/** Turns an unknown thrown value into a message worth showing a user. */
export function describeError(error: unknown): string {
  if (error instanceof TmdbError) return error.message

  if (error instanceof Error) {
    // A generic fetch failure while offline is almost always the connection,
    // not the API — say the useful thing instead of "Failed to fetch".
    return navigator.onLine
      ? error.message
      : 'You appear to be offline. Check your connection and try again.'
  }

  return 'An unexpected error occurred.'
}

/** True when the error represents a missing resource rather than a failure. */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof TmdbError && error.status === 404
}
