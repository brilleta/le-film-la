import { Link } from '@tanstack/react-router'
import { Film, Star } from 'lucide-react'
import { posterUrl } from '@/lib/tmdb/images'
import type { MovieSummary } from '@/lib/tmdb/types'

const ratingFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function MovieCard({ movie }: { movie: MovieSummary }) {
  const poster = posterUrl(movie.poster_path)
  const year = movie.release_date.slice(0, 4)
  const rating = movie.vote_average > 0 ? ratingFormat.format(movie.vote_average) : null

  return (
    <Link
      to="/movie/$id"
      params={{ id: String(movie.id) }}
      className="glass group flex h-full flex-col overflow-hidden rounded-xl transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_40px_oklch(0_0_0/50%)]"
    >
      <div className="aspect-2/3 overflow-hidden bg-muted">
        {poster ? (
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Film className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 text-sm font-medium">{movie.title}</h2>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{year}</span>
          {rating && (
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-primary text-primary" aria-hidden="true" />
              <span className="sr-only">Note : </span>
              {rating}
              <span className="sr-only"> sur 10</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
