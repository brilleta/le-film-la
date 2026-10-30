import { motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'
import { gridItemVariants } from '@/lib/motion'
import type { MovieSummary } from '@/lib/tmdb/types'
import { MovieCard } from './MovieCard'

const gridClassName = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

export function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  return (
    <ul className={gridClassName}>
      {movies.map((movie) => (
        <motion.li key={movie.id} variants={gridItemVariants} className="relative hover:z-10 focus-within:z-10">
          <MovieCard movie={movie} />
        </motion.li>
      ))}
    </ul>
  )
}

export function MovieGridSkeleton() {
  return (
    <div className={gridClassName} role="status" aria-label="Chargement des films">
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index} className="glass overflow-hidden rounded-xl">
          <Skeleton className="aspect-2/3 rounded-none" />
          {/* Mêmes hauteurs que MovieCard : la grille ne saute pas à l'arrivée des résultats. */}
          <div className="space-y-1 p-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
