import { createLink } from '@tanstack/react-router'
import { Film, Star, Tv } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { cardVariants, hoverSpring, posterLayoutId } from '@/lib/motion'
import { posterUrl } from '@/lib/tmdb/images'
import type { MediaSummary } from '@/lib/tmdb/types'

const MotionLink = createLink(motion.a)

const ratingFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const posterRadius = { borderTopLeftRadius: 17, borderTopRightRadius: 17, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }

function setCardRaised(poster: HTMLElement | null, raised: boolean) {
  const card = poster?.closest('li')
  if (card) card.style.zIndex = raised ? '20' : ''
}

export function MediaCard({ media }: { media: MediaSummary }) {
  const posterRef = useRef<HTMLDivElement>(null)
  const poster = posterUrl(media.poster_path)
  const year = media.date.slice(0, 4)
  const rating = media.vote_average > 0 ? ratingFormat.format(media.vote_average) : null
  const layoutId = posterLayoutId(media.mediaType, media.id)
  const isSeries = media.mediaType === 'tv'
  const FallbackIcon = isSeries ? Tv : Film

  return (
    <MotionLink
      to={isSeries ? '/tv/$id' : '/movie/$id'}
      params={{ id: String(media.id) }}
      state={{ posterPath: media.poster_path }}
      variants={cardVariants}
      whileHover="hover"
      whileFocus="hover"
      transition={hoverSpring}
      // L'ombre renforcée est un calque en opacity : animer box-shadow repeindrait à chaque frame.
      className="glass group relative flex h-full flex-col rounded-xl transition-colors duration-200 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-xl after:opacity-0 after:shadow-[0_12px_40px_oklch(0_0_0/50%)] after:transition-opacity after:duration-200 hover:border-primary/50 hover:after:opacity-100 focus-visible:after:opacity-100"
    >
      {/* Pas d'overflow-hidden sur la carte : il couperait le poster pendant son vol au retour. */}
      <motion.div
        layoutId={layoutId}
        layoutCrossfade={false}
        data-poster={layoutId}
        style={posterRadius}
        // Le poster en vol passe au-dessus des cartes voisines.
        onLayoutAnimationStart={() => setCardRaised(posterRef.current, true)}
        onLayoutAnimationComplete={() => setCardRaised(posterRef.current, false)}
        ref={posterRef}
        className="aspect-2/3 overflow-hidden bg-muted"
      >
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
            <FallbackIcon className="size-10" aria-hidden="true" />
          </div>
        )}
      </motion.div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 text-sm font-medium">{media.title}</h2>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{[year, isSeries ? 'Série' : 'Film'].join(' · ')}</span>
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
    </MotionLink>
  )
}
