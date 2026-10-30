import { useLocation } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { pageBackdropVariants, pageItemVariants } from '@/lib/motion'
import { backdropUrl } from '@/lib/tmdb/images'
import type { MediaDetails } from '@/lib/tmdb/types'
import { MediaPoster } from './MediaPoster'

const ratingFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${String(rest).padStart(2, '0')}`
}

export function MediaBackdrop({ path }: { path: string | null }) {
  const backdrop = backdropUrl(path)

  return (
    <motion.div
      aria-hidden="true"
      variants={pageBackdropVariants}
      className="absolute inset-x-0 top-0 -z-10 h-[70vh] overflow-hidden"
    >
      {backdrop && <img src={backdrop} alt="" className="size-full object-cover" />}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.14_0.015_270/70%),var(--background))]" />
    </motion.div>
  )
}

const plural = (count: number, noun: string) => `${count} ${noun}${count > 1 ? 's' : ''}`

export function MediaHero({ media }: { media: MediaDetails }) {
  const { posterPath } = useLocation({ select: (location) => location.state })
  const year = media.date.slice(0, 4)

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <MediaPoster
        mediaType={media.mediaType}
        mediaId={media.id}
        placeholderPath={posterPath}
        path={media.poster_path}
        alt={`Affiche de ${media.title}`}
      />

      <motion.div variants={pageItemVariants} className="glass flex-1 space-y-4 rounded-2xl p-5 sm:p-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">{media.title}</h1>
          {media.tagline && <p className="mt-1 text-muted-foreground italic">{media.tagline}</p>}
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {year && <li>{year}</li>}
          {media.runtime ? <li>{formatRuntime(media.runtime)}</li> : null}
          {media.seasons ? <li>{plural(media.seasons, 'saison')}</li> : null}
          {media.episodes ? <li>{plural(media.episodes, 'épisode')}</li> : null}
          {media.vote_average > 0 && (
            <li className="flex items-center gap-1">
              <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
              {ratingFormat.format(media.vote_average)} / 10
            </li>
          )}
        </ul>

        {media.genres.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Genres">
            {media.genres.map((genre) => (
              <li key={genre.id}>
                <Badge variant="secondary">{genre.name}</Badge>
              </li>
            ))}
          </ul>
        )}

        <div>
          <h2 className="mb-1 font-heading text-lg font-semibold">Résumé</h2>
          <p className="leading-relaxed">{media.overview || "Aucun résumé n'est disponible en français."}</p>
        </div>
      </motion.div>
    </div>
  )
}
