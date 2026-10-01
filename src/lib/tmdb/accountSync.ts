import {
  createRequestToken,
  createSession,
  deleteSession,
  getAccount,
  getAllAccountListItems,
  setAccountListState,
  tmdbApprovalUrl,
} from './account'
import type { AccountList } from './account'
import { TmdbError } from './client'
import type { MovieListItem, TvListItem } from './types'
import { trackEvent, setUserProperties } from '@/lib/analytics'
import { libraryKey, onLibraryChange, useLibraryStore } from '@/stores/libraryStore'
import type { LibraryEntry, LibraryList } from '@/stores/libraryStore'
import { useTmdbStore } from '@/stores/tmdbStore'

/**
 * Links a TMDB account to the signed-in user and keeps the library in step
 * with it: on link, TMDB's favorites/watchlist are imported and local-only
 * titles are pushed up; afterwards every add/remove made in this tab is
 * mirrored to TMDB.
 */

export const TMDB_CALLBACK_PATH = '/auth/tmdb/callback'
const PENDING_KEY = 'tmdb-link-pending'

const TMDB_LIST: Record<LibraryList, AccountList> = {
  favorites: 'favorite',
  watchlist: 'watchlist',
}

// --- Linking ------------------------------------------------------------------

/** Step 1: get a request token and send the user to themoviedb.org to approve it. */
export async function beginTmdbLink(uid: string): Promise<void> {
  trackEvent('tmdb_link', { status: 'started' })
  const token = await createRequestToken()
  // Bind the token to this user so the callback can't attach it to someone else.
  sessionStorage.setItem(PENDING_KEY, JSON.stringify({ token, uid }))
  window.location.assign(tmdbApprovalUrl(token, `${window.location.origin}${TMDB_CALLBACK_PATH}`))
}

export type CompleteLinkResult =
  | { status: 'linked'; username: string }
  | { status: 'denied' }
  | { status: 'invalid'; message: string }

/**
 * Step 2 (on the callback page): exchange the approved token for a session.
 * The caller runs the first `syncWithTmdb({ pushLocal: true })` afterwards.
 */
export async function completeTmdbLink(
  uid: string,
  params: URLSearchParams,
): Promise<CompleteLinkResult> {
  const pendingRaw = sessionStorage.getItem(PENDING_KEY)
  sessionStorage.removeItem(PENDING_KEY)

  if (params.get('denied') === 'true' || params.get('approved') === 'false') {
    trackEvent('tmdb_link', { status: 'denied' })
    return { status: 'denied' }
  }

  const token = params.get('request_token')
  let pending: { token?: string; uid?: string } = {}
  try {
    pending = pendingRaw ? (JSON.parse(pendingRaw) as typeof pending) : {}
  } catch {
    /* Malformed — treated as missing below. */
  }

  if (!token || pending.token !== token || pending.uid !== uid) {
    trackEvent('tmdb_link', { status: 'error' })
    return {
      status: 'invalid',
      message: 'This link request expired or was started from another session. Please try again.',
    }
  }

  try {
    const sessionId = await createSession(token)
    const account = await getAccount(sessionId)
    useTmdbStore.getState().setLink({
      sessionId,
      ownerUid: uid,
      account: {
        id: account.id,
        username: account.username,
        name: account.name,
        avatarPath: account.avatar.tmdb?.avatar_path ?? null,
        gravatarHash: account.avatar.gravatar?.hash ?? null,
      },
    })
    trackEvent('tmdb_link', { status: 'success' })
    setUserProperties({ tmdb_linked: 'true' })
    return { status: 'linked', username: account.username }
  } catch (error) {
    trackEvent('tmdb_link', { status: 'error' })
    return {
      status: 'invalid',
      message: error instanceof Error ? error.message : 'Could not connect to TMDB.',
    }
  }
}

/** Revokes the TMDB session (best effort) and forgets it locally. */
export async function unlinkTmdb(reason: 'manual' | 'sign_out'): Promise<void> {
  const { sessionId } = useTmdbStore.getState()
  useTmdbStore.getState().clearLink()
  setUserProperties({ tmdb_linked: 'false' })
  if (!sessionId) return
  trackEvent('tmdb_unlink', { method: reason })
  try {
    await deleteSession(sessionId)
  } catch {
    /* Already revoked or offline — the local link is gone either way. */
  }
}

/** Drops a link that belongs to a different Firebase user than `uid`. */
export function enforceTmdbOwner(uid: string | null): void {
  const { ownerUid, sessionId } = useTmdbStore.getState()
  if (sessionId && ownerUid !== uid) void unlinkTmdb('sign_out')
}

