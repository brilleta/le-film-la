import { Film, Tv } from 'lucide-react'
import { motion } from 'motion/react'
import { posterLayoutId } from '@/lib/motion'
import { posterUrl } from '@/lib/tmdb/images'
import type { MediaType } from '@/lib/tmdb/types'
import { cn } from '@/lib/utils'

interface MediaPosterProps {
  mediaType: MediaType
  mediaId: number
  /** Affiche déjà chargée par la carte d'origine : elle reste visible pendant que le w500 se charge. */
  placeholderPath?: string | null
  path?: string | null
  alt?: string
  className?: string
}

/** Le poster de la page détail, cible de la transition depuis la carte du résultat. */
export function MediaPoster({ mediaType, mediaId, placeholderPath, path, alt = '', className }: MediaPosterProps) {
  const layoutId = posterLayoutId(mediaType, mediaId)
  const FallbackIcon = mediaType === 'tv' ? Tv : Film
  const placeholder = posterUrl(placeholderPath ?? null)
  const poster = posterUrl(path ?? null, 'w500')

  return (
    <motion.div
      layoutId={layoutId}
      layoutCrossfade={false}
      data-poster={layoutId}
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
          <FallbackIcon className="size-12" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  )
}
