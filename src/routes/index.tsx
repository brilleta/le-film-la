import { createFileRoute, Link, stripSearchParams } from '@tanstack/react-router'
import { AiResults } from '@/features/search/AiResults'
import { ClassicResults } from '@/features/search/ClassicResults'
import { PosterMosaic } from '@/features/search/PosterMosaic'
import { SearchBar } from '@/features/search/SearchBar'
import { searchParamsSchema } from '@/features/search/searchParams'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  validateSearch: searchParamsSchema,
  search: { middlewares: [stripSearchParams({ q: '' })] },
  component: HomePage,
})

function HomePage() {
  const { q, mode } = Route.useSearch()
  const navigate = Route.useNavigate()
  const query = q.trim()
  const hasQuery = query.length > 0

  return (
    <>
      <PosterMosaic />
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-8 px-4 py-8 transition-all sm:py-10',
          !hasQuery && 'justify-center',
        )}
      >
        <header className={cn('animate-fade-up text-center', !hasQuery && 'mb-2')}>
          <h1
            className={cn(
              'font-heading font-bold tracking-tight text-balance',
              hasQuery ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-6xl lg:text-7xl',
            )}
          >
            {hasQuery ? (
              <Link to="/" search={{ q: '', mode }} className="rounded-md">
                Mais Si ! Le film là !
              </Link>
            ) : (
              'Mais Si ! Le film là !'
            )}
          </h1>
          {!hasQuery && (
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">Décris-le mal, on le trouve quand même.</p>
          )}
        </header>

        <div className="w-full max-w-3xl">
          <SearchBar
            query={q}
            mode={mode}
            onQueryChange={(nextQuery) => {
              void navigate({ search: (prev) => ({ ...prev, q: nextQuery }), replace: true })
            }}
            onModeChange={(nextMode, nextQuery) => {
              void navigate({ search: { q: nextQuery, mode: nextMode } })
            }}
          />
        </div>

        {hasQuery && (
          <div className="w-full">
            {mode === 'classic' ? <ClassicResults query={query} /> : <AiResults description={query} />}
          </div>
        )}
      </div>
    </>
  )
}
