import { create } from 'zustand'

/** Serializable snapshot of the Firebase user — components never touch the SDK object. */
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  /** e.g. `['password']`, `['google.com']`, or both once linked. */
  providers: string[]
  createdAt: string | null
}

/**
 * - `loading`     — Firebase hasn't reported the persisted session yet
 * - `unavailable` — Firebase isn't configured; account features are hidden
 */
export type AuthStatus = 'loading' | 'signedIn' | 'signedOut' | 'unavailable'

interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  setSignedIn: (user: AuthUser) => void
  setSignedOut: () => void
  setUnavailable: () => void
}

/**
 * Not persisted: Firebase keeps the session in IndexedDB itself, and caching a
 * copy here could show a signed-in UI for a session that has since expired.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  status: 'loading',
  user: null,
  setSignedIn: (user) => set({ status: 'signedIn', user }),
  setSignedOut: () => set({ status: 'signedOut', user: null }),
  setUnavailable: () => set({ status: 'unavailable', user: null }),
}))

export const useAuthStatus = () => useAuthStore((s) => s.status)
export const useAuthUser = () => useAuthStore((s) => s.user)
