import { useQuery } from '@tanstack/react-query'
import { SearchX, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { aiSearchOptions } from '@/services/ai-search'
import { MovieGrid, MovieGridSkeleton } from './MovieGrid'
import { moviesKey } from './moviesKey'
import { ResultsTransition } from './ResultsTransition'

export function AiResults({ description }: { description: string }) {
  const { data, error, isPending, refetch } = useQuery(aiSearchOptions(description))

  if (isPending) {
    return (
      <ResultsTransition stateKey="pending">
        <MovieGridSkeleton />
      </ResultsTransition>
    )
  }

  if (error) {
    return (
      <ResultsTransition stateKey="error">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </ResultsTransition>
    )
  }

  if (data.status === 'unavailable') {
    return (
      <ResultsTransition stateKey="unavailable">
        <EmptyState icon={<Sparkles />} title={data.message}>
          La recherche par description arrive. En attendant, le mode Classique trouve les films par leur titre.
        </EmptyState>
      </ResultsTransition>
    )
  }

  if (data.movies.length === 0) {
    return (
      <ResultsTransition stateKey={`empty-${description}`}>
        <EmptyState icon={<SearchX />} title="Aucun film trouvé">
          Essaie d'ajouter des détails : une scène, un acteur, une époque…
        </EmptyState>
      </ResultsTransition>
    )
  }

  return (
    <ResultsTransition stateKey={moviesKey(data.movies)}>
      <section aria-label="Résultats de la recherche">
        <MovieGrid movies={data.movies} />
      </section>
    </ResultsTransition>
  )
}
