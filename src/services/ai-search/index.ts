import { queryOptions } from '@tanstack/react-query'
import type { AiSearchFn } from './types'
import { unavailableAiSearch } from './unavailable'

export type { AiSearchFn, AiSearchResult } from './types'

// Pour brancher un vrai LLM, il suffit de remplacer cette implémentation.
export const aiSearch: AiSearchFn = unavailableAiSearch

export const aiSearchOptions = (description: string) =>
  queryOptions({
    queryKey: ['ai-search', description],
    queryFn: () => aiSearch(description),
    enabled: description.length > 0,
  })
