import { useQuery } from '@tanstack/react-query'
import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { searchMediaOptions } from '@/lib/api'
import { cn } from '@/lib/utils'
import { MediaGrid, MediaGridSkeleton } from './MediaGrid'
import { mediaListKey } from './mediaKey'
import { ResultsTransition } from './ResultsTransition'

export function ClassicResults({ query }: { query: string }) {
  const { data, error, isPending, isPlaceholderData, refetch } = useQuery(searchMediaOptions(query))

  if (isPending) {
    return (
      <ResultsTransition stateKey="pending">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <MediaGridSkeleton />
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

  if (data.results.length === 0) {
    return (
      <ResultsTransition stateKey={`empty-${query}`}>
        <EmptyState icon={<SearchX />} title="Aucun résultat">
          Rien pour « {query} ». Vérifie l'orthographe, ou décris ce que tu cherches en mode IA.
        </EmptyState>
      </ResultsTransition>
    )
  }

  return (
    <ResultsTransition stateKey={mediaListKey(data.results)}>
      <section
        aria-label="Résultats de la recherche"
        aria-busy={isPlaceholderData}
        className={cn('space-y-4 transition-opacity', isPlaceholderData && 'opacity-60')}
      >
        <p role="status" className="text-sm text-muted-foreground">
          {resultsLabel(data)}
        </p>
        <MediaGrid results={data.results} />
      </section>
    </ResultsTransition>
  )
}

function resultsLabel({ results, total_pages, total_results }: { results: unknown[]; total_pages: number; total_results: number }) {
  const shown = results.length
  if (total_pages <= 1) return shown === 1 ? '1 résultat' : `${shown} résultats`
  // Le total de TMDB compte aussi les personnes, filtrées de l'affichage : il n'est qu'approximatif.
  return `Environ ${total_results} résultats, voici les ${shown} premiers`
}
