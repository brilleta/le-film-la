import { useLocation, useParams } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import type { MediaType } from '@/lib/tmdb/types'
import { MediaPoster } from './MediaPoster'

export function MediaDetailSkeleton({ mediaType }: { mediaType: MediaType }) {
  const { id } = useParams({ strict: false })
  const { posterPath } = useLocation({ select: (location) => location.state })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8" role="status" aria-label={mediaType === 'tv' ? 'Chargement de la série' : 'Chargement du film'}>
      <Skeleton className="mb-8 h-8 w-24" />
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Le poster de la carte cliquée vole déjà vers sa place, même si la fiche tarde à charger. */}
        <MediaPoster mediaType={mediaType} mediaId={Number(id)} placeholderPath={posterPath} />
        <div className="glass flex-1 space-y-4 rounded-2xl p-5 sm:p-6">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
