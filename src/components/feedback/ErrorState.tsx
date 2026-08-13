import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertIcon } from '@/components/ui/icons'
import { TmdbError } from '@/lib/tmdb/client'

export interface ErrorStateProps {
  error?: unknown
  onRetry?: (() => void) | undefined
  title?: string
}

/** Turns an unknown thrown value into a message worth showing a user. */
export function describeError(error: unknown): string {
  if (error instanceof TmdbError) return error.message
  if (error instanceof Error) {
    return navigator.onLine
      ? error.message
      : 'You appear to be offline. Check your connection and try again.'
  }
  return 'An unexpected error occurred.'
}

export function ErrorState({ error, onRetry, title = 'Something went wrong' }: ErrorStateProps) {
  // A 404 is a missing title, not a failure — say so plainly and don't offer retry.
  const isNotFound = error instanceof TmdbError && error.status === 404

  return (
    <EmptyState
      icon={<AlertIcon size={40} strokeWidth={1.5} className="text-danger" />}
      title={isNotFound ? 'Not found' : title}
      description={describeError(error)}
      action={
        onRetry && !isNotFound ? (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    />
  )
}
