import { queryOptions } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { MediaSummary, MediaType } from '@/lib/tmdb/types'

interface AiSearchResponse {
  results: {
    tmdbId: number
    type: MediaType
    title: string
    year: number | null
    posterPath: string | null
    voteAverage: number | null
    reason: string
  }[]
}

export async function aiSearch(description: string): Promise<MediaSummary[]> {
  const { results } = await apiFetch<AiSearchResponse>('/api/ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  })

  return results.map((result) => ({
    mediaType: result.type,
    id: result.tmdbId,
    title: result.title,
    date: result.year === null ? '' : String(result.year),
    overview: '',
    poster_path: result.posterPath,
    backdrop_path: null,
    vote_average: result.voteAverage ?? 0,
    reason: result.reason,
  }))
}

export const aiSearchOptions = (description: string) =>
  queryOptions({
    queryKey: ['ai-search', description],
    // Pas de signal : chaque appel consomme le quota du back, autant garder la réponse en cache même si on change de page.
    queryFn: () => aiSearch(description),
    enabled: description.length > 0,
    staleTime: Infinity,
    retry: false,
  })
