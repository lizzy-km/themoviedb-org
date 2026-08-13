import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { InfiniteGrid } from '@/components/media/InfiniteGrid'
import { TitleCard } from '@/components/media/TitleCard'
import { Tabs } from '@/components/ui/Tabs'
import { useInfiniteDiscover, useKeyword } from '@/lib/query/hooks'
import { normalizeTitle, uniqueById } from '@/lib/utils/media'
import { useNumericParam } from '@/hooks/useNumericParam'
import { usePageTitle } from '@/hooks/usePageTitle'
import { NotFoundPage } from '@/features/misc/NotFoundPage'
import type { TitleMediaType } from '@/lib/tmdb/types'

const MEDIA_TABS = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
] as const

/**
 * Titles sharing a keyword.
 *
 * The old version passed the keyword *name* as the route param but then sent it
 * to TMDB's `with_keywords` filter, which expects a numeric id — so the page
 * always returned unfiltered popular titles. This uses the id and resolves the
 * display name from the keyword endpoint.
 */
export default function KeywordPage() {
  const { id } = useParams()
  const keywordId = useNumericParam(id)
  const [mediaType, setMediaType] = useState<TitleMediaType>('movie')

  const { data: keyword } = useKeyword(keywordId ?? undefined)
  usePageTitle(keyword?.name ? `${keyword.name} — Keyword` : 'Keyword')

  const query = useInfiniteDiscover(
    mediaType,
    { with_keywords: keywordId ? String(keywordId) : undefined, sort_by: 'popularity.desc' },
    keywordId !== null,
  )

  const titles = useMemo(() => {
    const flat = query.data?.pages.flatMap((page) => page.results) ?? []
    return uniqueById(flat).map((item) => normalizeTitle(item, mediaType))
  }, [query.data, mediaType])

  if (keywordId === null) return <NotFoundPage />

  return (
    <Container className="py-8">
      <PageHeader
        title={keyword?.name ?? 'Keyword'}
        description="Titles tagged with this keyword."
      />

      <Tabs
        items={MEDIA_TABS}
        value={mediaType}
        onChange={setMediaType}
        variant="underline"
        aria-label="Media type"
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
        emptyTitle="Nothing tagged yet"
        emptyDescription={`No ${mediaType === 'movie' ? 'movies' : 'TV shows'} carry this keyword.`}
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
