export interface PagedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  iso_639_1: string
}

/* Réponses brutes de TMDB : films et séries ne nomment pas leurs champs de la même façon. */

interface TmdbTitle {
  id: number
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
}

export interface TmdbMovie extends TmdbTitle {
  title: string
  release_date?: string
}

export interface TmdbTv extends TmdbTitle {
  name: string
  first_air_date?: string
}

export type TmdbSearchResult =
  | (TmdbMovie & { media_type: 'movie' })
  | (TmdbTv & { media_type: 'tv' })
  | { media_type: 'person'; id: number }

interface TmdbDetails {
  tagline: string
  genres: Genre[]
  credits: { cast: CastMember[] }
  videos: { results: Video[] }
}

export interface TmdbMovieDetails extends TmdbMovie, TmdbDetails {
  runtime: number | null
}

export interface TmdbTvDetails extends TmdbTv, TmdbDetails {
  number_of_seasons: number
  number_of_episodes: number
}

/* Forme commune utilisée par l'interface. */

export type MediaType = 'movie' | 'tv'

export interface MediaSummary {
  mediaType: MediaType
  id: number
  title: string
  /** Date de sortie d'un film ou de première diffusion d'une série ; vide si TMDB ne la connaît pas. */
  date: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
}

export interface MediaDetails extends MediaSummary, TmdbDetails {
  /** Films uniquement. */
  runtime: number | null
  /** Séries uniquement. */
  seasons: number | null
  episodes: number | null
}
