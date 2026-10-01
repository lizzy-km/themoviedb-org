import type * as FirebaseAnalytics from 'firebase/analytics'
import type { AnalyticsEventName, AnalyticsEventParams, UserProperties } from './events'
import { firebaseConfig, getFirebaseApp } from '@/lib/firebase/app'

/**
 * Firebase Analytics client.
 *
 * Firebase is loaded with a dynamic import, so the SDK (~60 kB gzip) never
 * lands in the initial bundle and never delays first paint. Calls made before
 * it finishes loading wait on the same `ready` promise, so they are sent in
 * order once it resolves — nothing is dropped.
 *
 * Every public function is a safe no-op when analytics is disabled, not
 * configured, or unsupported (e.g. cookies blocked), so call sites never need
 * to guard.
 */

const env = import.meta.env

/** Debug mode: logs every call to the console and routes events to GA4 DebugView. */
export const ANALYTICS_DEBUG = env.VITE_ANALYTICS_DEBUG === 'true'

const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.measurementId,
)

/**
 * Collection defaults on in production builds and off in dev, so local
 * browsing doesn't pollute real reports. `VITE_ANALYTICS_ENABLED` overrides
 * either way.
 */
const isEnabledByEnv =
  env.VITE_ANALYTICS_ENABLED === undefined || env.VITE_ANALYTICS_ENABLED === ''
    ? env.PROD
    : env.VITE_ANALYTICS_ENABLED === 'true'

/** Respect the browser-level opt-out signals (Global Privacy Control / Do Not Track). */
function userOptedOut(): boolean {
  if (typeof navigator === 'undefined') return true
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  return nav.globalPrivacyControl === true || nav.doNotTrack === '1'
}

type AnalyticsModule = typeof FirebaseAnalytics

interface Ready {
  mod: AnalyticsModule
  analytics: FirebaseAnalytics.Analytics
}

let ready: Promise<Ready | null> | null = null

function debugLog(...args: unknown[]): void {
  if (ANALYTICS_DEBUG) console.warn('[analytics]', ...args)
}

/**
 * Starts loading Firebase. Idempotent; safe to call more than once.
 * Resolves to `null` whenever analytics should not run.
 */
export function initAnalytics(): Promise<Ready | null> {
  if (ready) return ready

  ready = (async () => {
    if (!isConfigured) {
      if (env.DEV) debugLog('Firebase config missing — analytics disabled.')
      return null
    }
    if (!isEnabledByEnv || userOptedOut()) {
      debugLog('Analytics disabled (env flag or browser opt-out).')
      return null
    }

    try {
      const [app, mod] = await Promise.all([getFirebaseApp(), import('firebase/analytics')])
      if (!app) return null

      if (!(await mod.isSupported())) {
        debugLog('Analytics not supported in this browser.')
        return null
      }

      const analytics = mod.initializeAnalytics(app, {
        config: {
          // Page views are sent manually by <RouteTracker> on every SPA
          // navigation; the automatic one would double-count the first page.
          send_page_view: false,
          ...(ANALYTICS_DEBUG && { debug_mode: true }),
        },
      })

      debugLog('Initialized', firebaseConfig.measurementId)
      return { mod, analytics }
    } catch (error) {
      // Analytics must never break the app (ad blockers routinely block it).
      debugLog('Failed to initialize', error)
      return null
    }
  })()

  return ready
}

/** GA4 rejects string params longer than 100 characters. */
function sanitize(params: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!params) return undefined
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    out[key] = typeof value === 'string' ? value.slice(0, 100) : value
  }
  return out
}

/** Logs a typed event. Fire-and-forget. */
export function trackEvent<E extends AnalyticsEventName>(
  name: E,
  params: AnalyticsEventParams<E>,
): void {
  const clean = sanitize(params as unknown as Record<string, unknown>)
  debugLog('event', name, clean)
  void initAnalytics().then((r) => {
    // Cast: our event names are a superset of Firebase's typed overloads.
    r?.mod.logEvent(r.analytics, name as string, clean)
  })
}

/** Sets user-scoped dimensions (must be registered as custom dimensions in GA4). */
export function setUserProperties(properties: UserProperties): void {
  const clean = sanitize(properties as Record<string, unknown>)
  debugLog('user properties', clean)
  void initAnalytics().then((r) => {
    if (r && clean) r.mod.setUserProperties(r.analytics, clean)
  })
}

/**
 * Turns collection on/off at runtime — wire this to a consent banner if one is
 * added. Has no effect if analytics never initialized.
 */
export function setAnalyticsConsent(granted: boolean): void {
  debugLog('consent', granted)
  void initAnalytics().then((r) => {
    if (r) r.mod.setAnalyticsCollectionEnabled(r.analytics, granted)
  })
}

/** Ties events to the signed-in account (`null` on sign-out). Never send PII here. */
export function setAnalyticsUserId(uid: string | null): void {
  debugLog('user id', uid)
  void initAnalytics().then((r) => {
    if (r) r.mod.setUserId(r.analytics, uid)
  })
}
