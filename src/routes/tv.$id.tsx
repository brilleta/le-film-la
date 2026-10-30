import { createFileRoute } from '@tanstack/react-router'
import { loadMediaDetails } from '@/features/media/loadMediaDetails'
import { MediaDetailError, MediaDetailPage } from '@/features/media/MediaDetailPage'
import { MediaDetailSkeleton } from '@/features/media/MediaDetailSkeleton'

export const Route = createFileRoute('/tv/$id')({
  loader: ({ context, params }) => loadMediaDetails(context.queryClient, 'tv', params.id),
  pendingMs: 150,
  pendingComponent: () => <MediaDetailSkeleton mediaType="tv" />,
  errorComponent: MediaDetailError,
  component: SeriesPage,
})

function SeriesPage() {
  const { id } = Route.useParams()
  return <MediaDetailPage mediaType="tv" id={Number(id)} />
}
