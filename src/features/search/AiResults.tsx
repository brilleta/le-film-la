import { useQuery } from '@tanstack/react-query'
import { SearchX, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { aiSearchOptions } from '@/services/aiSearch'
import { MediaGrid, MediaGridSkeleton } from './MediaGrid'
import { mediaListKey } from './mediaKey'
import { ResultsTransition } from './ResultsTransition'

export function AiResults({ description }: { description: string }) {
  const { data, error, isFetching, isPending, refetch } = useQuery(aiSearchOptions(description))

  // Un nouvel essai après une erreur prend aussi plusieurs secondes : le chargement remplace le message d'erreur.
  if (isPending || (error && isFetching)) {
    return (
      <ResultsTransition stateKey="pending">
        <div className="space-y-4">
          <p role="status" className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary motion-safe:animate-pulse" aria-hidden="true" />
            On cherche ton film, ça peut prendre quelques secondes…
          </p>
          <MediaGridSkeleton count={10} />
        </div>
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

  if (data.length === 0) {
    return (
      <ResultsTransition stateKey={`empty-${description}`}>
        <EmptyState icon={<SearchX />} title="Aucun résultat">
          Essaie d'ajouter des détails : une scène, un acteur, une époque…
        </EmptyState>
      </ResultsTransition>
    )
  }

  return (
    <ResultsTransition stateKey={mediaListKey(data)}>
      <section aria-label="Résultats de la recherche">
        <MediaGrid results={data} />
      </section>
    </ResultsTransition>
  )
}
