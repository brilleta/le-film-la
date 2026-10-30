import { Film, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { backdropUrl, posterUrl } from '@/lib/tmdb/images'
import type { MovieDetails } from '@/lib/tmdb/types'

const ratingFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${String(rest).padStart(2, '0')}`
}

export function MovieBackdrop({ path }: { path: string | null }) {
  const backdrop = backdropUrl(path)

  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[70vh] overflow-hidden">
      {backdrop && <img src={backdrop} alt="" className="animate-in size-full object-cover duration-700 fade-in" />}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.14_0.015_270/70%),var(--background))]" />
    </div>
  )
}

export function MovieHero({ movie }: { movie: MovieDetails }) {
  const poster = posterUrl(movie.poster_path, 'w500')
  const year = movie.release_date.slice(0, 4)

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <div className="glass aspect-2/3 w-40 shrink-0 overflow-hidden rounded-2xl sm:w-64">
        {poster ? (
          <img src={poster} alt={`Affiche de ${movie.title}`} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Film className="size-12" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="glass flex-1 space-y-4 rounded-2xl p-5 sm:p-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">{movie.title}</h1>
          {movie.tagline && <p className="mt-1 text-muted-foreground italic">{movie.tagline}</p>}
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {year && <li>{year}</li>}
          {movie.runtime ? <li>{formatRuntime(movie.runtime)}</li> : null}
          {movie.vote_average > 0 && (
            <li className="flex items-center gap-1">
              <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
              {ratingFormat.format(movie.vote_average)} / 10
            </li>
          )}
        </ul>

        {movie.genres.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Genres">
            {movie.genres.map((genre) => (
              <li key={genre.id}>
                <Badge variant="secondary">{genre.name}</Badge>
              </li>
            ))}
          </ul>
        )}

        <div>
          <h2 className="mb-1 font-heading text-lg font-semibold">Résumé</h2>
          <p className="leading-relaxed">{movie.overview || "Aucun résumé n'est disponible en français."}</p>
        </div>
      </div>
    </div>
  )
}
