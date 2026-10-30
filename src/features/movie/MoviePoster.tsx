import { Film } from 'lucide-react'
import { motion } from 'motion/react'
import { posterUrl } from '@/lib/tmdb/images'
import { cn } from '@/lib/utils'

interface MoviePosterProps {
  movieId: number
  /** Affiche déjà chargée par la carte d'origine : elle reste visible pendant que le w500 se charge. */
  placeholderPath?: string | null
  path?: string | null
  alt?: string
  className?: string
}

/** Le poster de la page détail, cible de la transition depuis la carte du film. */
export function MoviePoster({ movieId, placeholderPath, path, alt = '', className }: MoviePosterProps) {
  const placeholder = posterUrl(placeholderPath ?? null)
  const poster = posterUrl(path ?? null, 'w500')

  return (
    <motion.div
      layoutId={`poster-${movieId}`}
      layoutCrossfade={false}
      data-poster={movieId}
      style={{ borderRadius: 22 }}
      className={cn(
        'relative z-10 aspect-2/3 w-40 shrink-0 overflow-hidden bg-muted shadow-[0_8px_32px_oklch(0_0_0/35%)] sm:w-64',
        className,
      )}
    >
      {placeholder && <img src={placeholder} alt="" className="absolute inset-0 size-full object-cover" />}
      {poster && <img src={poster} alt={alt} className="absolute inset-0 size-full object-cover" />}
      {!placeholder && !poster && path !== undefined && (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <Film className="size-12" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  )
}
