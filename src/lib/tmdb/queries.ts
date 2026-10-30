import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { tmdbFetch } from './client'
import { movieDetails, searchResultsToMedia, tvDetails } from './media'
import type {
  MediaDetails,
  MediaType,
  PagedResponse,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbSearchResult,
  TmdbTvDetails,
} from './types'

export const trendingMoviesOptions = () =>
  queryOptions({
    queryKey: ['movies', 'trending'],
    queryFn: ({ signal }) => tmdbFetch<PagedResponse<TmdbMovie>>('/trending/movie/week', { signal }),
    staleTime: 60 * 60 * 1000,
  })

export const searchMediaOptions = (query: string) =>
  queryOptions({
    queryKey: ['media', 'search', query],
    queryFn: async ({ signal }) => {
      const response = await tmdbFetch<PagedResponse<TmdbSearchResult>>('/search/multi', {
        params: { query, include_adult: 'false' },
        signal,
      })
      return { ...response, results: searchResultsToMedia(response.results) }
    },
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  })

const detailsParams = { append_to_response: 'credits,videos', include_video_language: 'fr,en' }

export const mediaDetailsOptions = (mediaType: MediaType, id: number) =>
  queryOptions({
    queryKey: ['media', 'detail', mediaType, id],
    queryFn: async ({ signal }): Promise<MediaDetails> =>
      mediaType === 'movie'
        ? movieDetails(await tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, { params: detailsParams, signal }))
        : tvDetails(await tmdbFetch<TmdbTvDetails>(`/tv/${id}`, { params: detailsParams, signal })),
  })
