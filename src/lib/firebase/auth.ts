import type * as FirebaseAuth from 'firebase/auth'
import { getFirebaseApp } from './app'
import type { AuthUser } from '@/stores/authStore'

/**
 * Firebase Auth wrapper.
 *
 * The SDK is imported lazily, and everything the UI needs goes through these
 * functions so components never deal with Firebase types or error codes.
 */

type AuthModule = typeof FirebaseAuth

interface AuthHandle {
  mod: AuthModule
  auth: FirebaseAuth.Auth
}

let handlePromise: Promise<AuthHandle | null> | null = null

function getAuthHandle(): Promise<AuthHandle | null> {
  handlePromise ??= (async () => {
    const [app, mod] = await Promise.all([getFirebaseApp(), import('firebase/auth')])
    if (!app) return null
    const auth = mod.getAuth(app)
    auth.useDeviceLanguage()
    return { mod, auth }
  })()
  return handlePromise
}

async function requireAuth(): Promise<AuthHandle> {
  const handle = await getAuthHandle()
  if (!handle) throw new AuthError('unavailable', 'Accounts are not available right now.')
  return handle
}

async function requireUser(): Promise<AuthHandle & { user: FirebaseAuth.User }> {
  const handle = await requireAuth()
  const user = handle.auth.currentUser
  if (!user) throw new AuthError('no-user', 'You need to be signed in to do that.')
  return { ...handle, user }
}

export function toAuthUser(user: FirebaseAuth.User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    providers: user.providerData.map((p) => p.providerId),
    createdAt: user.metadata.creationTime ?? null,
  }
}

/**
 * Subscribes to sign-in state. Also completes a pending Google redirect
 * sign-in (the fallback used when a popup is blocked).
 * Calls `onUnavailable` instead when Firebase isn't configured.
 */
export async function watchAuthState(
  onChange: (user: AuthUser | null) => void,
  onUnavailable: () => void,
): Promise<() => void> {
  const handle = await getAuthHandle().catch(() => null)
  if (!handle) {
    onUnavailable()
    return () => {}
  }
  const { mod, auth } = handle
  mod.getRedirectResult(auth).catch(() => {
    /* No pending redirect, or it failed — the login page shows its own errors. */
  })
  return mod.onIdTokenChanged(auth, (user) => onChange(user ? toAuthUser(user) : null))
}

// --- Sign up / sign in -------------------------------------------------------

function actionUrl(path: string): string {
  return `${window.location.origin}${path}`
}

export async function signUpWithEmail(
  displayName: string,
  email: string,
  password: string,
): Promise<void> {
  const { mod, auth } = await requireAuth()
  await run(async () => {
    const { user } = await mod.createUserWithEmailAndPassword(auth, email, password)
    await mod.updateProfile(user, { displayName })
    await mod.sendEmailVerification(user, { url: actionUrl('/account') })
    // onIdTokenChanged fired before the profile update; force a refresh so
    // the store picks up the display name.
    await user.getIdToken(true)
  })
}

export async function signInWithEmail(
  email: string,
  password: string,
  remember: boolean,
): Promise<void> {
  const { mod, auth } = await requireAuth()
  await run(async () => {
    await mod.setPersistence(
      auth,
      remember ? mod.browserLocalPersistence : mod.browserSessionPersistence,
    )
    await mod.signInWithEmailAndPassword(auth, email, password)
  })
}

/** Popup first; falls back to a full-page redirect when popups are blocked. */
export async function signInWithGoogle(): Promise<'done' | 'redirecting'> {
  const { mod, auth } = await requireAuth()
  const provider = new mod.GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  try {
    await mod.signInWithPopup(auth, provider)
    return 'done'
  } catch (error) {
    if (errorCode(error) === 'auth/popup-blocked') {
      await mod.signInWithRedirect(auth, provider)
      return 'redirecting'
    }
    throw toAuthError(error)
  }
}

export async function signOut(): Promise<void> {
  const { mod, auth } = await requireAuth()
  await mod.signOut(auth)
}

// --- Account recovery & verification ----------------------------------------

