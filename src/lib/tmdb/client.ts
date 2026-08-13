import type { TmdbErrorBody } from './types'

const BASE_URL = (import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3').replace(
  /\/+$/,
  '',
)
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN

if (!ACCESS_TOKEN && import.meta.env.DEV) {
  console.error(
    '[tmdb] VITE_TMDB_ACCESS_TOKEN is missing. Copy .env.example to .env and add your TMDB read access token.',
  )
}

/** Error thrown for any non-2xx TMDB response or transport failure. */
export class TmdbError extends Error {
  readonly status: number
  readonly code: number | undefined
  /** True when retrying the same request could plausibly succeed. */
  readonly retryable: boolean

  constructor(message: string, status: number, code?: number) {
    super(message)
    this.name = 'TmdbError'
    this.status = status
    this.code = code
    // 4xx responses are caller errors (bad id, bad token) — retrying is futile.
    // 0 means the request never completed (offline, DNS, timeout).
    this.retryable = status === 0 || status === 429 || status >= 500
  }
}

export type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions {
  /** Query string parameters; `null`/`undefined`/`''` entries are dropped. */
  params?: Record<string, QueryValue>
  signal?: AbortSignal
  /** Per-request timeout in ms. Defaults to 15s. */
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 15_000

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const url = new URL(`${BASE_URL}/${path.replace(/^\/+/, '')}`)

  // TMDB defaults to English; keeping it explicit makes responses deterministic.
  url.searchParams.set('language', 'en-US')

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

/**
 * Performs a typed GET against the TMDB v3 API.
 *
 * Combines the caller's abort signal with an internal timeout, so a hung
 * request can never leak a pending promise into React Query.
 */
export async function tmdbFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options

  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal

  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      signal: combinedSignal,
    })
  } catch (error) {
    // Let genuine user-initiated cancellations propagate so React Query can
    // discard them silently instead of surfacing an error state.
    if (signal?.aborted) throw error

    if (timeoutSignal.aborted) {
      throw new TmdbError(`Request to ${path} timed out after ${timeoutMs}ms.`, 0)
    }
    throw new TmdbError(
      error instanceof Error ? error.message : 'Network request failed.',
      0,
    )
  }

  if (!response.ok) {
    let body: TmdbErrorBody = {}
    try {
      body = (await response.json()) as TmdbErrorBody
    } catch {
      /* Error bodies are not always JSON; the status alone is enough. */
    }

    const message =
      body.status_message ??
      (response.status === 401
        ? 'TMDB rejected the API token. Check VITE_TMDB_ACCESS_TOKEN.'
        : response.status === 404
          ? 'The requested title could not be found.'
          : `TMDB request failed with status ${response.status}.`)

    throw new TmdbError(message, response.status, body.status_code)
  }

  return (await response.json()) as T
}
