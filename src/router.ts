import { QueryClient } from '@tanstack/react-query'
import { createRouter, parseSearchWith, stringifySearchWith } from '@tanstack/react-router'
import { ApiError } from '@/lib/api'
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) =>
        failureCount < 2 && (!(error instanceof ApiError) || error.isRetryable),
    },
  },
})

const keepRawValue = (value: string) => value

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  // Tous les params sont des chaînes : pas de JSON dans l'URL (?q=alien, pas ?q=%22alien%22).
  parseSearch: parseSearchWith(keepRawValue),
  stringifySearch: stringifySearchWith(JSON.stringify),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface HistoryState {
    /** Affiche de la carte cliquée, déjà en cache : la page détail l'affiche sans attendre son chargement. */
    posterPath?: string | null
  }
}
