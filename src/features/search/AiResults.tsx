import { useQuery } from '@tanstack/react-query'
import { SearchX, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { aiSearchOptions } from '@/services/ai-search'
import { MovieGrid, MovieGridSkeleton } from './MovieGrid'

export function AiResults({ description }: { description: string }) {
  const { data, error, isPending, refetch } = useQuery(aiSearchOptions(description))

  if (isPending) return <MovieGridSkeleton />
  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />

  if (data.status === 'unavailable') {
    return (
      <EmptyState icon={<Sparkles />} title={data.message}>
        La recherche par description arrive. En attendant, le mode Classique trouve les films par leur titre.
      </EmptyState>
    )
  }

  if (data.movies.length === 0) {
    return (
      <EmptyState icon={<SearchX />} title="Aucun film trouvé">
        Essaie d'ajouter des détails : une scène, un acteur, une époque…
      </EmptyState>
    )
  }

  return (
    <section aria-label="Résultats de la recherche">
      <MovieGrid movies={data.movies} />
    </section>
  )
}
