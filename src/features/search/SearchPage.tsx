import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { InfiniteGrid, PersonGrid } from '@/components/media/InfiniteGrid'
import { TitleCard } from '@/components/media/TitleCard'
import { PersonCard } from '@/components/media/PersonCard'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { GridSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { SearchIcon } from '@/components/ui/icons'
import { useInfiniteSearch } from '@/lib/query/hooks'
import type { SearchScope } from '@/lib/query/hooks'
import { normalizeTitle, uniqueById } from '@/lib/utils/media'
import { useIntersection } from '@/hooks/useIntersection'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { MovieListItem, PersonListItem, TvListItem } from '@/lib/tmdb/types'

const SCOPES = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
  { value: 'person', label: 'People' },
] as const satisfies ReadonlyArray<{ value: SearchScope; label: string }>

const VALID_SCOPES = new Set<string>(SCOPES.map((s) => s.value))

/**
 * Search results page.
 *
 * Query and scope both live in the URL (`/search?q=…&type=…`), so results are
 * shareable and survive reload. The old page took the query from the path,
 * which broke on titles containing URL-reserved characters, and ran movie and
 * TV searches simultaneously while rendering both into the same list.
 */
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q')?.trim() ?? ''
  const typeParam = searchParams.get('type')
  const scope: SearchScope =
    typeParam && VALID_SCOPES.has(typeParam) ? (typeParam as SearchScope) : 'movie'

  usePageTitle(query ? `${query} — Search results` : 'Search')

  const results = useInfiniteSearch(scope, query)

  const items = useMemo(() => {
    const flat = results.data?.pages.flatMap((page) => page.results) ?? []
    return uniqueById(flat)
  }, [results.data])

  const sentinelRef = useIntersection({
    onIntersect: results.fetchNextPage,
    enabled: results.hasNextPage && !results.isFetchingNextPage && !results.isError,
  })

  const setScope = (value: SearchScope) => {
    setSearchParams({ q: query, type: value }, { replace: true })
  }

  if (!query) {
    return (
      <Container className="py-8">
        <EmptyState
          icon={<SearchIcon size={40} strokeWidth={1.5} />}
          title="What are you looking for?"
          description="Enter a movie, TV show or person in the search box above to get started."
        />
      </Container>
    )
  }

  const isPeople = scope === 'person'
  const total = results.data?.pages[0]?.total_results

  return (
    <Container className="py-8">
      <PageHeader
        title="Search results"
        description={`Showing matches for “${query}”`}
      />

      <Tabs
        items={SCOPES}
        value={scope}
        onChange={setScope}
        variant="underline"
        aria-label="Result type"
        className="mb-6"
      />

      {isPeople ? (
        // People use a narrower grid, so they get their own render path rather
        // than being forced through the poster grid.
        results.isLoading ? (
          <GridSkeleton count={14} />
        ) : results.isError ? (
          <ErrorState error={results.error} onRetry={results.refetch} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No people found"
            description={`No people match “${query}”. Try a different spelling.`}
          />
        ) : (
          <>
            {typeof total === 'number' && (
              <p className="mb-4 text-sm text-muted">{total.toLocaleString('en-US')} results</p>
            )}
            <PersonGrid>
              {(items as PersonListItem[]).map((person) => (
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
              {results.isFetchingNextPage ? (
                <Spinner size={28} label="Loading more results" className="text-brand" />
              ) : results.hasNextPage ? (
                <Button variant="outline" onClick={() => results.fetchNextPage()}>
                  Load more
                </Button>
              ) : (
                <p className="text-sm text-subtle">You&rsquo;ve reached the end.</p>
              )}
            </div>
          </>
        )
      ) : (
        <InfiniteGrid
          isLoading={results.isLoading}
          isError={results.isError}
          error={results.error}
          onRetry={results.refetch}
          hasNextPage={results.hasNextPage}
          isFetchingNextPage={results.isFetchingNextPage}
          fetchNextPage={results.fetchNextPage}
          isEmpty={items.length === 0}
          totalResults={total}
          emptyTitle={`No ${scope === 'movie' ? 'movies' : 'TV shows'} found`}
          emptyDescription={`No results match “${query}”. Try a different spelling or search a different category.`}
        >
          {(items as Array<MovieListItem | TvListItem>).map((item, index) => (
            <TitleCard
              key={item.id}
              title={normalizeTitle(item, scope)}
              priority={index < 6}
              layout="fluid"
            />
          ))}
        </InfiniteGrid>
      )}
    </Container>
  )
}