// --- Syncing ------------------------------------------------------------------

function toEntry(item: MovieListItem | TvListItem, mediaType: 'movie' | 'tv', addedAt: number): LibraryEntry {
  const isMovie = mediaType === 'movie'
  return {
    id: item.id,
    mediaType,
    title: isMovie ? (item as MovieListItem).title : (item as TvListItem).name,
    posterPath: item.poster_path ?? null,
    releaseDate:
      (isMovie ? (item as MovieListItem).release_date : (item as TvListItem).first_air_date) || null,
    voteAverage: item.vote_average ?? 0,
    addedAt,
  }
}

/** Session revoked on themoviedb.org — stop using it. */
function handleAuthFailure(error: unknown): boolean {
  if (error instanceof TmdbError && error.status === 401) {
    useTmdbStore.getState().clearLink()
    useTmdbStore.getState().setSyncState({
      syncError: 'Your TMDB session expired or was revoked. Connect your account again.',
    })
    setUserProperties({ tmdb_linked: 'false' })
    return true
  }
  return false
}

/** Runs `tasks` with limited concurrency so a big push doesn't trip TMDB's rate limit. */
async function runLimited(tasks: Array<() => Promise<unknown>>, limit = 3): Promise<void> {
  let next = 0
  const worker = async () => {
    while (next < tasks.length) {
      const task = tasks[next++]
      await task?.()
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
}

/**
 * Two-way merge with TMDB: imports titles the account has, and (on first
 * link) pushes titles only this app has. Nothing is ever deleted by a sync.
 */
export async function syncWithTmdb({ pushLocal = false }: { pushLocal?: boolean } = {}): Promise<void> {
  const store = useTmdbStore.getState()
  const { sessionId, account } = store
  if (!sessionId || !account || store.syncing) return

  store.setSyncState({ syncing: true, syncError: null })
  try {
    const counts: Record<LibraryList, number> = { favorites: 0, watchlist: 0 }

    for (const list of ['favorites', 'watchlist'] as const) {
      const tmdbList = TMDB_LIST[list]
      const [movies, shows] = await Promise.all([
        getAllAccountListItems(account.id, sessionId, tmdbList, 'movie'),
        getAllAccountListItems(account.id, sessionId, tmdbList, 'tv'),
      ])

      // TMDB returns newest first; space timestamps so that order survives.
      const now = Date.now()
      const remote = [
        ...movies.map((item) => ({ item, mediaType: 'movie' as const })),
        ...shows.map((item) => ({ item, mediaType: 'tv' as const })),
      ].map(({ item, mediaType }, index) => toEntry(item, mediaType, now - index * 1000))
      counts[list] = remote.length

      useLibraryStore.getState().mergeEntries(list, remote, 'tmdb')

      if (pushLocal) {
        const remoteKeys = new Set(remote.map((e) => libraryKey(e.mediaType, e.id)))
        const localOnly = Object.values(useLibraryStore.getState()[list]).filter(
          (e) => !remoteKeys.has(libraryKey(e.mediaType, e.id)),
        )
        await runLimited(
          localOnly.map(
            (e) => () => setAccountListState(account.id, sessionId, tmdbList, e.mediaType, e.id, true),
          ),
        )
      }
    }

    trackEvent('tmdb_import', counts)
    useTmdbStore.getState().setSyncState({ syncing: false, lastSyncAt: Date.now() })
  } catch (error) {
    if (!handleAuthFailure(error)) {
      useTmdbStore.getState().setSyncState({
        syncError: error instanceof Error ? error.message : 'Sync with TMDB failed.',
      })
    }
    useTmdbStore.getState().setSyncState({ syncing: false })
  }
}

/**
 * Mirrors user-made library changes to TMDB while an account is linked.
 * Changes that came *from* TMDB (imports) are skipped to avoid echoing.
 * Returns an unsubscribe.
 */
export function startTmdbMirror(): () => void {
  return onLibraryChange((change) => {
    if (change.origin !== 'user') return
    const { sessionId, account } = useTmdbStore.getState()
    if (!sessionId || !account) return

    const { entry, list, type } = change
    setAccountListState(
      account.id,
      sessionId,
      TMDB_LIST[list],
      entry.mediaType,
      entry.id,
      type === 'add',
    ).catch((error) => {
      if (!handleAuthFailure(error)) {
        useTmdbStore.getState().setSyncState({
          syncError: `Couldn’t ${type === 'add' ? 'add' : 'remove'} “${entry.title}” on TMDB. Try again from the title page.`,
        })
      }
    })
  })
}
