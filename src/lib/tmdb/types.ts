export interface MovieSummary {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
}

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

export interface MovieDetails extends MovieSummary {
  tagline: string
  runtime: number | null
  genres: Genre[]
  credits: { cast: CastMember[] }
  videos: { results: Video[] }
}
