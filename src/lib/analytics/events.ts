import type { TitleMediaType } from '@/lib/tmdb/types'
import type { LibraryList } from '@/stores/libraryStore'
import type { ThemeMode } from '@/stores/themeStore'

/**
 * Event catalog — the single source of truth for what the app sends.
 *
 * Names follow GA4 conventions (snake_case, ≤40 chars) and reuse GA4
 * recommended events (`page_view`, `search`, `view_search_results`,
 * `select_content`, `exception`) where one fits, so they light up the built-in
 * reports. Any custom parameter you want to report on must also be registered
 * as a custom dimension/metric in GA4 → Admin → Custom definitions.
 */
export interface AnalyticsEvents {
  page_view: {
    page_path: string
    page_location: string
    page_title: string
    /** Path with ids collapsed, e.g. `/movie/:id` — for grouping detail pages. */
    page_template: string
  }

  /** Full search submitted from a search box. */
  search: { search_term: string; source: SearchSource }
  /** Results page rendered for a query + scope. */
  view_search_results: { search_term: string; search_scope: string; result_count: number }
  /** Suggestion picked from the search dropdown. */
  select_content: {
    content_type: 'search_suggestion'
    item_id: string
    media_type: string
    search_term: string
    position: number
    source: SearchSource
  }

  view_title: { media_type: TitleMediaType; item_id: number; item_name: string }
  view_person: { item_id: number; item_name: string }

  library_add: LibraryEventParams
  library_remove: LibraryEventParams
  library_clear: { list: LibraryList; item_count: number }

  trailer_play: { video_id: string; video_name: string; video_type: string; video_site: string }

  /** Category tabs on the Movies / TV browse pages. */
  browse_category: { media_type: TitleMediaType; category: string }
  discover_filter: {
    media_type: TitleMediaType
    filter: 'media_type' | 'sort' | 'genre' | 'clear'
    value: string
  }

  theme_change: { theme: ThemeMode }

  /** GA4 recommended auth events. */
  sign_up: { method: AuthMethod }
  login: { method: AuthMethod }
  logout: { method: 'manual' }
  account_delete: { method: 'manual' }
  password_reset_request: { method: 'password' }

  tmdb_link: { status: 'started' | 'success' | 'denied' | 'error' }
  tmdb_unlink: { method: 'manual' | 'sign_out' }
  tmdb_import: { favorites: number; watchlist: number }

  /** Render crash caught by an ErrorBoundary (GA4 recommended event). */
  exception: { description: string; fatal: boolean }
  /** A TMDB request that failed after all retries. */
  api_error: { endpoint: string; status: number; message: string }

  /** Core Web Vitals, one event per metric report. */
  web_vital: {
    metric_name: string
    metric_id: string
    metric_rating: string
    /** Rounded; CLS is multiplied by 1000 so it survives integer aggregation. */
    value: number
    metric_value: number
    metric_delta: number
    navigation_type: string
  }
}

export type AuthMethod = 'password' | 'google'

export type SearchSource = 'header' | 'header_mobile' | 'hero'

interface LibraryEventParams {
  list: LibraryList
  media_type: TitleMediaType
  item_id: number
  item_name: string
}

export type AnalyticsEventName = keyof AnalyticsEvents
export type AnalyticsEventParams<E extends AnalyticsEventName> = AnalyticsEvents[E]

/** User-scoped dimensions. Values are strings per GA4's requirements. */
export interface UserProperties {
  theme_preference?: ThemeMode
  favorites_count?: string
  watchlist_count?: string
  signed_in?: 'true' | 'false'
  tmdb_linked?: 'true' | 'false'
}
