import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TmdbLinkedAccount {
  id: number
  username: string
  name: string
  avatarPath: string | null
  gravatarHash: string | null
}

interface TmdbLinkState {
  sessionId: string | null
  account: TmdbLinkedAccount | null
  /** Firebase uid the link belongs to — dropped if a different user signs in. */
  ownerUid: string | null
  linkedAt: number | null
  lastSyncAt: number | null
  syncing: boolean
  /** Last sync problem worth showing on the account page. */
  syncError: string | null
  setLink: (link: { sessionId: string; account: TmdbLinkedAccount; ownerUid: string }) => void
  setSyncState: (state: { syncing?: boolean; syncError?: string | null; lastSyncAt?: number }) => void
  clearLink: () => void
}

/**
 * Persisted TMDB session.
 *
 * The session id acts on the user's TMDB account, so it is a credential: it
 * lives only in this browser's storage and is revoked with TMDB on unlink or
 * sign-out. It is deliberately not copied to Firestore.
 */
export const useTmdbStore = create<TmdbLinkState>()(
  persist(
    (set) => ({
      sessionId: null,
      account: null,
      ownerUid: null,
      linkedAt: null,
      lastSyncAt: null,
      syncing: false,
      syncError: null,
      setLink: ({ sessionId, account, ownerUid }) =>
        set({ sessionId, account, ownerUid, linkedAt: Date.now(), syncError: null }),
      setSyncState: (state) => set(state),
      clearLink: () =>
        set({
          sessionId: null,
          account: null,
          ownerUid: null,
          linkedAt: null,
          lastSyncAt: null,
          syncing: false,
          syncError: null,
        }),
    }),
    {
      name: 'tmdb-link',
      version: 1,
      partialize: ({ sessionId, account, ownerUid, linkedAt, lastSyncAt }) => ({
        sessionId,
        account,
        ownerUid,
        linkedAt,
        lastSyncAt,
      }),
    },
  ),
)

export const useTmdbAccount = () => useTmdbStore((s) => s.account)
