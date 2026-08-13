import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertIcon } from '@/components/ui/icons'
import { describeError, isNotFoundError } from '@/lib/utils/errors'

export interface ErrorStateProps {
  error?: unknown
  onRetry?: (() => void) | undefined
  title?: string
}

/** Inline failure panel for a query that errored. */
export function ErrorState({ error, onRetry, title = 'Something went wrong' }: ErrorStateProps) {
  // A 404 is a missing title, not a failure — say so plainly and don't offer retry.
  const notFound = isNotFoundError(error)

  return (
    <EmptyState
      icon={<AlertIcon size={40} strokeWidth={1.5} className="text-danger" />}
      title={notFound ? 'Not found' : title}
      description={describeError(error)}
      action={
        onRetry && !notFound ? (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    />
  )
}
