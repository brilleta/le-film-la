import type { MovieSummary } from '@/lib/tmdb/types'

export type AiSearchResult =
  | { status: 'ok'; movies: MovieSummary[] }
  | { status: 'unavailable'; message: string }

export type AiSearchFn = (description: string) => Promise<AiSearchResult>
