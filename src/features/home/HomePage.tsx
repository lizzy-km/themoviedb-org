import { useState } from 'react'
import { Hero } from './components/Hero'
import { TitleCarouselSection } from './components/TitleCarouselSection'
import { Container, Section } from '@/components/layout/Section'
import { Carousel } from '@/components/media/Carousel'
import { PersonCard } from '@/components/media/PersonCard'
import { CarouselSkeleton } from '@/components/ui/Skeleton'
import { VideoGallery } from '@/components/media/VideoGallery'
import { useMovieList, useTrending, useTvList } from '@/lib/query/hooks'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { getPopularPeople, getMovieList } from '@/lib/tmdb/endpoints'
import { isTitleResult } from '@/lib/utils/media'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { TrendingWindow } from '@/lib/tmdb/endpoints'

type PopularTab = 'streaming' | 'theaters'

/** Trailers are pulled from whatever is now playing. */
function useLatestTrailers() {
  return useQuery({
    queryKey: ['home', 'latest-trailers'],
    queryFn: async ({ signal }) => {
      const nowPlaying = await getMovieList('now_playing', { signal })
      // Fetch trailer lists for the first handful in parallel rather than
      // sequentially, then flatten into one reel.
      const { getVideos } = await import('@/lib/tmdb/endpoints')
      const videoLists = await Promise.all(
        nowPlaying.results.slice(0, 8).map((movie) =>
          getVideos('movie', movie.id, signal).catch(() => null),
        ),
      )
      return videoLists
        .flatMap((list) => list?.results ?? [])
        .filter((video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
        .slice(0, 15)
    },
    staleTime: 15 * 60 * 1000,
  })
}

export default function HomePage() {
  usePageTitle('Movie Explorer — Discover movies, TV shows and people')

  const [trendingWindow, setTrendingWindow] = useState<TrendingWindow>('day')
  const [popularTab, setPopularTab] = useState<PopularTab>('streaming')

  const trending = useTrending('all', trendingWindow)
  const popularTv = useTvList('popular')
  const nowPlaying = useMovieList('now_playing')
  const topRated = useMovieList('top_rated')
  const trailers = useLatestTrailers()

  const people = useQuery({
    queryKey: queryKeys.people.popular(),
    queryFn: ({ signal }) => getPopularPeople({ signal }),
    select: (data) => data.results.slice(0, 15),
  })

  // Trending returns people too; the carousel only renders titles.
  const trendingTitles = trending.data?.filter(isTitleResult)

  const popular = popularTab === 'streaming' ? popularTv : nowPlaying

  return (
    <>
      <Hero />

      <Container>
        <TitleCarouselSection
          title="Trending"
          items={trendingTitles}
          isLoading={trending.isLoading}
          isError={trending.isError}
          error={trending.error}
          onRetry={trending.refetch}
          tabs={{
            label: 'Trending time window',
            value: trendingWindow,
            onChange: setTrendingWindow,
            items: [
              { value: 'day', label: 'Today' },
              { value: 'week', label: 'This Week' },
            ],
          }}
        />

        <TitleCarouselSection
          title="What's Popular"
          items={popular.data}
          isLoading={popular.isLoading}
          isError={popular.isError}
          error={popular.error}
          onRetry={popular.refetch}
          fallbackMediaType={popularTab === 'streaming' ? 'tv' : 'movie'}
          seeAllHref={popularTab === 'streaming' ? '/tv?list=popular' : '/movies?list=now_playing'}
          tabs={{
            label: 'Popular category',
            value: popularTab,
            onChange: setPopularTab,
            items: [
              { value: 'streaming', label: 'On TV' },
              { value: 'theaters', label: 'In Theaters' },
            ],
          }}
        />

        <Section title="Latest Trailers">
          {trailers.isLoading ? (
            <CarouselSkeleton count={5} />
          ) : (
            <VideoGallery videos={trailers.data} label="Latest trailers" />
          )}
        </Section>

        <TitleCarouselSection
          title="Top Rated Movies"
          items={topRated.data}
          isLoading={topRated.isLoading}
          isError={topRated.isError}
          error={topRated.error}
          onRetry={topRated.refetch}
          fallbackMediaType="movie"
          seeAllHref="/movies?list=top_rated"
        />

        <Section title="Popular People" seeAllHref="/people">
          {people.isLoading ? (
            <CarouselSkeleton count={8} />
          ) : (
            <Carousel label="Popular people">
              {people.data?.map((person) => (
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
                />
              ))}
            </Carousel>
          )}
        </Section>

        <div className="h-8" />
      </Container>
    </>
  )
}
