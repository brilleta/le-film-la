import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound, useCanGoBack, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { CastList } from '@/features/movie/CastList'
import { MovieDetailSkeleton } from '@/features/movie/MovieDetailSkeleton'
import { MovieBackdrop, MovieHero } from '@/features/movie/MovieHero'
import { TrailerEmbed } from '@/features/movie/TrailerEmbed'
import { pickTrailer } from '@/features/movie/trailer'
import { movieContentVariants, pageItemVariants } from '@/lib/motion'
import { TmdbError } from '@/lib/tmdb/client'
import { movieDetailsOptions } from '@/lib/tmdb/queries'

export const Route = createFileRoute('/movie/$id')({
  loader: async ({ context, params }) => {
    if (!/^[1-9]\d{0,9}$/.test(params.id)) throw notFound()
    try {
      await context.queryClient.ensureQueryData(movieDetailsOptions(Number(params.id)))
    } catch (error) {
      if (error instanceof TmdbError && error.status === 404) throw notFound()
      throw error
    }
  },
  pendingMs: 150,
  pendingComponent: MovieDetailSkeleton,
  errorComponent: MovieError,
  component: MoviePage,
})

function MoviePage() {
  const { id } = Route.useParams()
  const { data: movie } = useSuspenseQuery(movieDetailsOptions(Number(id)))
  const trailer = pickTrailer(movie.videos.results)

  useEffect(() => {
    document.title = `${movie.title} · Mais Si ! Le film là !`
    return () => {
      document.title = 'Mais Si ! Le film là !'
    }
  }, [movie.title])

  return (
    <>
      <MovieBackdrop path={movie.backdrop_path} />
      <motion.div variants={movieContentVariants} className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        <motion.div variants={pageItemVariants}>
          <BackButton />
        </motion.div>
        <MovieHero movie={movie} />
        {trailer && (
          <motion.div variants={pageItemVariants}>
            <TrailerEmbed video={trailer} movieTitle={movie.title} />
          </motion.div>
        )}
        {movie.credits.cast.length > 0 && (
          <motion.div variants={pageItemVariants}>
            <CastList cast={movie.credits.cast} />
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

function MovieError({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <ErrorState error={error} onRetry={() => void router.invalidate()} />
    </div>
  )
}
