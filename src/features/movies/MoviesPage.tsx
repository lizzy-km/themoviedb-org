import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { InfiniteGrid } from '@/components/media/InfiniteGrid'
import { TitleCard } from '@/components/media/TitleCard'
import { Tabs } from '@/components/ui/Tabs'
import { useInfiniteMovieList } from '@/lib/query/hooks'
import { normalizeTitle, uniqueById } from '@/lib/utils/media'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { MovieListCategory } from '@/lib/tmdb/endpoints'

const CATEGORIES = [
  { value: 'popular', label: 'Popular' },
  { value: 'now_playing', label: 'Now Playing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'top_rated', label: 'Top Rated' },
] as const satisfies ReadonlyArray<{ value: MovieListCategory; label: string }>

const VALID = new Set<string>(CATEGORIES.map((c) => c.value))

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // The active category lives in the URL, so a list view is shareable and
  // survives a reload — the old pages held it in component state.
  const listParam = searchParams.get('list')
  const category: MovieListCategory =
    listParam && VALID.has(listParam) ? (listParam as MovieListCategory) : 'popular'

  usePageTitle(`${CATEGORIES.find((c) => c.value === category)?.label ?? 'Popular'} Movies`)

  const query = useInfiniteMovieList(category)

  const titles = useMemo(() => {
    const flat = query.data?.pages.flatMap((page) => page.results) ?? []
    // TMDB can repeat a title across page boundaries as popularity shifts,
    // which would otherwise produce duplicate React keys.
    return uniqueById(flat).map((item) => normalizeTitle(item, 'movie'))
  }, [query.data])

  return (
    <Container className="py-8">
      <PageHeader
        title="Movies"
        description="Browse movies by popularity, release window, or critical rating."
      />

      <Tabs
        items={CATEGORIES}
        value={category}
        onChange={(value) => setSearchParams({ list: value }, { replace: true })}
        variant="underline"
        aria-label="Movie category"
        className="mb-6"
      />

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
        emptyTitle="No movies found"
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
