import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { InfiniteGrid } from '@/components/media/InfiniteGrid'
import { TitleCard } from '@/components/media/TitleCard'
import { Tabs } from '@/components/ui/Tabs'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useGenres, useInfiniteDiscover } from '@/lib/query/hooks'
import { normalizeTitle, uniqueById } from '@/lib/utils/media'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cn } from '@/lib/utils/cn'
import type { DiscoverParams, DiscoverSort, TitleMediaType } from '@/lib/tmdb/types'

const MEDIA_TABS = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
] as const

const SORT_OPTIONS: ReadonlyArray<{ value: DiscoverSort; label: string }> = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest First' },
  { value: 'primary_release_date.asc', label: 'Oldest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
  { value: 'title.asc', label: 'Title (A–Z)' },
]

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((s) => s.value))

/**
 * Discover / browse page with genre and sort filters.
 *
 * Replaces the old Genre page, which called `setGenreId(id)` during render
 * (triggering a re-render loop) and had no filtering or sorting at all.
 * All filter state lives in the URL so a filtered view is shareable.
 */
export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const typeParam = searchParams.get('type')
  const mediaType: TitleMediaType = typeParam === 'tv' ? 'tv' : 'movie'

  const sortParam = searchParams.get('sort')
  const sortBy: DiscoverSort =
    sortParam && VALID_SORTS.has(sortParam) ? (sortParam as DiscoverSort) : 'popularity.desc'

  // Genre ids are comma-separated in the URL: ?genre=28,12
  const selectedGenres = useMemo(() => {
    const raw = searchParams.get('genre')
    if (!raw) return [] as number[]
    return raw
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isSafeInteger(value) && value > 0)
  }, [searchParams])

  const minVotes = searchParams.get('minVotes')

  usePageTitle(`Discover ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`)

  const { data: genres } = useGenres(mediaType)

  const params = useMemo<DiscoverParams>(() => {
    const next: DiscoverParams = { sort_by: sortBy }
    if (selectedGenres.length > 0) next.with_genres = selectedGenres.join(',')
    // Sorting by rating without a vote floor surfaces titles with a single
    // 10/10 vote, which is useless — require a meaningful sample.
    if (sortBy === 'vote_average.desc') next['vote_count.gte'] = Number(minVotes) || 300
    return next
  }, [sortBy, selectedGenres, minVotes])

  const query = useInfiniteDiscover(mediaType, params)

  const titles = useMemo(() => {
    const flat = query.data?.pages.flatMap((page) => page.results) ?? []
    return uniqueById(flat).map((item) => normalizeTitle(item, mediaType))
  }, [query.data, mediaType])

  /** Writes one param while preserving the rest. */
  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const toggleGenre = (genreId: number) => {
    const next = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId]
    updateParam('genre', next.length ? next.join(',') : null)
  }

  const hasFilters = selectedGenres.length > 0 || sortBy !== 'popularity.desc'

  return (
    <Container className="py-8">
      <PageHeader
        title="Discover"
        description="Filter by genre and sort to find something new."
      />

      <div className="mb-6 space-y-4">
        <Tabs
          items={MEDIA_TABS}
          value={mediaType}
          onChange={(value) => {
            // Genre ids differ between movie and TV, so clear them on switch.
            const next = new URLSearchParams(searchParams)
            next.set('type', value)
            next.delete('genre')
            setSearchParams(next, { replace: true })
          }}
          variant="underline"
          aria-label="Media type"
        />

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full max-w-[220px]">
            <Select
              label="Sort by"
              value={sortBy}
              onChange={(event) => updateParam('sort', event.target.value)}
              options={SORT_OPTIONS}
            />
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={() => setSearchParams({ type: mediaType }, { replace: true })}
            >
              Clear filters
            </Button>
          )}
        </div>

        {genres && genres.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Genres</legend>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const active = selectedGenres.includes(genre.id)
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand text-brand-fg'
                        : 'bg-surface-2 text-fg hover:bg-border',
                    )}
                  >
                    {genre.name}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {selectedGenres.length > 0 && genres && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Filtering by:</span>
            {selectedGenres.map((id) => {
              const genre = genres.find((g) => g.id === id)
              if (!genre) return null
              return (
                <Badge key={id} variant="brand">
                  {genre.name}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      <InfiniteGrid
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={query.refetch}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isEmpty={titles.length === 0}
        totalResults={query.data?.pages[0]?.total_results}
        emptyTitle="No titles match these filters"
        emptyDescription="Try removing a genre or changing the sort order."
      >
        {titles.map((title, index) => (
          <TitleCard
            key={`${title.mediaType}-${title.id}`}
            title={title}
            priority={index < 6}
            layout="fluid"
          />
        ))}
      </InfiniteGrid>
    </Container>
  )
}
