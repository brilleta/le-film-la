import type { QueryClient } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { ApiError, mediaDetailsOptions } from '@/lib/api'
import type { MediaType } from '@/lib/tmdb/types'

export async function loadMediaDetails(queryClient: QueryClient, mediaType: MediaType, id: string) {
  if (!/^[1-9]\d{0,9}$/.test(id)) throw notFound()
  try {
    await queryClient.ensureQueryData(mediaDetailsOptions(mediaType, Number(id)))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) throw notFound()
    throw error
  }
}
