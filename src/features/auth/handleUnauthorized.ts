import type { QueryClient } from '@tanstack/react-query'
import type { AnyRouter } from '@tanstack/react-router'
import { ApiError } from '@/lib/api'
import { currentUserKey } from './authQueries'

/** Un 401 sur un endpoint protégé : session expirée, retour à la connexion. */
export function handleUnauthorized(error: unknown, queryClient: QueryClient, router: AnyRouter) {
  if (!(error instanceof ApiError) || error.status !== 401) return
  queryClient.setQueryData(currentUserKey, null)
  const { pathname, href } = router.state.location
  if (pathname === '/login' || pathname === '/register') return
  void router.navigate({ to: '/login', search: { redirect: href } })
}
