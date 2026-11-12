import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { movieDetails, searchResultsToMedia, tvDetails } from '@/lib/tmdb/media'
import type { MediaDetails, MediaType, PagedResponse, TmdbMovieDetails, TmdbSearchResult, TmdbTvDetails } from '@/lib/tmdb/types'
import { searchSessionHeaders } from '@/lib/searchSession'

export class ApiError extends Error {
  readonly status: number
  /** Champ `error` du back, quand il est présent. */
  readonly code: string | null

  constructor(message: string, status: number, code: string | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }

  get isRetryable() {
    return this.status >= 500
  }
}

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/** Relu à chaque requête : le back change le jeton après register, login et logout. */
function readXsrfToken() {
  const cookie = document.cookie.split('; ').find((entry) => entry.startsWith('XSRF-TOKEN='))
  return cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : null
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (UNSAFE_METHODS.has((init.method ?? 'GET').toUpperCase())) {
    const xsrfToken = readXsrfToken()
    if (xsrfToken) headers.set('X-XSRF-TOKEN', xsrfToken)
  }

  const response = await fetch(path, { ...init, headers, credentials: 'same-origin' })

  if (!response.ok) {
    const { message, code } = await errorBody(response)
    throw new ApiError(message, response.status, code)
  }

  // Logout répond 204 sans corps.
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

/** Le back répond `{ error, message }` ; un proxy en panne peut renvoyer autre chose que du JSON. */
async function errorBody(response: Response) {
  const body: unknown = await response.json().catch(() => null)
  const isObject = typeof body === 'object' && body !== null
  const message =
    isObject && 'message' in body && typeof body.message === 'string'
      ? body.message
      : 'Le service ne répond pas correctement. Réessaie dans un instant.'
  const code = isObject && 'error' in body && typeof body.error === 'string' ? body.error : null
  return { message, code }
}

export const trendingOptions = () =>
  queryOptions({
    queryKey: ['media', 'trending'],
    queryFn: async ({ signal }) => {
      const response = await apiFetch<PagedResponse<TmdbSearchResult>>('/api/trending', { signal })
      return searchResultsToMedia(response.results)
    },
    staleTime: 60 * 60 * 1000,
  })

export const searchMediaOptions = (query: string) =>
  queryOptions({
    queryKey: ['media', 'search', query],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ q: query })
      const response = await apiFetch<PagedResponse<TmdbSearchResult>>(`/api/movies/search?${params}`, {
        signal,
        headers: searchSessionHeaders(),
      })
      return { ...response, results: searchResultsToMedia(response.results) }
    },
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  })

export const mediaDetailsOptions = (mediaType: MediaType, id: number) =>
  queryOptions({
    queryKey: ['media', 'detail', mediaType, id],
    queryFn: async ({ signal }): Promise<MediaDetails> =>
      mediaType === 'movie'
        ? movieDetails(await apiFetch<TmdbMovieDetails>(`/api/movies/movie/${id}`, { signal }))
        : tvDetails(await apiFetch<TmdbTvDetails>(`/api/movies/tv/${id}`, { signal })),
  })
