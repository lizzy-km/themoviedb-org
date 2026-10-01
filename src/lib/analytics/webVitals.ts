import type { Metric } from 'web-vitals'
import { trackEvent } from './client'

function report(metric: Metric): void {
  trackEvent('web_vital', {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_rating: metric.rating,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_value: metric.value,
    metric_delta: metric.delta,
    navigation_type: metric.navigationType,
  })
}

/** Reports LCP, INP, CLS, FCP and TTFB from real users. Loaded lazily. */
export function reportWebVitals(): void {
  void import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    onCLS(report)
    onINP(report)
    onLCP(report)
    onFCP(report)
    onTTFB(report)
  })
}
