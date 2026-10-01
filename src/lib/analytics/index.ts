export {
  initAnalytics,
  trackEvent,
  setUserProperties,
  setAnalyticsConsent,
  setAnalyticsUserId,
} from './client'
export { reportWebVitals } from './webVitals'
export { RouteTracker } from './RouteTracker'
export { useTrackTitleView, useTrackPersonView } from './hooks'
export type {
  AnalyticsEvents,
  AnalyticsEventName,
  AuthMethod,
  SearchSource,
  UserProperties,
} from './events'
