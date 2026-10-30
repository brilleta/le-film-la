import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { tmdbFetch } from './client'
import type { MovieDetails, MovieSummary, PagedResponse } from './types'

export const trendingMoviesOptions = () =>
  queryOptions({
    queryKey: ['movies', 'trending'],
    queryFn: ({ signal }) => tmdbFetch<PagedResponse<MovieSummary>>('/trending/movie/week', { signal }),
    staleTime: 60 * 60 * 1000,
  })

export const searchMoviesOptions = (query: string) =>
  queryOptions({
    queryKey: ['movies', 'search', query],
    queryFn: ({ signal }) =>
      tmdbFetch<PagedResponse<MovieSummary>>('/search/movie', {
        params: { query, include_adult: 'false' },
        signal,
      }),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  })

export const movieDetailsOptions = (id: number) =>
  queryOptions({
    queryKey: ['movies', 'detail', id],
    queryFn: ({ signal }) =>
      tmdbFetch<MovieDetails>(`/movie/${id}`, {
        params: { append_to_response: 'credits,videos', include_video_language: 'fr,en' },
        signal,
      }),
  })
