import { setAnalyticsUserId, setUserProperties, trackEvent } from '@/lib/analytics'
import type { AuthMethod } from '@/lib/analytics'
import * as firebaseAuth from '@/lib/firebase/auth'
import {
  deleteCloudLibrary,
  flushLibrarySync,
  releaseLocalLibrary,
  startLibrarySync,
} from '@/lib/firebase/librarySync'
import {
  completeTmdbLink,
  enforceTmdbOwner,
  startTmdbMirror,
  syncWithTmdb,
  unlinkTmdb,
} from '@/lib/tmdb/accountSync'
import type { CompleteLinkResult } from '@/lib/tmdb/accountSync'
import { useAuthStore } from '@/stores/authStore'
import { useTmdbStore } from '@/stores/tmdbStore'

/**
 * Session orchestration — the one place that reacts to sign-in state.
 *
 * On sign-in: start the Firestore library sync, drop a TMDB link that
 * belongs to someone else, and refresh from TMDB if linked.
 * On sign-out (explicit or expired): stop syncing, clear the account's local
 * library copy and revoke the TMDB session, so the next person using this
 * browser sees nothing of the previous account.
 */

/** Re-import from TMDB at most this often on app start. */
const TMDB_RESYNC_MS = 15 * 60 * 1000

let started = false

/**
 * Resolves once the Firestore listener for the current user is attached.
 * TMDB imports wait on it: an import landing before the first server snapshot
 * would be overwritten locally by that snapshot.
 */
let librarySyncReady: Promise<void> = Promise.resolve()

export function initAuth(): void {
  if (started) return
  started = true

  startTmdbMirror()

  void firebaseAuth.watchAuthState(
    (user) => {
      const store = useAuthStore.getState()
      const previousUid = store.user?.uid ?? null

      if (user) {
        store.setSignedIn(user)
        // Token refreshes re-fire this callback; only (re)start on a real change.
        if (user.uid === previousUid) return

        setAnalyticsUserId(user.uid)
        setUserProperties({ signed_in: 'true' })
        enforceTmdbOwner(user.uid)
        librarySyncReady = startLibrarySync(user.uid).catch((error) =>
          console.error('[auth] library sync failed to start', error),
        )

        const { sessionId, lastSyncAt } = useTmdbStore.getState()
        if (sessionId && Date.now() - (lastSyncAt ?? 0) > TMDB_RESYNC_MS) {
          void librarySyncReady.then(() => syncWithTmdb())
        }
      } else {
        store.setSignedOut()
        setAnalyticsUserId(null)
        setUserProperties({ signed_in: 'false' })
        releaseLocalLibrary()
        enforceTmdbOwner(null)
      }
    },
    () => useAuthStore.getState().setUnavailable(),
  )
}

// --- Actions used by the auth pages ---------------------------------------------

export async function signUp(name: string, email: string, password: string): Promise<void> {
  await firebaseAuth.signUpWithEmail(name, email, password)
  trackEvent('sign_up', { method: 'password' })
}

export async function logIn(email: string, password: string, remember: boolean): Promise<void> {
  await firebaseAuth.signInWithEmail(email, password, remember)
  trackEvent('login', { method: 'password' })
}

/** Google sign-in creates the account on first use, so it can be a sign-up too. */
export async function continueWithGoogle(intent: 'login' | 'sign_up'): Promise<void> {
  const result = await firebaseAuth.signInWithGoogle()
  if (result === 'done') {
    const method: AuthMethod = 'google'
    trackEvent(intent, { method })
  }
}

export async function logOut(): Promise<void> {
  trackEvent('logout', { method: 'manual' })
  await flushLibrarySync()
  await unlinkTmdb('sign_out')
  await firebaseAuth.signOut()
}

export async function deleteMyAccount(password: string | null): Promise<void> {
  await firebaseAuth.deleteAccount(password, async (uid) => {
    await unlinkTmdb('manual')
    await deleteCloudLibrary(uid)
  })
  trackEvent('account_delete', { method: 'manual' })
}

/** Finishes the TMDB approval redirect, then does the first two-way merge. */
export async function linkTmdbFromCallback(
  uid: string,
  params: URLSearchParams,
): Promise<CompleteLinkResult> {
  const result = await completeTmdbLink(uid, params)
  if (result.status === 'linked') {
    void librarySyncReady.then(() => syncWithTmdb({ pushLocal: true }))
  }
  return result
}

export async function syncTmdbNow(): Promise<void> {
  await librarySyncReady
  await syncWithTmdb({ pushLocal: true })
}

export async function requestPasswordReset(email: string): Promise<void> {
  await firebaseAuth.sendPasswordReset(email)
  trackEvent('password_reset_request', { method: 'password' })
}

export async function refreshUser(): Promise<void> {
  const user = await firebaseAuth.reloadUser()
  if (user) useAuthStore.getState().setSignedIn(user)
}

export { beginTmdbLink, unlinkTmdb } from '@/lib/tmdb/accountSync'
export {
  AuthError,
  changePassword,
  isCancelledAuth,
  resendVerificationEmail,
  updateDisplayName,
} from '@/lib/firebase/auth'
