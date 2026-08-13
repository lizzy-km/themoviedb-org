import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import * as api from '@/lib/tmdb/endpoints'
import type { MovieListCategory, TrendingWindow, TvListCategory } from '@/lib/tmdb/endpoints'
import { queryKeys } from './keys'
import type {
  DiscoverParams,
  MovieListItem,
  Paginated,
  PersonListItem,
  TitleMediaType,
  TvListItem,
} from '@/lib/tmdb/types'

/**
 * TMDB caps pagination at 500 pages regardless of `total_pages`; requesting
 * beyond it returns an error, so infinite lists stop there.
 */
const MAX_TMDB_PAGE = 500

function nextPageParam<T>(lastPage: Paginated<T>): number | undefined {
  if (lastPage.page >= Math.min(lastPage.total_pages, MAX_TMDB_PAGE)) return undefined
  return lastPage.page + 1
}

/* ------------------------------------------------------------------ trending */

export function useTrending(mediaType: 'all' | TitleMediaType, window: TrendingWindow) {
  return useQuery({
    queryKey: queryKeys.trending.list(mediaType, window),
    queryFn: ({ signal }) => api.getTrending(mediaType, window, { signal }),
    select: (data) => data.results,
  })
}

/* -------------------------------------------------------------- movie lists */

export function useMovieList(category: MovieListCategory) {
  return useQuery({
    queryKey: queryKeys.movies.list(category),
    queryFn: ({ signal }) => api.getMovieList(category, { signal }),
    select: (data) => data.results,
  })
}

export function useInfiniteMovieList(category: MovieListCategory) {
  return useInfiniteQuery({
    queryKey: queryKeys.movies.list(category),
    queryFn: ({ pageParam, signal }) => api.getMovieList(category, { page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
  })
}

/* ------------------------------------------------------------------ tv lists */

export function useTvList(category: TvListCategory) {
  return useQuery({
    queryKey: queryKeys.tv.list(category),
    queryFn: ({ signal }) => api.getTvList(category, { signal }),
    select: (data) => data.results,
  })
}

export function useInfiniteTvList(category: TvListCategory) {
  return useInfiniteQuery({
    queryKey: queryKeys.tv.list(category),
    queryFn: ({ pageParam, signal }) => api.getTvList(category, { page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
  })
}

/* -------------------------------------------------------------------- detail */

export function useMovieDetail(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.movies.detail(id ?? 0),
    queryFn: ({ signal }) => api.getMovieDetail(id as number, signal),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
  })
}

export function useTvDetail(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.tv.detail(id ?? 0),
    queryFn: ({ signal }) => api.getTvDetail(id as number, signal),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
  })
}

export function useTvSeason(tvId: number | undefined, seasonNumber: number | undefined) {
  return useQuery({
    queryKey: queryKeys.tv.season(tvId ?? 0, seasonNumber ?? 0),
    queryFn: ({ signal }) => api.getTvSeason(tvId as number, seasonNumber as number, signal),
    enabled: typeof tvId === 'number' && typeof seasonNumber === 'number' && tvId > 0,
  })
}

/* -------------------------------------------------------------------- people */

export function useInfinitePopularPeople() {
  return useInfiniteQuery({
    queryKey: queryKeys.people.popular(),
    queryFn: ({ pageParam, signal }) => api.getPopularPeople({ page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
  })
}

export function usePersonDetail(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.people.detail(id ?? 0),
    queryFn: ({ signal }) => api.getPersonDetail(id as number, signal),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
  })
}

/* -------------------------------------------------------------------- search */

/**
 * Multi-search for the header suggestion dropdown.
 *
 * `query` should already be debounced by the caller. Empty queries are disabled
 * rather than fired — the old code searched on every keystroke including the
 * empty string, which returned a 422 from TMDB.
 */
export function useSearchSuggestions(query: string) {
  const trimmed = query.trim()
  return useQuery({
    queryKey: queryKeys.search.multi(trimmed),
    queryFn: ({ signal }) => api.searchMulti(trimmed, { signal }),
    enabled: trimmed.length >= 2,
    select: (data) => data.results.slice(0, 8),
    // Suggestions for a given term never change within a session.
    staleTime: 10 * 60 * 1000,
  })
}

export type SearchScope = 'movie' | 'tv' | 'person'

/**
 * Results for a scoped search. Each scope returns a different item shape, so
 * the page type is the union — callers narrow it via the `scope` they passed.
 */
export type SearchResultItem = MovieListItem | TvListItem | PersonListItem

export function useInfiniteSearch(scope: SearchScope, query: string) {
  const trimmed = query.trim()

  return useInfiniteQuery<Paginated<SearchResultItem>>({
    queryKey: queryKeys.search.scoped(scope, trimmed),
    queryFn: ({ pageParam, signal }): Promise<Paginated<SearchResultItem>> => {
      const page = pageParam as number
      if (scope === 'movie') return api.searchMovies(trimmed, { page, signal })
      if (scope === 'tv') return api.searchTv(trimmed, { page, signal })
      return api.searchPeople(trimmed, { page, signal })
    },
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
    enabled: trimmed.length > 0,
  })
}

/* ------------------------------------------------------------------ discover */

export function useInfiniteDiscover(
  mediaType: TitleMediaType,
  params: DiscoverParams,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.discover.list(mediaType, params),
    queryFn: ({ pageParam, signal }) =>
      api.discover(mediaType, { ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
    enabled,
  })
}

/* -------------------------------------------------------- genres & keywords */

export function useGenres(mediaType: TitleMediaType) {
  return useQuery({
    queryKey: queryKeys.genres.list(mediaType),
    queryFn: ({ signal }) => api.getGenres(mediaType, signal),
    // The genre list is essentially immutable — cache it for the whole session.
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export function useKeyword(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.keywords.detail(id ?? 0),
    queryFn: ({ signal }) => api.getKeyword(id as number, signal),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: Number.POSITIVE_INFINITY,
  })
}

/* -------------------------------------------------------------------- videos */

export function useVideos(mediaType: TitleMediaType, id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.videos.list(mediaType, id ?? 0),
    queryFn: ({ signal }) => api.getVideos(mediaType, id as number, signal),
    enabled: typeof id === 'number' && id > 0,
    select: (data) => data.results,
  })
}
