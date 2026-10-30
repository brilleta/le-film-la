import type { MovieSummary } from '@/lib/tmdb/types'

/** Identifie une liste de résultats : la grille ne se rejoue que si les films changent. */
export const moviesKey = (movies: MovieSummary[]) => movies.map((movie) => movie.id).join('-')
