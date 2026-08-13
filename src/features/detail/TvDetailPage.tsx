import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailHero } from './components/DetailHero'
import { CastSection } from './components/CastSection'
import { ReviewsSection } from './components/ReviewsSection'
import { FactsSidebar } from './components/FactsSidebar'
import { RecommendationsSection } from './components/RecommendationsSection'
import { SeasonsSection } from './components/SeasonsSection'
import { Container, Section } from '@/components/layout/Section'
import { DetailSkeleton } from '@/components/ui/Skeleton'
import { Tabs, TabPanel } from '@/components/ui/Tabs'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TrailerModal } from '@/components/media/TrailerModal'
import { VideoGallery } from '@/components/media/VideoGallery'
import { ImageGallery } from '@/components/media/ImageGallery'
import { useTvDetail } from '@/lib/query/hooks'
import { pickContentRating, pickTrailer } from '@/lib/utils/media'
import { formatRuntime, formatYear } from '@/lib/utils/format'
import { useNumericParam } from '@/hooks/useNumericParam'
import { usePageTitle } from '@/hooks/usePageTitle'
import { NotFoundPage } from '@/features/misc/NotFoundPage'

type MediaTab = 'videos' | 'backdrops' | 'posters'

export default function TvDetailPage() {
  const { id } = useParams()
  const tvId = useNumericParam(id)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [mediaTab, setMediaTab] = useState<MediaTab>('videos')

  const { data: show, isLoading, isError, error, refetch } = useTvDetail(tvId)

  usePageTitle(show ? `${show.name}${formatYear(show.first_air_date) ? ` (${formatYear(show.first_air_date)})` : ''}` : undefined)

  const trailer = useMemo(() => pickTrailer(show?.videos?.results), [show])

  const credits = useMemo(() => {
    const creators = show?.created_by?.map((creator) => creator.name) ?? []
    return creators.length > 0
      ? [{ label: creators.length > 1 ? 'Creators' : 'Creator', names: creators }]
      : []
  }, [show])

  if (tvId === null) return <NotFoundPage />
  if (isLoading) return <DetailSkeleton />
  if (isError || !show) {
    return (
      <Container className="py-8">
        <ErrorState error={error} onRetry={refetch} />
      </Container>
    )
  }

  // A series has a per-episode runtime rather than a single total.
  const episodeRuntime = show.episode_run_time?.[0] ?? null

  const mediaTabs = [
    { value: 'videos' as const, label: 'Videos', count: show.videos?.results?.length },
    { value: 'backdrops' as const, label: 'Backdrops', count: show.images?.backdrops?.length },
    { value: 'posters' as const, label: 'Posters', count: show.images?.posters?.length },
  ]

  // Prefer aggregate_credits: for a series it reflects the whole run rather
  // than only the most recent episode's cast.
  const cast = show.aggregate_credits?.cast?.length
    ? show.aggregate_credits.cast
    : show.credits?.cast

  return (
    <>
      <DetailHero
        id={show.id}
        mediaType="tv"
        title={show.name}
        tagline={show.tagline}
        overview={show.overview}
        posterPath={show.poster_path}
        backdropPath={show.backdrop_path}
        releaseDate={show.first_air_date ?? null}
        runtimeMinutes={episodeRuntime}
        genres={show.genres ?? []}
        voteAverage={show.vote_average}
        certification={pickContentRating(show.content_ratings?.results)}
        credits={credits}
        hasTrailer={Boolean(trailer)}
        onPlayTrailer={() => setTrailerOpen(true)}
      />

      <Container className="py-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <CastSection cast={cast} fullCreditsHref={`/tv/${show.id}/cast`} />

            <SeasonsSection tvId={show.id} seasons={show.seasons} showName={show.name} />

            <Section title="Media" action={
              <Tabs
                items={mediaTabs}
                value={mediaTab}
                onChange={setMediaTab}
                aria-label="Media type"
              />
            }>
              <TabPanel>
                {mediaTab === 'videos' && <VideoGallery videos={show.videos?.results} />}
                {mediaTab === 'backdrops' && (
                  <ImageGallery images={show.images?.backdrops} kind="backdrop" title={show.name} />
                )}
                {mediaTab === 'posters' && (
                  <ImageGallery images={show.images?.posters} kind="poster" title={show.name} />
                )}
              </TabPanel>
            </Section>

            <ReviewsSection reviews={show.reviews?.results} titleName={show.name} />
          </div>

          <FactsSidebar
            facts={[
              { label: 'Status', value: show.status },
              { label: 'Type', value: show.type },
              { label: 'Original Name', value: show.original_name },
              { label: 'Seasons', value: show.number_of_seasons ? String(show.number_of_seasons) : undefined },
              { label: 'Episodes', value: show.number_of_episodes ? String(show.number_of_episodes) : undefined },
              { label: 'Episode Runtime', value: formatRuntime(episodeRuntime) },
              {
                label: 'Production',
                value: show.production_companies?.map((c) => c.name).join(', '),
              },
              {
                label: 'Countries',
                value: show.production_countries?.map((c) => c.name).join(', '),
              },
            ]}
            keywords={show.keywords?.results ?? []}
            externalIds={show.external_ids}
            homepage={show.homepage}
            languages={show.spoken_languages}
            networks={show.networks}
          />
        </div>

        <RecommendationsSection
          items={
            show.recommendations?.results?.length
              ? show.recommendations.results
              : show.similar?.results
          }
          mediaType="tv"
        />
      </Container>

      <TrailerModal video={trailerOpen ? trailer : null} onClose={() => setTrailerOpen(false)} />
    </>
  )
}
