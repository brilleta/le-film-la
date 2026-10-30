import type {
  MediaDetails,
  MediaSummary,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbSearchResult,
  TmdbTv,
  TmdbTvDetails,
} from './types'

function movieSummary(movie: TmdbMovie): MediaSummary {
  return {
    mediaType: 'movie',
    id: movie.id,
    title: movie.title,
    date: movie.release_date ?? '',
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
  }
}

function tvSummary(tv: TmdbTv): MediaSummary {
  return {
    mediaType: 'tv',
    id: tv.id,
    title: tv.name,
    date: tv.first_air_date ?? '',
    overview: tv.overview,
    poster_path: tv.poster_path,
    backdrop_path: tv.backdrop_path,
    vote_average: tv.vote_average,
  }
}

/** La recherche multi renvoie aussi des personnes : seuls les films et les séries sont gardés. */
export function searchResultsToMedia(results: TmdbSearchResult[]): MediaSummary[] {
  return results.flatMap((result) => {
    if (result.media_type === 'movie') return movieSummary(result)
    if (result.media_type === 'tv') return tvSummary(result)
    return []
  })
}

export function movieDetails(movie: TmdbMovieDetails): MediaDetails {
  return {
    ...movieSummary(movie),
    tagline: movie.tagline,
    genres: movie.genres,
    credits: movie.credits,
    videos: movie.videos,
    runtime: movie.runtime,
    seasons: null,
    episodes: null,
  }
}

export function tvDetails(tv: TmdbTvDetails): MediaDetails {
  return {
    ...tvSummary(tv),
    tagline: tv.tagline,
    genres: tv.genres,
    credits: tv.credits,
    videos: tv.videos,
    runtime: null,
    seasons: tv.number_of_seasons,
    episodes: tv.number_of_episodes,
  }
}