export async function sendPasswordReset(email: string): Promise<void> {
  const { mod, auth } = await requireAuth()
  await run(() => mod.sendPasswordResetEmail(auth, email, { url: actionUrl('/login') }))
}

export async function resendVerificationEmail(): Promise<void> {
  const { mod, user } = await requireUser()
  await run(() => mod.sendEmailVerification(user, { url: actionUrl('/account') }))
}

/** Re-reads the user from Firebase, e.g. after they click the verification link. */
export async function reloadUser(): Promise<AuthUser | null> {
  const { user } = await requireUser()
  await run(() => user.reload())
  await user.getIdToken(true)
  return toAuthUser(user)
}

// --- Profile & security -------------------------------------------------------

export async function updateDisplayName(displayName: string): Promise<void> {
  const { mod, user } = await requireUser()
  await run(async () => {
    await mod.updateProfile(user, { displayName })
    await user.getIdToken(true)
  })
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const { mod, user } = await requireUser()
  await run(async () => {
    await reauthenticate(mod, user, currentPassword)
    await mod.updatePassword(user, newPassword)
  })
}

/**
 * Deletes the account. Firebase requires a recent sign-in, so this always
 * re-authenticates first: with the password if given, otherwise via Google.
 * `beforeDelete` runs after re-auth succeeds — use it to delete user data
 * while the security rules still recognize the user.
 */
export async function deleteAccount(
  password: string | null,
  beforeDelete: (uid: string) => Promise<void>,
): Promise<void> {
  const { mod, user } = await requireUser()
  await run(async () => {
    await reauthenticate(mod, user, password)
    await beforeDelete(user.uid)
    await mod.deleteUser(user)
  })
}

async function reauthenticate(
  mod: AuthModule,
  user: FirebaseAuth.User,
  password: string | null,
): Promise<void> {
  if (password !== null) {
    if (!user.email) throw new AuthError('no-email', 'This account has no email address.')
    await mod.reauthenticateWithCredential(
      user,
      mod.EmailAuthProvider.credential(user.email, password),
    )
  } else {
    await mod.reauthenticateWithPopup(user, new mod.GoogleAuthProvider())
  }
}

// --- Errors -------------------------------------------------------------------

export class AuthError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

/** Friendly copy for the codes a user can actually hit. */
const MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/missing-email': 'Enter your email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
  'auth/weak-password': 'Choose a stronger password (at least 8 characters).',
  'auth/password-does-not-meet-requirements': 'That password doesn’t meet the requirements.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'The sign-in window was closed before finishing.',
  'auth/cancelled-popup-request': 'The sign-in window was closed before finishing.',
  'auth/account-exists-with-different-credential':
    'An account already exists with this email using a different sign-in method.',
  'auth/requires-recent-login': 'For your security, sign in again and retry.',
  'auth/user-mismatch': 'That’s a different account from the one you’re signed in with.',
  'auth/unauthorized-domain': 'Sign-in isn’t enabled for this domain yet.',
  'auth/operation-not-allowed': 'This sign-in method isn’t enabled.',
}

function errorCode(error: unknown): string | undefined {
  return typeof error === 'object' && error && 'code' in error
    ? String((error as { code: unknown }).code)
    : undefined
}

function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error
  const code = errorCode(error) ?? 'unknown'
  if (code.startsWith('auth/api-key') || code === 'auth/invalid-api-key') {
    // Deployment problem, not a user problem — say so instead of "try again".
    console.error('[auth] Firebase rejected the config:', code)
    return new AuthError(code, 'Sign-in is misconfigured on this site. Please try again later.')
  }
  if (!MESSAGES[code]) console.error('[auth] unmapped error', code, error)
  return new AuthError(code, MESSAGES[code] ?? 'Something went wrong. Please try again.')
}

/** True for "user closed the popup" — not worth showing as an error. */
export function isCancelledAuth(error: unknown): boolean {
  const code = error instanceof AuthError ? error.code : errorCode(error)
  return code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'
}

async function run<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    throw toAuthError(error)
  }
}
