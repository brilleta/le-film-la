import { queryOptions, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { ApiError, apiFetch } from '@/lib/api'
import type { LoginInput, RegisterInput } from './schemas'
import type { User } from './types'

export const currentUserKey = ['auth', 'me'] as const

export const currentUserOptions = () =>
  queryOptions({
    queryKey: currentUserKey,
    queryFn: async ({ signal }) => {
      try {
        return await apiFetch<User>('/api/auth/me', { signal })
      } catch (error) {
        // Non connecté : un état normal, pas une erreur.
        if (error instanceof ApiError && error.status === 401) return null
        throw error
      }
    },
  })

/**
 * Données propres à un compte : supprimées quand l'utilisateur change, pour qu'un autre
 * compte du même navigateur ne les voie pas (la recherche IA est gardée sans limite).
 */
function clearUserScopedQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: ['ai-search'] })
  queryClient.removeQueries({ queryKey: ['admin'] })
}

/** Les mutations d'auth gèrent elles-mêmes leurs 401 (identifiants invalides). */
export const authMutationKey = ['auth'] as const

const postJson = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...authMutationKey, 'login'],
    mutationFn: (input: LoginInput) => postJson<User>('/api/auth/login', input),
    onSuccess: (user) => {
      clearUserScopedQueries(queryClient)
      queryClient.setQueryData(currentUserKey, user)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...authMutationKey, 'register'],
    mutationFn: (input: RegisterInput) => postJson<User>('/api/auth/register', input),
    onSuccess: (user) => {
      clearUserScopedQueries(queryClient)
      queryClient.setQueryData(currentUserKey, user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationKey: [...authMutationKey, 'logout'],
    mutationFn: () => apiFetch<void>('/api/auth/logout', { method: 'POST' }),
    onSuccess: async () => {
      clearUserScopedQueries(queryClient)
      queryClient.setQueryData(currentUserKey, null)
      const onProtectedPage = router.state.matches.some((match) => match.routeId.startsWith('/_authenticated'))
      if (onProtectedPage) await router.navigate({ to: '/', search: { q: '', mode: 'classic' } })
    },
  })
}

/** Message affichable pour une erreur de login ou register. */
export function authErrorMessage(error: unknown, kind: 'login' | 'register') {
  if (!(error instanceof ApiError)) return 'Impossible de joindre le service. Vérifie ta connexion.'
  if (error.status === 429) return 'Trop de tentatives. Réessaie dans quelques minutes.'
  if (error.status === 401 && kind === 'login') return 'Email ou mot de passe incorrect.'
  return error.message
}
