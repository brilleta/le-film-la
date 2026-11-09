import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { currentUserKey, currentUserOptions } from '@/features/auth/authQueries'
import { ApiError, apiFetch } from '@/lib/api'

export type AiAccessState = 'loading' | 'anonymous' | 'none' | 'pending' | 'rejected' | 'granted'

/** Seul `aiAccess === 'GRANTED'` ouvre la recherche IA, rôle admin compris. */
export function useAiAccess(): AiAccessState {
  const { data: user, isPending } = useQuery(currentUserOptions())
  if (isPending) return 'loading'
  if (!user) return 'anonymous'
  switch (user.aiAccess) {
    case 'GRANTED':
      return 'granted'
    case 'PENDING':
      return 'pending'
    case 'REJECTED':
      return 'rejected'
    case 'NONE':
      return 'none'
  }
}

export function useRequestAiAccess() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiFetch<unknown>('/api/ai/access-request', { method: 'POST' }),
    // 409 : déjà en attente ou accordé, `/me` était simplement en retard.
    onSettled: () => queryClient.invalidateQueries({ queryKey: currentUserKey }),
  })
}

export function requestAccessErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 409) return null
  if (error instanceof ApiError && error.status === 429) return 'Doucement ! Réessaie dans quelques minutes.'
  return error instanceof ApiError ? error.message : 'Impossible de joindre le service. Vérifie ta connexion.'
}
