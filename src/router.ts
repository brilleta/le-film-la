import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { createRouter, parseSearchWith, stringifySearchWith } from '@tanstack/react-router'
import { authMutationKey, currentUserOptions } from '@/features/auth/authQueries'
import { handleAuthErrors } from '@/features/auth/handleAuthErrors'
import type { AuthContext } from '@/features/auth/types'
import { ApiError } from '@/lib/api'
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => handleAuthErrors(error, queryClient, router) }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const isAuthMutation = mutation.options.mutationKey?.[0] === authMutationKey[0]
      if (!isAuthMutation) handleAuthErrors(error, queryClient, router)
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) =>
        failureCount < 2 && (!(error instanceof ApiError) || error.isRetryable),
    },
  },
})

const auth: AuthContext = {
  ensureUser: () => queryClient.ensureQueryData({ ...currentUserOptions(), revalidateIfStale: true }),
}

const keepRawValue = (value: string) => value

export const router = createRouter({
  routeTree,
  context: { queryClient, auth },
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
