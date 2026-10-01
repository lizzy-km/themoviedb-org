/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_BASE_URL?: string
  readonly VITE_TMDB_ACCESS_TOKEN?: string

  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  /** 'true' | 'false'. Defaults to on in production builds, off in dev. */
  readonly VITE_ANALYTICS_ENABLED?: string
  /** 'true' logs every event to the console and routes it to GA4 DebugView. */
  readonly VITE_ANALYTICS_DEBUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
