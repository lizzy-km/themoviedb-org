/**
 * Parses a route param that must be a positive integer id.
 *
 * Returns `null` for anything invalid so the caller can render a 404 instead of
 * firing a request for `/movie/NaN` — the old code passed the raw param
 * straight into a template string and requested `/movie/undefined`.
 */
export function useNumericParam(value: string | undefined): number | null {
  if (!value) return null
  // Reject "12abc", "1.5", "-3" and similar; TMDB ids are plain integers.
  if (!/^\d+$/.test(value)) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}
