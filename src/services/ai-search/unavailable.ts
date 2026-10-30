import type { AiSearchFn } from './types'

export const unavailableAiSearch: AiSearchFn = async () => ({
  status: 'unavailable',
  message: 'Bientôt disponible',
})
