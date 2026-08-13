import { useMemo } from 'react'
import { Container, PageHeader } from '@/components/layout/Section'
import { PersonCard } from '@/components/media/PersonCard'
import { PersonGrid } from '@/components/media/InfiniteGrid'
import { GridSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useInfinitePopularPeople } from '@/lib/query/hooks'
import { uniqueById } from '@/lib/utils/media'
import { useIntersection } from '@/hooks/useIntersection'
import { usePageTitle } from '@/hooks/usePageTitle'

/**
 * Popular people index.
 *
 * Entirely new — the old navbar's "People" link pointed at `/`.
 */
export default function PeoplePage() {
  usePageTitle('Popular People')

  const query = useInfinitePopularPeople()

  const people = useMemo(() => {
    const flat = query.data?.pages.flatMap((page) => page.results) ?? []
    return uniqueById(flat)
  }, [query.data])

  const sentinelRef = useIntersection({
    onIntersect: query.fetchNextPage,
    enabled: query.hasNextPage && !query.isFetchingNextPage && !query.isError,
  })

  return (
    <Container className="py-8">
      <PageHeader title="Popular People" description="Actors, directors and crew trending now." />

      {query.isLoading ? (
        <GridSkeleton count={14} />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : people.length === 0 ? (
        <EmptyState title="No people found" />
      ) : (
        <>
          <PersonGrid>
            {people.map((person) => (
              <PersonCard
                key={person.id}
                id={person.id}
                name={person.name}
                profilePath={person.profile_path}
                subtitle={person.known_for
                  ?.map((item) => ('title' in item ? item.title : item.name))
                  .filter(Boolean)
                  .slice(0, 2)
                  .join(', ')}
                layout="fluid"
              />
            ))}
          </PersonGrid>

          <div ref={sentinelRef} aria-hidden="true" className="h-px" />

          <div className="flex justify-center py-8">
            {query.isFetchingNextPage ? (
              <Spinner size={28} label="Loading more people" className="text-brand" />
            ) : query.hasNextPage ? (
              <Button variant="outline" onClick={() => query.fetchNextPage()}>
                Load more
              </Button>
            ) : (
              <p className="text-sm text-subtle">You&rsquo;ve reached the end.</p>
            )}
          </div>
        </>
      )}
    </Container>
  )
}
