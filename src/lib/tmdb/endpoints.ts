import { tmdbFetch } from './client'
import type {
  ContentRatingsResponse,
  Credits,
  DiscoverParams,
  Genre,
  Keyword,
  MovieDetailBundle,
  MovieListItem,
  MultiSearchItem,
  Paginated,
  PersonDetailBundle,
  PersonListItem,
  Season,
  TitleMediaType,
  TvDetailBundle,
  TvListItem,
  VideoResponse,
} from './types'

/** Options common to every list request. */
interface ListOptions {
  page?: number
  signal?: AbortSignal
}

export type MovieListCategory = 'now_playing' | 'popular' | 'top_rated' | 'upcoming'
export type TvListCategory = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated'
export type TrendingWindow = 'day' | 'week'

/**
 * Fields requested alongside a detail response. Bundling these means a detail
 * page issues one request instead of the seven the previous version made.
 */
const MOVIE_APPEND = [
  'credits',
  'videos',
  'images',
  'keywords',
  'recommendations',
  'similar',
  'reviews',
  'release_dates',
  'external_ids',
  'watch/providers',
].join(',')

const TV_APPEND = [
  'credits',
  'aggregate_credits',
  'videos',
  'images',
  'keywords',
  'recommendations',
  'similar',
  'reviews',
  'content_ratings',
  'external_ids',
  'watch/providers',
].join(',')

const PERSON_APPEND = ['combined_credits', 'images', 'external_ids'].join(',')

/* ------------------------------------------------------------------ trending */

export function getTrending(
  mediaType: 'all' | TitleMediaType | 'person',
  window: TrendingWindow,
  { page = 1, signal }: ListOptions = {},
) {
  return tmdbFetch<Paginated<MultiSearchItem>>(`trending/${mediaType}/${window}`, {
    params: { page },
    signal,
  })
}

/* -------------------------------------------------------------------- movies */

export function getMovieList(
  category: MovieListCategory,
  { page = 1, signal }: ListOptions = {},
) {
  return tmdbFetch<Paginated<MovieListItem>>(`movie/${category}`, {
    params: { page },
    signal,
  })
}

export function getMovieDetail(id: number, signal?: AbortSignal) {
  return tmdbFetch<MovieDetailBundle>(`movie/${id}`, {
    params: { append_to_response: MOVIE_APPEND, include_image_language: 'en,null' },
    signal,
  })
}

/* ------------------------------------------------------------------ tv series */

export function getTvList(category: TvListCategory, { page = 1, signal }: ListOptions = {}) {
  return tmdbFetch<Paginated<TvListItem>>(`tv/${category}`, {
    params: { page },
    signal,
  })
}

export function getTvDetail(id: number, signal?: AbortSignal) {
  return tmdbFetch<TvDetailBundle>(`tv/${id}`, {
    params: { append_to_response: TV_APPEND, include_image_language: 'en,null' },
    signal,
  })
}

export function getTvSeason(tvId: number, seasonNumber: number, signal?: AbortSignal) {
  return tmdbFetch<Season & { episodes: Season[] }>(`tv/${tvId}/season/${seasonNumber}`, {
    signal,
  })
}

/* -------------------------------------------------------------------- people */

export function getPopularPeople({ page = 1, signal }: ListOptions = {}) {
  return tmdbFetch<Paginated<PersonListItem>>('person/popular', {
    params: { page },
    signal,
  })
}

export function getPersonDetail(id: number, signal?: AbortSignal) {
  return tmdbFetch<PersonDetailBundle>(`person/${id}`, {
    params: { append_to_response: PERSON_APPEND },
    signal,
  })
}

/* -------------------------------------------------------------------- search */

export function searchMulti(query: string, { page = 1, signal }: ListOptions = {}) {
  return tmdbFetch<Paginated<MultiSearchItem>>('search/multi', {
    params: { query, page, include_adult: false },
    signal,
  })
}

export function searchMovies(query: string, { page = 1, signal }: ListOptions = {}) {
  return tmdbFetch<Paginated<MovieListItem>>('search/movie', {
    params: { query, page, include_adult: false },
    signal,
  })
}

export function searchTv(query: string, { page = 1, signal }: ListOptions = {}) {
  return tmdbFetch<Paginated<TvListItem>>('search/tv', {
    params: { query, page, include_adult: false },
    signal,
  })
}

export function searchPeople(query: string, { page = 1, signal }: ListOptions = {}) {
  return tmdbFetch<Paginated<PersonListItem>>('search/person', {
    params: { query, page, include_adult: false },
    signal,
  })
}

/* ------------------------------------------------------------------ discover */

export function discover(
  mediaType: TitleMediaType,
  params: DiscoverParams = {},
  signal?: AbortSignal,
) {
  return tmdbFetch<Paginated<MovieListItem & TvListItem>>(`discover/${mediaType}`, {
    params: {
      include_adult: false,
      sort_by: 'popularity.desc',
      ...params,
    } as Record<string, string | number | boolean | undefined>,
    signal,
  })
}

/* -------------------------------------------------------- genres & keywords */

export async function getGenres(mediaType: TitleMediaType, signal?: AbortSignal) {
  const data = await tmdbFetch<{ genres: Genre[] }>(`genre/${mediaType}/list`, { signal })
  return data.genres
}

export function getKeyword(id: number, signal?: AbortSignal) {
  return tmdbFetch<Keyword>(`keyword/${id}`, { signal })
}

/* -------------------------------------------------------------------- videos */

export function getVideos(mediaType: TitleMediaType, id: number, signal?: AbortSignal) {
  return tmdbFetch<VideoResponse>(`${mediaType}/${id}/videos`, { signal })
}

/* ------------------------------------------------------------------- credits */

export function getCredits(mediaType: TitleMediaType, id: number, signal?: AbortSignal) {
  return tmdbFetch<Credits>(`${mediaType}/${id}/credits`, { signal })
}

export function getContentRatings(id: number, signal?: AbortSignal) {
  return tmdbFetch<ContentRatingsResponse>(`tv/${id}/content_ratings`, { signal })
}
