import { Skeleton } from '@/components/ui/skeleton'
import type { MovieSummary } from '@/lib/tmdb/types'
import { MovieCard } from './MovieCard'

const gridClassName = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

export function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  return (
    <ul className={gridClassName}>
      {movies.map((movie, index) => (
        <li key={movie.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  )
}

export function MovieGridSkeleton() {
  return (
    <div className={gridClassName} role="status" aria-label="Chargement des films">
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="glass overflow-hidden rounded-xl">
          <Skeleton className="aspect-2/3 rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
