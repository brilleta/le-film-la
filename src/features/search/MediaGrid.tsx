import { motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'
import { gridItemVariants } from '@/lib/motion'
import type { MediaSummary } from '@/lib/tmdb/types'
import { MediaCard } from './MediaCard'
import { mediaKey } from './mediaKey'

const gridClassName = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

export function MediaGrid({ results }: { results: MediaSummary[] }) {
  return (
    <ul className={gridClassName}>
      {results.map((media) => (
        <motion.li key={mediaKey(media)} variants={gridItemVariants} className="relative hover:z-10 focus-within:z-10">
          <MediaCard media={media} />
        </motion.li>
      ))}
    </ul>
  )
}

export function MediaGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className={gridClassName} role="status" aria-label="Chargement des résultats">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="glass overflow-hidden rounded-xl">
          <Skeleton className="aspect-2/3 rounded-none" />
          {/* Mêmes hauteurs que MediaCard : la grille ne saute pas à l'arrivée des résultats. */}
          <div className="space-y-1 p-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
