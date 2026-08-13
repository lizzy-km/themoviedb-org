import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { GridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useIntersection } from '@/hooks/useIntersection'
import { cn } from '@/lib/utils/cn'

export interface InfiniteGridProps {
  children: ReactNode
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry?: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  /** True when the request succeeded but returned nothing. */
  isEmpty: boolean
  emptyTitle?: string
  emptyDescription?: string
  /** Total results, rendered above the grid when provided. */
  totalResults?: number | undefined
  className?: string
}

/**
 * Responsive grid with sentinel-driven infinite scroll.
 *
 * Consolidates loading, empty, error and pagination handling that the old
 * pages either duplicated or omitted entirely — none of them had a loading or
 * error state, so a slow network showed a blank page.
 */
export function InfiniteGrid({
  children,
  isLoading,
  isError,
  error,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isEmpty,
  emptyTitle = 'Nothing found',
  emptyDescription = 'Try adjusting your filters or search terms.',
  totalResults,
  className,
}: InfiniteGridProps) {
  const sentinelRef = useIntersection({
    onIntersect: fetchNextPage,
    // Guard against re-entrant fetches while one is already in flight.
    enabled: hasNextPage && !isFetchingNextPage && !isError,
  })

  if (isLoading) return <GridSkeleton />
  if (isError) return <ErrorState error={error} onRetry={onRetry} />
  if (isEmpty) return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div>
      {typeof totalResults === 'number' && totalResults > 0 && (
        <p className="mb-4 text-sm text-muted">
          {totalResults.toLocaleString('en-US')} {totalResults === 1 ? 'result' : 'results'}
        </p>
      )}

      <div
        className={cn(
          'grid grid-cols-2 gap-x-4 gap-y-7 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
          className,
        )}
      >
        {children}
      </div>

      {/* Sentinel sits ahead of the viewport bottom so the next page is
          usually already loaded by the time the user reaches it. */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      <div className="flex justify-center py-8">
        {isFetchingNextPage ? (
          <Spinner size={28} label="Loading more results" className="text-brand" />
        ) : hasNextPage ? (
          // Visible fallback for anyone whose IntersectionObserver never fires.
          <Button variant="outline" onClick={fetchNextPage}>
            Load more
          </Button>
        ) : (
          <p className="text-sm text-subtle">You&rsquo;ve reached the end.</p>
        )}
      </div>
    </div>
  )
}

/** Grid variant sized for person cards, which are narrower than posters. */
export function PersonGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
      {children}
    </div>
  )
}
