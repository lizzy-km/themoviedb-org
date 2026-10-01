import type { FirebaseApp, FirebaseOptions } from 'firebase/app'

/**
 * Shared Firebase app.
 *
 * Analytics, Auth and Firestore all hang off one app instance. The SDK is
 * loaded with a dynamic import so none of it lands in the initial bundle.
 */

const env = import.meta.env

export const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

/** True when enough config is present to start the Firebase app at all. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId,
)

let appPromise: Promise<FirebaseApp | null> | null = null

/** Resolves the shared app, or `null` when Firebase isn't configured. */
export function getFirebaseApp(): Promise<FirebaseApp | null> {
  appPromise ??= (async () => {
    if (!isFirebaseConfigured) return null
    const { initializeApp, getApps } = await import('firebase/app')
    return getApps()[0] ?? initializeApp(firebaseConfig)
  })()
  return appPromise
}
