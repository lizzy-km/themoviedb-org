import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { InfiniteGrid } from '@/components/media/InfiniteGrid'
import { TitleCard } from '@/components/media/TitleCard'
import { Tabs } from '@/components/ui/Tabs'
import { useInfiniteTvList } from '@/lib/query/hooks'
import { normalizeTitle, uniqueById } from '@/lib/utils/media'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { TvListCategory } from '@/lib/tmdb/endpoints'

const CATEGORIES = [
  { value: 'popular', label: 'Popular' },
  { value: 'airing_today', label: 'Airing Today' },
  { value: 'on_the_air', label: 'On The Air' },
  { value: 'top_rated', label: 'Top Rated' },
] as const satisfies ReadonlyArray<{ value: TvListCategory; label: string }>

const VALID = new Set<string>(CATEGORIES.map((c) => c.value))

export default function TvPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const listParam = searchParams.get('list')
  const category: TvListCategory =
    listParam && VALID.has(listParam) ? (listParam as TvListCategory) : 'popular'

  usePageTitle(`${CATEGORIES.find((c) => c.value === category)?.label ?? 'Popular'} TV Shows`)

  const query = useInfiniteTvList(category)

  const titles = useMemo(() => {
    const flat = query.data?.pages.flatMap((page) => page.results) ?? []
    return uniqueById(flat).map((item) => normalizeTitle(item, 'tv'))
  }, [query.data])

  return (
    <Container className="py-8">
      <PageHeader
        title="TV Shows"
        description="Browse series by popularity, what's airing now, or critical rating."
      />

      <Tabs
        items={CATEGORIES}
        value={category}
        onChange={(value) => setSearchParams({ list: value }, { replace: true })}
        variant="underline"
        aria-label="TV category"
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
        emptyTitle="No TV shows found"
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
