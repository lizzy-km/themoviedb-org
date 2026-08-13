import { memo, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Image } from '@/components/ui/Image'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { BookmarkIcon, HeartIcon } from '@/components/ui/icons'
import { posterSrcSet, posterUrl } from '@/lib/tmdb/images'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { useIsInList, useToggleLibrary } from '@/stores/libraryStore'
import type { NormalizedTitle } from '@/lib/utils/media'

export interface TitleCardProps {
  title: NormalizedTitle
  /** Character or job name, shown under the title on credit lists. */
  subtitle?: string | undefined
  /** Load the poster eagerly — only for the first few above-the-fold cards. */
  priority?: boolean
  className?: string
}

/**
 * Poster card for a movie or TV show.
 *
 * Replaces the five near-identical inline card blocks in the old codebase
 * (Movies, TvShow, Genre, DataByKeyword, WhatPopular), each of which rendered
 * both `title` and `name` fields side by side and hardcoded absolute pixel
 * offsets for the hover overlay.
 *
 * Memoized because list pages render hundreds of these; the library actions are
 * stable store references and `title` is a stable normalized object, so the
 * memo actually holds.
 */
export const TitleCard = memo(function TitleCard({
  title,
  subtitle,
  priority = false,
  className,
}: TitleCardProps) {
  const href = `/${title.mediaType}/${title.id}`
  const toggle = useToggleLibrary()
  const isFavorite = useIsInList('favorites', title.mediaType, title.id)
  const inWatchlist = useIsInList('watchlist', title.mediaType, title.id)

  // Derived from primitives so the identity is stable across renders and the
  // handlers below stay memoized.
  const entry = useMemo(
    () => ({
      id: title.id,
      mediaType: title.mediaType,
      title: title.title,
      posterPath: title.posterPath,
      releaseDate: title.releaseDate,
      voteAverage: title.voteAverage,
    }),
    [title.id, title.mediaType, title.title, title.posterPath, title.releaseDate, title.voteAverage],
  )

  const handleFavorite = useCallback(() => toggle('favorites', entry), [toggle, entry])
  const handleWatchlist = useCallback(() => toggle('watchlist', entry), [toggle, entry])

  return (
    <article className={cn('group/card w-[150px] shrink-0 sm:w-[170px]', className)}>
      <div className="relative">
        <Link
          to={href}
          className="block overflow-hidden rounded-card focus-visible:ring-2"
          aria-label={title.title}
        >
          <Image
            src={posterUrl(title.posterPath, 'w342')}
            srcSet={posterSrcSet(title.posterPath)}
            sizes="(max-width: 640px) 150px, 170px"
            alt={`${title.title} poster`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            className="transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        </Link>

        {/* Library controls appear on hover, and are always available to
            keyboard and touch users via focus-within. */}
        <div
          className={cn(
            'absolute right-1.5 top-1.5 flex flex-col gap-1.5',
            'opacity-0 transition-opacity duration-200',
            'group-hover/card:opacity-100 focus-within:opacity-100',
            '[@media(hover:none)]:opacity-100',
          )}
        >
          <IconToggle
            active={isFavorite}
            onClick={handleFavorite}
            label={isFavorite ? `Remove ${title.title} from favorites` : `Add ${title.title} to favorites`}
          >
            <HeartIcon size={15} filled={isFavorite} />
          </IconToggle>

          <IconToggle
            active={inWatchlist}
            onClick={handleWatchlist}
            label={inWatchlist ? `Remove ${title.title} from watchlist` : `Add ${title.title} to watchlist`}
          >
            <BookmarkIcon size={15} filled={inWatchlist} />
          </IconToggle>
        </div>

        <ScoreRing
          voteAverage={title.voteAverage}
          size={34}
          hideWhenEmpty
          className="absolute -bottom-3 left-2 ring-2 ring-bg"
        />
      </div>

      <div className="mt-4 px-0.5">
        <h3 className="text-sm font-bold leading-snug">
          <Link to={href} className="line-clamp-2 transition-colors hover:text-brand">
            {title.title}
          </Link>
        </h3>

        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{subtitle}</p>
        ) : (
          <p className="mt-0.5 text-xs text-muted">{formatDate(title.releaseDate) ?? '—'}</p>
        )}
      </div>
    </article>
  )
})

function IconToggle({
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
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-colors',
        active ? 'bg-brand text-brand-fg' : 'bg-black/55 text-white hover:bg-black/75',
      )}
    >
      {children}
    </button>
  )
}
