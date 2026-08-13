/**
 * TMDB API response models.
 *
 * Fields TMDB may omit or null out are typed as nullable/optional on purpose —
 * the previous implementation assumed `poster_path` and `overview` always
 * existed, which crashed on titles that lack artwork.
 */

export type MediaType = 'movie' | 'tv' | 'person'

/** Media types that represent a watchable title (excludes `person`). */
export type TitleMediaType = 'movie' | 'tv'

export interface Paginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface Keyword {
  id: number
  name: string
}

export interface SpokenLanguage {
  iso_639_1: string
  name: string
  english_name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

/** Fields shared by movie and TV list items. */
interface MediaBase {
  id: number
  overview: string
  popularity: number
  vote_average: number
  vote_count: number
  backdrop_path: string | null
  poster_path: string | null
  genre_ids?: number[]
  adult?: boolean
  original_language?: string
}

export interface MovieListItem extends MediaBase {
  media_type?: 'movie'
  title: string
  original_title?: string
  release_date?: string
  video?: boolean
}

export interface TvListItem extends MediaBase {
  media_type?: 'tv'
  name: string
  original_name?: string
  first_air_date?: string
  origin_country?: string[]
}

export interface PersonListItem {
  id: number
  media_type?: 'person'
  name: string
  original_name?: string
  profile_path: string | null
  popularity: number
  adult?: boolean
  known_for_department?: string
  known_for?: Array<MovieListItem | TvListItem>
}

/**
 * A single entry from a `/trending/all` or `/search/multi` response, where the
 * shape is only knowable at runtime via `media_type`.
 */
export type MultiSearchItem =
  | (MovieListItem & { media_type: 'movie' })
  | (TvListItem & { media_type: 'tv' })
  | (PersonListItem & { media_type: 'person' })

/** Any watchable title in list form — what cards and carousels render. */
export type TitleListItem = MovieListItem | TvListItem

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface MovieDetail extends MovieListItem {
  belongs_to_collection: Collection | null
  budget: number
  revenue: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  runtime: number | null
  status: string
  tagline: string | null
}

export interface Creator {
  id: number
  name: string
  profile_path: string | null
  credit_id?: string
}

export interface Episode {
  id: number
  name: string
  overview: string
  air_date: string | null
  episode_number: number
  season_number: number
  runtime: number | null
  still_path: string | null
  vote_average: number
}

export interface Season {
  id: number
  name: string
  overview: string
  air_date: string | null
  episode_count: number
  season_number: number
  poster_path: string | null
  vote_average?: number
}

export interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface TvDetail extends TvListItem {
  created_by: Creator[]
  episode_run_time: number[]
  genres: Genre[]
  homepage: string | null
  in_production: boolean
  languages: string[]
  last_air_date: string | null
  last_episode_to_air: Episode | null
  next_episode_to_air: Episode | null
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: Season[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
  type: string
}

export interface CastCredit {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  credit_id: string
  known_for_department?: string
}

export interface CrewCredit {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  credit_id: string
}

export interface Credits {
  id: number
  cast: CastCredit[]
  crew: CrewCredit[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: 'YouTube' | 'Vimeo' | string
  size: number
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | string
  official: boolean
  published_at: string
  iso_639_1?: string
}

export interface VideoResponse {
  id: number
  results: Video[]
}

export interface ImageEntry {
  file_path: string
  width: number
  height: number
  aspect_ratio: number
  vote_average: number
  iso_639_1: string | null
}

export interface ImagesResponse {
  id: number
  backdrops: ImageEntry[]
  posters: ImageEntry[]
  logos: ImageEntry[]
  profiles?: ImageEntry[]
}

export interface AuthorDetails {
  name: string
  username: string
  avatar_path: string | null
  rating: number | null
}

export interface Review {
  id: string
  author: string
  author_details: AuthorDetails
  content: string
  created_at: string
  updated_at: string
  url: string
}

export interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string | null
  display_priority: number
}

export interface WatchProviderRegion {
  link: string
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface WatchProvidersResponse {
  id: number
  results: Record<string, WatchProviderRegion>
}

export interface ExternalIds {
  imdb_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  twitter_id: string | null
  wikidata_id?: string | null
}

export interface PersonDetail {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  gender: number
  homepage: string | null
  imdb_id: string | null
  known_for_department: string
  place_of_birth: string | null
  popularity: number
  profile_path: string | null
  also_known_as: string[]
}

export interface PersonCombinedCredit {
  id: number
  media_type: TitleMediaType
  title?: string
  name?: string
  character?: string
  job?: string
  department?: string
  credit_id: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  overview: string
  popularity: number
}

export interface PersonCombinedCredits {
  id: number
  cast: PersonCombinedCredit[]
  crew: PersonCombinedCredit[]
}

export interface CertificationRelease {
  certification: string
  release_date: string
  type: number
}

export interface ReleaseDatesResponse {
  id: number
  results: Array<{
    iso_3166_1: string
    release_dates: CertificationRelease[]
  }>
}

export interface ContentRatingsResponse {
  id: number
  results: Array<{
    iso_3166_1: string
    rating: string
  }>
}

/**
 * Detail responses use TMDB's `append_to_response` so one request returns the
 * title plus its credits, videos, images, keywords, recommendations and
 * reviews — replacing the 6+ waterfalled requests the old code made per page.
 */
export type MovieDetailBundle = MovieDetail & {
  credits: Credits
  videos: VideoResponse
  images: ImagesResponse
  keywords: { keywords: Keyword[] }
  recommendations: Paginated<MovieListItem>
  similar: Paginated<MovieListItem>
  reviews: Paginated<Review>
  release_dates: ReleaseDatesResponse
  external_ids: ExternalIds
  'watch/providers': WatchProvidersResponse
}

export type TvDetailBundle = TvDetail & {
  credits: Credits
  aggregate_credits: Credits
  videos: VideoResponse
  images: ImagesResponse
  keywords: { results: Keyword[] }
  recommendations: Paginated<TvListItem>
  similar: Paginated<TvListItem>
  reviews: Paginated<Review>
  content_ratings: ContentRatingsResponse
  external_ids: ExternalIds
  'watch/providers': WatchProvidersResponse
}

export type PersonDetailBundle = PersonDetail & {
  combined_credits: PersonCombinedCredits
  images: { profiles: ImageEntry[] }
  external_ids: ExternalIds
}

/** Sort options accepted by the `/discover` endpoints. */
export type DiscoverSort =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'first_air_date.desc'
  | 'first_air_date.asc'
  | 'revenue.desc'
  | 'title.asc'
  | 'title.desc'

export interface DiscoverParams {
  page?: number
  sort_by?: DiscoverSort
  with_genres?: string
  with_keywords?: string
  with_original_language?: string
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  'vote_count.gte'?: number
  'primary_release_date.gte'?: string
  'primary_release_date.lte'?: string
  'first_air_date.gte'?: string
  'first_air_date.lte'?: string
  'with_runtime.gte'?: number
  'with_runtime.lte'?: number
  include_adult?: boolean
}

/** Shape of a TMDB error body, returned alongside a non-2xx status. */
export interface TmdbErrorBody {
  status_message?: string
  status_code?: number
  success?: boolean
}
