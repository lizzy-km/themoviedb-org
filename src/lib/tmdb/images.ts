/**
 * TMDB image URL helpers.
 *
 * The previous code hardcoded `http://image.tmdb.org/t/p/w500/...` everywhere,
 * which (a) served insecure content that browsers block on HTTPS pages, and
 * (b) downloaded 500px-wide files for 150px-wide thumbnails. These helpers pick
 * the smallest size that covers the slot and always use HTTPS.
 */

const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const POSTER_SIZES = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'] as const
export const BACKDROP_SIZES = ['w300', 'w780', 'w1280', 'original'] as const
export const PROFILE_SIZES = ['w45', 'w185', 'h632', 'original'] as const
export const LOGO_SIZES = ['w45', 'w92', 'w154', 'w185', 'w300', 'original'] as const
export const STILL_SIZES = ['w92', 'w185', 'w300', 'original'] as const

export type PosterSize = (typeof POSTER_SIZES)[number]
export type BackdropSize = (typeof BACKDROP_SIZES)[number]
export type ProfileSize = (typeof PROFILE_SIZES)[number]
export type LogoSize = (typeof LOGO_SIZES)[number]
export type StillSize = (typeof STILL_SIZES)[number]

function buildImageUrl(path: string | null | undefined, size: string): string | null {
  if (!path) return null
  // TMDB paths already start with "/"; guard against double slashes anyway.
  return `${IMAGE_BASE}/${size}${path.startsWith('/') ? path : `/${path}`}`
}

export function posterUrl(path: string | null | undefined, size: PosterSize = 'w342') {
  return buildImageUrl(path, size)
}

export function backdropUrl(path: string | null | undefined, size: BackdropSize = 'w1280') {
  return buildImageUrl(path, size)
}

export function profileUrl(path: string | null | undefined, size: ProfileSize = 'w185') {
  return buildImageUrl(path, size)
}

export function logoUrl(path: string | null | undefined, size: LogoSize = 'w92') {
  return buildImageUrl(path, size)
}

export function stillUrl(path: string | null | undefined, size: StillSize = 'w300') {
  return buildImageUrl(path, size)
}

/**
 * Builds a `srcset` so the browser can pick a file matched to the device's
 * pixel density instead of always downloading the largest variant.
 */
export function posterSrcSet(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  return [
    `${buildImageUrl(path, 'w185')} 185w`,
    `${buildImageUrl(path, 'w342')} 342w`,
    `${buildImageUrl(path, 'w500')} 500w`,
  ].join(', ')
}

export function backdropSrcSet(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  return [
    `${buildImageUrl(path, 'w780')} 780w`,
    `${buildImageUrl(path, 'w1280')} 1280w`,
    `${buildImageUrl(path, 'original')} 1920w`,
  ].join(', ')
}

/** YouTube helpers for the trailer modal. */
export function youTubeEmbedUrl(key: string, autoplay = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
  })
  return `https://www.youtube.com/embed/${key}?${params.toString()}`
}

export function youTubeThumbnail(key: string): string {
  return `https://i.ytimg.com/vi/${key}/hqdefault.jpg`
}
