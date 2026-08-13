import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Image } from '@/components/ui/Image'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { Container } from '@/components/layout/Section'
import { BookmarkIcon, HeartIcon, PlayIcon } from '@/components/ui/icons'
import { backdropSrcSet, backdropUrl, posterSrcSet, posterUrl } from '@/lib/tmdb/images'
import { formatDate, formatRuntime, joinNonEmpty } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { useIsInList, useToggleLibrary } from '@/stores/libraryStore'
import type { Genre, TitleMediaType } from '@/lib/tmdb/types'

export interface DetailHeroProps {
  id: number
  mediaType: TitleMediaType
  title: string
  tagline: string | null
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string | null
  runtimeMinutes: number | null
  genres: Genre[]
  voteAverage: number
  certification: string | null
  /** Directors for a movie, creators for a series. */
  credits: Array<{ label: string; names: string[] }>
  onPlayTrailer?: (() => void) | undefined
  hasTrailer?: boolean
}

/**
 * Detail-page hero: backdrop, poster, key facts and actions.
 *
 * Replaces the top half of the old 1023-line Review.jsx, which hardcoded
 * absolute pixel positions and had no mobile layout at all.
 */
export function DetailHero({
  id,
  mediaType,
  title,
  tagline,
  overview,
  posterPath,
  backdropPath,
  releaseDate,
  runtimeMinutes,
  genres,
  voteAverage,
  certification,
  credits,
  onPlayTrailer,
  hasTrailer = false,
}: DetailHeroProps) {
  const toggle = useToggleLibrary()
  const isFavorite = useIsInList('favorites', mediaType, id)
  const inWatchlist = useIsInList('watchlist', mediaType, id)

  const entry = { id, mediaType, title, posterPath, releaseDate, voteAverage }

  const year = releaseDate?.slice(0, 4)
  const runtime = formatRuntime(runtimeMinutes)
  const meta = joinNonEmpty([formatDate(releaseDate), genres.map((g) => g.name).join(', '), runtime], ' · ')

  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      {backdropPath && (
        <img
          src={backdropUrl(backdropPath, 'w1280') ?? undefined}
          srcSet={backdropSrcSet(backdropPath)}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />

      <Container>
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:gap-8 sm:py-10">
          {/* Poster: centered and narrower on phones, fixed beside the text on tablet+. */}
          <div className="mx-auto w-[200px] shrink-0 sm:mx-0 sm:w-[260px]">
            <Image
              src={posterUrl(posterPath, 'w500')}
              srcSet={posterSrcSet(posterPath)}
              sizes="(max-width: 640px) 200px, 260px"
              alt={`${title} poster`}
              loading="eager"
              fetchPriority="high"
              className="shadow-panel"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-tight sm:text-4xl">
              {title}
              {year && <span className="ml-2 font-normal text-white/70">({year})</span>}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/85">
              {certification && (
                <span className="rounded border border-white/40 px-1.5 py-0.5 text-xs font-semibold">
                  {certification}
                </span>
              )}
              <span>{meta}</span>
            </div>

            {genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    to={`/discover?type=${mediaType}&genre=${genre.id}`}
                    className="bg-white/15 text-white hover:bg-brand"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <ScoreRing voteAverage={voteAverage} size={52} />
                <span className="text-sm font-semibold leading-tight">
                  User
                  <br />
                  Score
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <IconAction
                  active={isFavorite}
                  onClick={() => toggle('favorites', entry)}
                  label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <HeartIcon size={18} filled={isFavorite} />
                </IconAction>

                <IconAction
                  active={inWatchlist}
                  onClick={() => toggle('watchlist', entry)}
                  label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <BookmarkIcon size={18} filled={inWatchlist} />
                </IconAction>

                {hasTrailer && onPlayTrailer && (
                  <Button
                    variant="ghost"
                    onClick={onPlayTrailer}
                    startIcon={<PlayIcon size={16} />}
                    className="text-white hover:bg-white/15"
                  >
                    Play Trailer
                  </Button>
                )}
              </div>
            </div>

            {tagline && <p className="mt-5 italic text-white/75">{tagline}</p>}

            <div className="mt-4">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="mt-1 max-w-3xl leading-relaxed text-white/90">
                {overview || 'No overview has been added for this title yet.'}
              </p>
            </div>

            {credits.length > 0 && (
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {credits.map(({ label, names }) => (
                  <div key={label}>
                    <dt className="text-sm font-bold">{label}</dt>
                    <dd className="text-sm text-white/80">{names.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

function IconAction({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors',
        active ? 'bg-brand text-brand-fg' : 'bg-navy/70 text-white ring-1 ring-white/25 hover:bg-white/15',
      )}
    >
      {children}
    </button>
  )
}
