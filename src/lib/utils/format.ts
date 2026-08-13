/** Formatting helpers shared across features. */

/** `142` -> `"2h 22m"`. Returns null when runtime is unknown. */
export function formatRuntime(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

/** `"2024-03-01"` -> `"March 1, 2024"`. Returns null for missing/invalid input. */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return DATE_FORMATTER.format(date)
}

/** `"2024-03-01"` -> `"2024"`. */
export function formatYear(value: string | null | undefined): string | null {
  if (!value) return null
  const year = value.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : null
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** `0` and nullish values return null — TMDB uses 0 to mean "unknown". */
export function formatCurrency(value: number | null | undefined): string | null {
  if (!value || value <= 0) return null
  return CURRENCY_FORMATTER.format(value)
}

const COMPACT_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** `12500` -> `"12.5K"`. */
export function formatCompact(value: number | null | undefined): string {
  if (!value || value <= 0) return '0'
  return COMPACT_FORMATTER.format(value)
}

/** TMDB returns a 0-10 float; the UI shows a 0-100 integer percentage. */
export function toPercent(voteAverage: number | null | undefined): number {
  if (!voteAverage || voteAverage <= 0) return 0
  return Math.round(voteAverage * 10)
}

/** Relative time for review timestamps: `"3 months ago"`. */
const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

const TIME_DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

export function formatRelativeTime(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  let duration = (date.getTime() - Date.now()) / 1000
  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_FORMATTER.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return null
}

/** Truncates on a word boundary and appends an ellipsis. */
export function truncate(text: string | null | undefined, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  const slice = text.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`
}

/** Human-readable department/job list: `"Director, Writer"`. */
export function joinNonEmpty(values: Array<string | null | undefined>, separator = ', '): string {
  return values.filter((value): value is string => Boolean(value?.trim())).join(separator)
}

/** Builds initials for the avatar fallback: `"Jane Doe"` -> `"JD"`. */
export function initials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?'
}
