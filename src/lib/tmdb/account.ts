import { tmdbFetch } from './client'
import type { MovieListItem, Paginated, TitleMediaType, TvListItem } from './types'

/**
 * TMDB user-account endpoints (v3 "session" auth).
 *
 * Flow: create a request token → send the user to themoviedb.org to approve it
 * → exchange the approved token for a session id. The session id then acts on
 * the user's TMDB account; the app's read token still authenticates the app.
 */

export interface TmdbAccount {
  id: number
  username: string
  name: string
  include_adult: boolean
  iso_3166_1: string
  avatar: {
    gravatar?: { hash: string | null }
    tmdb?: { avatar_path: string | null }
  }
}

interface RequestTokenResponse {
  success: boolean
  expires_at: string
  request_token: string
}

interface SessionResponse {
  success: boolean
  session_id: string
}

interface StatusResponse {
  success: boolean
  status_code: number
  status_message: string
}

export async function createRequestToken(): Promise<string> {
  const res = await tmdbFetch<RequestTokenResponse>('authentication/token/new')
  return res.request_token
}

/** Where TMDB sends the user to approve the token; it redirects back to `redirectTo`. */
export function tmdbApprovalUrl(requestToken: string, redirectTo: string): string {
  return `https://www.themoviedb.org/authenticate/${encodeURIComponent(requestToken)}?redirect_to=${encodeURIComponent(redirectTo)}`
}

export async function createSession(requestToken: string): Promise<string> {
  const res = await tmdbFetch<SessionResponse>('authentication/session/new', {
    method: 'POST',
    body: { request_token: requestToken },
  })
  return res.session_id
}

export function deleteSession(sessionId: string): Promise<StatusResponse> {
  return tmdbFetch<StatusResponse>('authentication/session', {
    method: 'DELETE',
    body: { session_id: sessionId },
  })
}

export function getAccount(sessionId: string): Promise<TmdbAccount> {
  return tmdbFetch<TmdbAccount>('account', { params: { session_id: sessionId } })
}

export type AccountList = 'favorite' | 'watchlist'

/** Adds or removes a title from the user's TMDB favorites or watchlist. */
export function setAccountListState(
  accountId: number,
  sessionId: string,
  list: AccountList,
  mediaType: TitleMediaType,
  mediaId: number,
  present: boolean,
): Promise<StatusResponse> {
  return tmdbFetch<StatusResponse>(`account/${accountId}/${list}`, {
    method: 'POST',
    params: { session_id: sessionId },
    body: { media_type: mediaType, media_id: mediaId, [list]: present },
  })
}

type AccountListItem<M extends TitleMediaType> = M extends 'movie' ? MovieListItem : TvListItem

/** Every page of one of the user's TMDB lists. Capped to keep a huge list from stalling sign-in. */
export async function getAllAccountListItems<M extends TitleMediaType>(
  accountId: number,
  sessionId: string,
  list: AccountList,
  mediaType: M,
  maxPages = 25,
): Promise<Array<AccountListItem<M>>> {
  const path = `account/${accountId}/${list}/${mediaType === 'movie' ? 'movies' : 'tv'}`
  const items: Array<AccountListItem<M>> = []

  for (let page = 1; page <= maxPages; page++) {
    const res = await tmdbFetch<Paginated<AccountListItem<M>>>(path, {
      params: { session_id: sessionId, page, sort_by: 'created_at.desc' },
    })
    items.push(...res.results)
    if (page >= res.total_pages) break
  }

  return items
}
