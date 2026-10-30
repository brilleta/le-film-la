import type { QueryClient } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { TmdbError } from '@/lib/tmdb/client'
import { mediaDetailsOptions } from '@/lib/tmdb/queries'
import type { MediaType } from '@/lib/tmdb/types'

export async function loadMediaDetails(queryClient: QueryClient, mediaType: MediaType, id: string) {
  if (!/^[1-9]\d{0,9}$/.test(id)) throw notFound()
  try {
    await queryClient.ensureQueryData(mediaDetailsOptions(mediaType, Number(id)))
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) throw notFound()
    throw error
  }
}
