import type { DiscoverParams, TitleMediaType } from '@/lib/tmdb/types'
import type { MovieListCategory, TrendingWindow, TvListCategory } from '@/lib/tmdb/endpoints'

/**
 * Centralised, hierarchical query keys.
 *
 * Keys are arrays (React Query v5 requires this — the old code passed plain
 * strings as `mutationKey`, which silently disabled any key-based behaviour).
 * The hierarchy lets callers invalidate a whole subtree, e.g.
 * `queryClient.invalidateQueries({ queryKey: queryKeys.movies.all })`.
 */
export const queryKeys = {
  trending: {
    all: ['trending'] as const,
    list: (mediaType: 'all' | TitleMediaType | 'person', window: TrendingWindow) =>
      [...queryKeys.trending.all, mediaType, window] as const,
  },
  movies: {
    all: ['movies'] as const,
    list: (category: MovieListCategory) => [...queryKeys.movies.all, 'list', category] as const,
    detail: (id: number) => [...queryKeys.movies.all, 'detail', id] as const,
  },
  tv: {
    all: ['tv'] as const,
    list: (category: TvListCategory) => [...queryKeys.tv.all, 'list', category] as const,
    detail: (id: number) => [...queryKeys.tv.all, 'detail', id] as const,
    season: (tvId: number, seasonNumber: number) =>
      [...queryKeys.tv.all, 'detail', tvId, 'season', seasonNumber] as const,
  },
  people: {
    all: ['people'] as const,
    popular: () => [...queryKeys.people.all, 'popular'] as const,
    detail: (id: number) => [...queryKeys.people.all, 'detail', id] as const,
  },
  search: {
    all: ['search'] as const,
    multi: (query: string) => [...queryKeys.search.all, 'multi', query] as const,
    scoped: (scope: 'movie' | 'tv' | 'person', query: string) =>
      [...queryKeys.search.all, scope, query] as const,
  },
  discover: {
    all: ['discover'] as const,
    list: (mediaType: TitleMediaType, params: DiscoverParams) =>
      [...queryKeys.discover.all, mediaType, params] as const,
  },
  genres: {
    all: ['genres'] as const,
    list: (mediaType: TitleMediaType) => [...queryKeys.genres.all, mediaType] as const,
  },
  keywords: {
    all: ['keywords'] as const,
    detail: (id: number) => [...queryKeys.keywords.all, id] as const,
  },
  videos: {
    all: ['videos'] as const,
    list: (mediaType: TitleMediaType, id: number) =>
      [...queryKeys.videos.all, mediaType, id] as const,
  },
} as const
