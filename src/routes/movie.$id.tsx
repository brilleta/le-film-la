import { createFileRoute } from '@tanstack/react-router'
import { loadMediaDetails } from '@/features/media/loadMediaDetails'
import { MediaDetailError, MediaDetailPage } from '@/features/media/MediaDetailPage'
import { MediaDetailSkeleton } from '@/features/media/MediaDetailSkeleton'

export const Route = createFileRoute('/movie/$id')({
  loader: ({ context, params }) => loadMediaDetails(context.queryClient, 'movie', params.id),
  pendingMs: 150,
  pendingComponent: () => <MediaDetailSkeleton mediaType="movie" />,
  errorComponent: MediaDetailError,
  component: MoviePage,
})

function MoviePage() {
  const { id } = Route.useParams()
  return <MediaDetailPage mediaType="movie" id={Number(id)} />
}
