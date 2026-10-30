import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { movieDetails, searchResultsToMedia, tvDetails } from '@/lib/tmdb/media'
import type { MediaDetails, MediaType, PagedResponse, TmdbMovieDetails, TmdbSearchResult, TmdbTvDetails } from '@/lib/tmdb/types'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  get isRetryable() {
    return this.status >= 500
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { Accept: 'application/json', ...init.headers },
  })

  if (!response.ok) {
    throw new ApiError(await errorMessage(response), response.status)
  }

  return response.json() as Promise<T>
}

/** Le back répond `{ error, message }` ; un proxy en panne peut renvoyer autre chose que du JSON. */
async function errorMessage(response: Response) {
  const body: unknown = await response.json().catch(() => null)
  if (typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string') {
    return body.message
  }
  return 'Le service ne répond pas correctement. Réessaie dans un instant.'
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
      const response = await apiFetch<PagedResponse<TmdbSearchResult>>(`/api/movies/search?${params}`, { signal })
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
