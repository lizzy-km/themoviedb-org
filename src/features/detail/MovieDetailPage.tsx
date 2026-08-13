import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailHero } from './components/DetailHero'
import { CastSection } from './components/CastSection'
import { ReviewsSection } from './components/ReviewsSection'
import { FactsSidebar } from './components/FactsSidebar'
import { RecommendationsSection } from './components/RecommendationsSection'
import { Container, Section } from '@/components/layout/Section'
import { DetailSkeleton } from '@/components/ui/Skeleton'
import { Tabs, TabPanel } from '@/components/ui/Tabs'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TrailerModal } from '@/components/media/TrailerModal'
import { VideoGallery } from '@/components/media/VideoGallery'
import { ImageGallery } from '@/components/media/ImageGallery'
import { useMovieDetail } from '@/lib/query/hooks'
import { pickCertification, pickDirectors, pickTrailer, pickWriters } from '@/lib/utils/media'
import { useNumericParam } from '@/hooks/useNumericParam'
import { usePageTitle } from '@/hooks/usePageTitle'
import { NotFoundPage } from '@/features/misc/NotFoundPage'
import { formatYear } from '@/lib/utils/format'

type MediaTab = 'videos' | 'backdrops' | 'posters'

export default function MovieDetailPage() {
  const { id } = useParams()
  const movieId = useNumericParam(id)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [mediaTab, setMediaTab] = useState<MediaTab>('videos')

  const { data: movie, isLoading, isError, error, refetch } = useMovieDetail(movieId)

  usePageTitle(movie ? `${movie.title}${formatYear(movie.release_date) ? ` (${formatYear(movie.release_date)})` : ''}` : undefined)

  const trailer = useMemo(() => pickTrailer(movie?.videos?.results), [movie])

  const credits = useMemo(() => {
    const crew = movie?.credits?.crew ?? []
    const directors = pickDirectors(crew)
    const writers = pickWriters(crew)
    return [
      directors.length > 0 && { label: directors.length > 1 ? 'Directors' : 'Director', names: directors },
      writers.length > 0 && { label: writers.length > 1 ? 'Writers' : 'Writer', names: writers },
    ].filter((item): item is { label: string; names: string[] } => Boolean(item))
  }, [movie])

  if (movieId === null) return <NotFoundPage />
  if (isLoading) return <DetailSkeleton />
  if (isError || !movie) {
    return (
      <Container className="py-8">
        <ErrorState error={error} onRetry={refetch} />
      </Container>
    )
  }

  const mediaTabs = [
    { value: 'videos' as const, label: 'Videos', count: movie.videos?.results?.length },
    { value: 'backdrops' as const, label: 'Backdrops', count: movie.images?.backdrops?.length },
    { value: 'posters' as const, label: 'Posters', count: movie.images?.posters?.length },
  ]

  return (
    <>
      <DetailHero
        id={movie.id}
        mediaType="movie"
        title={movie.title}
        tagline={movie.tagline}
        overview={movie.overview}
        posterPath={movie.poster_path}
        backdropPath={movie.backdrop_path}
        releaseDate={movie.release_date ?? null}
        runtimeMinutes={movie.runtime}
        genres={movie.genres ?? []}
        voteAverage={movie.vote_average}
        certification={pickCertification(movie.release_dates?.results)}
        credits={credits}
        hasTrailer={Boolean(trailer)}
        onPlayTrailer={() => setTrailerOpen(true)}
      />

      <Container className="py-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <CastSection cast={movie.credits?.cast} fullCreditsHref={`/movie/${movie.id}/cast`} />

            <Section title="Media" action={
              <Tabs
                items={mediaTabs}
                value={mediaTab}
                onChange={setMediaTab}
                aria-label="Media type"
              />
            }>
              <TabPanel>
                {mediaTab === 'videos' && <VideoGallery videos={movie.videos?.results} />}
                {mediaTab === 'backdrops' && (
                  <ImageGallery images={movie.images?.backdrops} kind="backdrop" title={movie.title} />
                )}
                {mediaTab === 'posters' && (
                  <ImageGallery images={movie.images?.posters} kind="poster" title={movie.title} />
                )}
              </TabPanel>
            </Section>

            <ReviewsSection reviews={movie.reviews?.results} titleName={movie.title} />
          </div>

          <FactsSidebar
            facts={[
              { label: 'Status', value: movie.status },
              { label: 'Original Title', value: movie.original_title },
              {
                label: 'Original Language',
                value: movie.spoken_languages?.[0]?.english_name ?? movie.original_language,
              },
              {
                label: 'Production',
                value: movie.production_companies?.map((c) => c.name).join(', '),
              },
              {
                label: 'Countries',
                value: movie.production_countries?.map((c) => c.name).join(', '),
              },
            ]}
            keywords={movie.keywords?.keywords ?? []}
            externalIds={movie.external_ids}
            homepage={movie.homepage}
            languages={movie.spoken_languages}
            budget={movie.budget}
            revenue={movie.revenue}
          />
        </div>

        <RecommendationsSection
          items={
            movie.recommendations?.results?.length
              ? movie.recommendations.results
              : movie.similar?.results
          }
          mediaType="movie"
        />
      </Container>

      <TrailerModal video={trailerOpen ? trailer : null} onClose={() => setTrailerOpen(false)} />
    </>
  )
}
