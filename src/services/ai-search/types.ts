import type { MediaSummary } from '@/lib/tmdb/types'

export type AiSearchResult =
  | { status: 'ok'; results: MediaSummary[] }
  | { status: 'unavailable'; message: string }

export type AiSearchFn = (description: string) => Promise<AiSearchResult>
