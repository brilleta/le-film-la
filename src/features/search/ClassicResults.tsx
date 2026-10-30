import { useQuery } from '@tanstack/react-query'
import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { searchMoviesOptions } from '@/lib/tmdb/queries'
import { cn } from '@/lib/utils'
import { MovieGrid, MovieGridSkeleton } from './MovieGrid'

export function ClassicResults({ query }: { query: string }) {
  const { data, error, isPending, isPlaceholderData, refetch } = useQuery(searchMoviesOptions(query))

  if (isPending) return <MovieGridSkeleton />
  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />

  if (data.results.length === 0) {
    return (
      <EmptyState icon={<SearchX />} title="Aucun film trouvé">
        Rien pour « {query} ». Vérifie l'orthographe, ou décris le film en mode IA.
      </EmptyState>
    )
  }

  return (
    <section
      aria-label="Résultats de la recherche"
      aria-busy={isPlaceholderData}
      className={cn('space-y-4 transition-opacity', isPlaceholderData && 'opacity-60')}
    >
      <p role="status" className="text-sm text-muted-foreground">
        {resultsLabel(data.total_results, data.results.length)}
      </p>
      <MovieGrid movies={data.results} />
    </section>
  )
}

function resultsLabel(total: number, shown: number) {
  if (total === 1) return '1 film trouvé'
  if (total === shown) return `${total} films trouvés`
  return `${total} films trouvés, voici les ${shown} premiers`
}
