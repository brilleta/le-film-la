import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useCanGoBack, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { movieContentVariants, pageItemVariants } from '@/lib/motion'
import { mediaDetailsOptions } from '@/lib/tmdb/queries'
import type { MediaType } from '@/lib/tmdb/types'
import { CastList } from './CastList'
import { MediaBackdrop, MediaHero } from './MediaHero'
import { TrailerEmbed } from './TrailerEmbed'
import { pickTrailer } from './trailer'

export function MediaDetailPage({ mediaType, id }: { mediaType: MediaType; id: number }) {
  const { data: media } = useSuspenseQuery(mediaDetailsOptions(mediaType, id))
  const trailer = pickTrailer(media.videos.results)

  useEffect(() => {
    document.title = `${media.title} · Mais Si ! Le film là !`
    return () => {
      document.title = 'Mais Si ! Le film là !'
    }
  }, [media.title])

  return (
    <>
      <MediaBackdrop path={media.backdrop_path} />
      <motion.div variants={movieContentVariants} className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        <motion.div variants={pageItemVariants}>
          <BackButton />
        </motion.div>
        <MediaHero media={media} />
        {trailer && (
          <motion.div variants={pageItemVariants}>
            <TrailerEmbed video={trailer} title={media.title} />
          </motion.div>
        )}
        {media.credits.cast.length > 0 && (
          <motion.div variants={pageItemVariants}>
            <CastList cast={media.credits.cast} />
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

function BackButton() {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  if (canGoBack) {
    return (
      <Button variant="ghost" size="sm" onClick={() => router.history.back()}>
        <ArrowLeft aria-hidden="true" />
        Retour
      </Button>
    )
  }

  return (
    <Button asChild variant="ghost" size="sm">
      <Link to="/" search={{ q: '', mode: 'classic' }}>
        <ArrowLeft aria-hidden="true" />
        Accueil
      </Link>
    </Button>
  )
}

export function MediaDetailError({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <ErrorState error={error} onRetry={() => void router.invalidate()} />
    </div>
  )
}
