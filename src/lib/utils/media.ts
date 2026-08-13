import type {
  MovieListItem,
  MultiSearchItem,
  PersonCombinedCredit,
  TitleListItem,
  TitleMediaType,
  TvListItem,
} from '@/lib/tmdb/types'

/**
 * Normalised view of any TMDB title, so cards and carousels can render movies,
 * TV shows and credits through one shape.
 *
 * The old code handled this by rendering `{data.title}` and `{data.name}`
 * side by side and letting the undefined one collapse — which produced stray
 * whitespace and made both fields untrustworthy.
 */
export interface NormalizedTitle {
  id: number
  mediaType: TitleMediaType
  title: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string | null
  voteAverage: number
  voteCount: number
  overview: string
}

export function isMovie(item: TitleListItem): item is MovieListItem {
  return 'title' in item && typeof (item as MovieListItem).title === 'string'
}

export function isTv(item: TitleListItem): item is TvListItem {
  return 'name' in item && typeof (item as TvListItem).name === 'string'
}

/**
 * Resolves the media type for a list item.
 *
 * `media_type` is present on `/trending` and `/search/multi` responses but
 * absent from `/movie/popular` and friends, so fall back to shape detection.
 */
export function resolveMediaType(item: TitleListItem, fallback?: TitleMediaType): TitleMediaType {
  if (item.media_type === 'movie' || item.media_type === 'tv') return item.media_type
  if (fallback) return fallback
  return isMovie(item) ? 'movie' : 'tv'
}

export function normalizeTitle(
  item: TitleListItem,
  fallbackMediaType?: TitleMediaType,
): NormalizedTitle {
  const mediaType = resolveMediaType(item, fallbackMediaType)
  const asMovie = item as MovieListItem
  const asTv = item as TvListItem

  return {
    id: item.id,
    mediaType,
    title: asMovie.title || asTv.name || 'Untitled',
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: asMovie.release_date || asTv.first_air_date || null,
    voteAverage: item.vote_average ?? 0,
    voteCount: item.vote_count ?? 0,
    overview: item.overview ?? '',
  }
}

/** Normalises a person's combined credit into the same card shape. */
export function normalizeCredit(credit: PersonCombinedCredit): NormalizedTitle {
  return {
    id: credit.id,
    mediaType: credit.media_type,
    title: credit.title || credit.name || 'Untitled',
    posterPath: credit.poster_path,
    backdropPath: credit.backdrop_path,
    releaseDate: credit.release_date || credit.first_air_date || null,
    voteAverage: credit.vote_average ?? 0,
    voteCount: credit.vote_count ?? 0,
    overview: credit.overview ?? '',
  }
}

/** Narrows a multi-search result to titles, discarding people. */
export function isTitleResult(
  item: MultiSearchItem,
): item is Extract<MultiSearchItem, { media_type: TitleMediaType }> {
  return item.media_type === 'movie' || item.media_type === 'tv'
}

/**
 * Picks the best trailer from a videos list.
 *
 * Preference order: official YouTube trailer > any YouTube trailer >
 * teaser > first YouTube video. TMDB returns these unsorted.
 */
export function pickTrailer<T extends { site: string; type: string; official: boolean }>(
  videos: T[] | undefined,
): T | null {
  if (!videos?.length) return null
  const youTube = videos.filter((video) => video.site === 'YouTube')
  if (!youTube.length) return null

  return (
    youTube.find((v) => v.type === 'Trailer' && v.official) ??
    youTube.find((v) => v.type === 'Trailer') ??
    youTube.find((v) => v.type === 'Teaser') ??
    youTube[0] ??
    null
  )
}

/** Deduplicates by id, preserving first-seen order. */
export function uniqueById<T extends { id: number | string }>(items: T[]): T[] {
  const seen = new Set<number | string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

/**
 * Extracts the directors (movies) or creators (TV) for the detail header.
 */
export function pickDirectors(crew: Array<{ job: string; name: string; id: number }>): string[] {
  return uniqueById(crew.filter((member) => member.job === 'Director')).map((m) => m.name)
}

export function pickWriters(
  crew: Array<{ job: string; name: string; id: number; department: string }>,
): string[] {
  const writingJobs = new Set(['Screenplay', 'Writer', 'Story', 'Author'])
  return uniqueById(crew.filter((member) => writingJobs.has(member.job))).map((m) => m.name)
}

/** US certification (e.g. "PG-13") from a movie's release_dates block. */
export function pickCertification(
  results: Array<{ iso_3166_1: string; release_dates: Array<{ certification: string }> }> | undefined,
  region = 'US',
): string | null {
  const entry = results?.find((r) => r.iso_3166_1 === region)
  const cert = entry?.release_dates.find((rd) => rd.certification.trim().length > 0)
  return cert?.certification ?? null
}

/** US content rating (e.g. "TV-MA") from a TV show's content_ratings block. */
export function pickContentRating(
  results: Array<{ iso_3166_1: string; rating: string }> | undefined,
  region = 'US',
): string | null {
  const entry = results?.find((r) => r.iso_3166_1 === region)
  return entry?.rating?.trim() || null
}
