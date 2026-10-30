import { QueryClient } from '@tanstack/react-query'
import { createRouter, parseSearchWith, stringifySearchWith } from '@tanstack/react-router'
import { TmdbError } from '@/lib/tmdb/client'
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) =>
        failureCount < 2 && (!(error instanceof TmdbError) || error.isRetryable),
    },
  },
})

const keepRawValue = (value: string) => value

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
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
}
