import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TitleMediaType } from '@/lib/tmdb/types'
import { setUserProperties, trackEvent } from '@/lib/analytics'

/** Minimal snapshot stored locally so the library renders without a refetch. */
export interface LibraryEntry {
  id: number
  mediaType: TitleMediaType
  title: string
  posterPath: string | null
  releaseDate: string | null
  voteAverage: number
  /** Epoch ms; used to sort the library newest-first. */
  addedAt: number
}

export type LibraryList = 'favorites' | 'watchlist'

/**
 * Composite key — a movie and a TV show can share the same numeric id, so
 * keying by id alone would collide. The old codebase had this exact bug in its
 * routing (`/overeview/:ids` with no media type).
 */
export type LibraryKey = `${TitleMediaType}:${number}`

export function libraryKey(mediaType: TitleMediaType, id: number): LibraryKey {
  return `${mediaType}:${id}`
}

export type LibraryMap = Record<LibraryKey, LibraryEntry>

/**
 * Where a change came from. Sync layers use it to avoid echoing a change back
 * to the system it arrived from:
 * - `user`  — a click in this tab; goes to the cloud and to TMDB
 * - `tmdb`  — imported from a linked TMDB account; goes to the cloud only
 */
export type LibraryChangeOrigin = 'user' | 'tmdb'

export type LibraryChange =
  | { type: 'add'; list: LibraryList; entry: LibraryEntry; origin: LibraryChangeOrigin }
  | { type: 'remove'; list: LibraryList; entry: LibraryEntry; origin: LibraryChangeOrigin }

type LibraryListener = (change: LibraryChange) => void
const listeners = new Set<LibraryListener>()

/** Subscribes to user/import-driven library changes. Returns an unsubscribe. */
export function onLibraryChange(listener: LibraryListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit(change: LibraryChange): void {
  for (const listener of listeners) listener(change)
}

interface LibraryState {
  favorites: LibraryMap
  watchlist: LibraryMap
  toggle: (list: LibraryList, entry: Omit<LibraryEntry, 'addedAt'>) => void
  remove: (list: LibraryList, mediaType: TitleMediaType, id: number) => void
  clear: (list: LibraryList) => void
  /** Adds entries that aren't already present (used by imports). Emits `add`. */
  mergeEntries: (list: LibraryList, entries: LibraryEntry[], origin: LibraryChangeOrigin) => void
  /** Replaces a list wholesale with server state. Emits nothing. */
  replaceList: (list: LibraryList, map: LibraryMap) => void
  /** Empties both lists without emitting — used on sign-out. */
  reset: () => void
}

/** Keeps the library-size user properties in sync after every mutation. */
function syncLibraryUserProperties(state: Pick<LibraryState, LibraryList>): void {
  setUserProperties({
    favorites_count: String(Object.keys(state.favorites).length),
    watchlist_count: String(Object.keys(state.watchlist).length),
  })
}

function without(map: LibraryMap, key: LibraryKey): LibraryMap {
  // Rebuild without the key rather than mutating in place.
  const { [key]: _removed, ...rest } = map
  return rest
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: {},
      watchlist: {},

      toggle: (list, partial) => {
        const key = libraryKey(partial.mediaType, partial.id)
        const existing = get()[list][key]
        const entry: LibraryEntry = existing ?? { ...partial, addedAt: Date.now() }

        trackEvent(existing ? 'library_remove' : 'library_add', {
          list,
          media_type: entry.mediaType,
          item_id: entry.id,
          item_name: entry.title,
        })

        set((state) => ({
          [list]: existing ? without(state[list], key) : { ...state[list], [key]: entry },
        }) as Pick<LibraryState, LibraryList>)

        emit({ type: existing ? 'remove' : 'add', list, entry, origin: 'user' })
        syncLibraryUserProperties(get())
      },

      remove: (list, mediaType, id) => {
        const key = libraryKey(mediaType, id)
        const existing = get()[list][key]
        if (!existing) return

        trackEvent('library_remove', {
          list,
          media_type: mediaType,
          item_id: id,
          item_name: existing.title,
        })

        set((state) => ({ [list]: without(state[list], key) }) as Pick<LibraryState, LibraryList>)
        emit({ type: 'remove', list, entry: existing, origin: 'user' })
        syncLibraryUserProperties(get())
      },

      clear: (list) => {
        const entries = Object.values(get()[list])
        trackEvent('library_clear', { list, item_count: entries.length })
        set({ [list]: {} } as Pick<LibraryState, LibraryList>)
        for (const entry of entries) emit({ type: 'remove', list, entry, origin: 'user' })
        syncLibraryUserProperties(get())
      },

      mergeEntries: (list, entries, origin) => {
        const current = get()[list]
        const added = entries.filter((entry) => !current[libraryKey(entry.mediaType, entry.id)])
        if (added.length === 0) return

        const next = { ...current }
        for (const entry of added) next[libraryKey(entry.mediaType, entry.id)] = entry
        set({ [list]: next } as Pick<LibraryState, LibraryList>)

        for (const entry of added) emit({ type: 'add', list, entry, origin })
        syncLibraryUserProperties(get())
      },

      replaceList: (list, map) => {
        set({ [list]: map } as Pick<LibraryState, LibraryList>)
        syncLibraryUserProperties(get())
      },

      reset: () => {
        set({ favorites: {}, watchlist: {} })
        syncLibraryUserProperties(get())
      },
    }),
    {
      name: 'library-storage',
      version: 1,
      // Only data is persisted; actions are recreated on load.
      partialize: (state) => ({ favorites: state.favorites, watchlist: state.watchlist }),
    },
  ),
)

/**
 * Membership check for a single title.
 *
 * Returns a primitive boolean so the component re-renders only when *this*
 * title's membership changes, not on every library mutation.
 */
export function useIsInList(
  list: LibraryList,
  mediaType: TitleMediaType,
  id: number,
): boolean {
  return useLibraryStore((state) => Boolean(state[list][libraryKey(mediaType, id)]))
}

/**
 * Store actions are defined once and never change identity, so selecting them
 * individually keeps referential stability for memoized children.
 */
export const useToggleLibrary = () => useLibraryStore((state) => state.toggle)
export const useRemoveFromLibrary = () => useLibraryStore((state) => state.remove)
export const useClearLibrary = () => useLibraryStore((state) => state.clear)

/** Sorted, array-shaped view of a list for rendering. */
export function useLibraryEntries(list: LibraryList): LibraryEntry[] {
  const map = useLibraryStore((state) => state[list])
  // Sorting in a memo keeps the array identity stable between unrelated renders.
  return useMemo(
    () => Object.values(map).sort((a, b) => b.addedAt - a.addedAt),
    [map],
  )
}

export function useLibraryCounts(): { favorites: number; watchlist: number } {
  const favorites = useLibraryStore((state) => Object.keys(state.favorites).length)
  const watchlist = useLibraryStore((state) => Object.keys(state.watchlist).length)
  return { favorites, watchlist }
}
