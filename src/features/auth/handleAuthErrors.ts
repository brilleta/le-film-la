import type { QueryClient } from '@tanstack/react-query'
import type { AnyRouter } from '@tanstack/react-router'
import { ApiError } from '@/lib/api'
import { currentUserKey } from './authQueries'

/**
 * Erreurs d'auth reçues hors mutations d'auth :
 * - 401 : session expirée, retour à la connexion ;
 * - 403 `AI_ACCESS_REQUIRED` : accès IA retiré entre-temps, `/me` est rechargé pour mettre l'affichage à jour.
 */
export function handleAuthErrors(error: unknown, queryClient: QueryClient, router: AnyRouter) {
  if (!(error instanceof ApiError)) return

  if (error.status === 403 && error.code === 'AI_ACCESS_REQUIRED') {
    void queryClient.invalidateQueries({ queryKey: currentUserKey })
    return
  }

  if (error.status !== 401) return
  queryClient.setQueryData(currentUserKey, null)
  const { pathname, href } = router.state.location
  if (pathname === '/login' || pathname === '/register') return
  void router.navigate({ to: '/login', search: { redirect: href } })
}
