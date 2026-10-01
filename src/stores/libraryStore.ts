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

interface LibraryState {
  favorites: Record<LibraryKey, LibraryEntry>
  watchlist: Record<LibraryKey, LibraryEntry>
  toggle: (list: LibraryList, entry: Omit<LibraryEntry, 'addedAt'>) => void
  remove: (list: LibraryList, mediaType: TitleMediaType, id: number) => void
  clear: (list: LibraryList) => void
}

/** Keeps the library-size user properties in sync after every mutation. */
function syncLibraryUserProperties(state: Pick<LibraryState, LibraryList>): void {
  setUserProperties({
    favorites_count: String(Object.keys(state.favorites).length),
    watchlist_count: String(Object.keys(state.watchlist).length),
  })
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: {},
      watchlist: {},

      toggle: (list, entry) => {
        const present = Boolean(get()[list][libraryKey(entry.mediaType, entry.id)])
        trackEvent(present ? 'library_remove' : 'library_add', {
          list,
          media_type: entry.mediaType,
          item_id: entry.id,
          item_name: entry.title,
        })

        set((state) => {
          const key = libraryKey(entry.mediaType, entry.id)
          const current = state[list]

          if (current[key]) {
            // Rebuild without the key rather than mutating in place.
            const { [key]: _removed, ...rest } = current
            return { [list]: rest } as Pick<LibraryState, LibraryList>
          }

          return {
            [list]: { ...current, [key]: { ...entry, addedAt: Date.now() } },
          } as Pick<LibraryState, LibraryList>
        })
        syncLibraryUserProperties(get())
      },

      remove: (list, mediaType, id) => {
        const key = libraryKey(mediaType, id)
        const existing = get()[list][key]
        if (existing) {
          trackEvent('library_remove', {
            list,
            media_type: mediaType,
            item_id: id,
            item_name: existing.title,
          })
        }

        set((state) => {
          const { [key]: _removed, ...rest } = state[list]
          return { [list]: rest } as Pick<LibraryState, LibraryList>
        })
        syncLibraryUserProperties(get())
      },

      clear: (list) => {
        trackEvent('library_clear', { list, item_count: Object.keys(get()[list]).length })
        set({ [list]: {} } as Pick<LibraryState, LibraryList>)
        syncLibraryUserProperties(get())
      },
    }),
    {
      name: 'library-storage',
      version: 1,
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
