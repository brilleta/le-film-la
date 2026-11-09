import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { currentUserKey } from '@/features/auth/authQueries'
import { ApiError, apiFetch } from '@/lib/api'
import type { AdminSearch } from './searchParams'
import type { AdminUser, AdminUsersPage, AiAccessAction } from './types'

export const PAGE_SIZE = 20

const adminUsersKey = ['admin', 'users'] as const

function usersUrl(params: Record<string, string | number>) {
  return `/api/admin/users?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))}`
}

export const adminUsersOptions = ({ status, q, page }: AdminSearch) =>
  queryOptions({
    queryKey: [...adminUsersKey, 'list', { status, q, page }],
    queryFn: ({ signal }) =>
      apiFetch<AdminUsersPage>(
        usersUrl({
          ...(status === 'ALL' ? {} : { aiAccess: status }),
          ...(q.trim() ? { q: q.trim() } : {}),
          page,
          size: PAGE_SIZE,
        }),
        { signal },
      ),
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

export const pendingCountOptions = () =>
  queryOptions({
    queryKey: [...adminUsersKey, 'pending-count'],
    queryFn: async ({ signal }) =>
      (await apiFetch<AdminUsersPage>(usersUrl({ aiAccess: 'PENDING', size: 1 }), { signal })).totalElements,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })

const successMessages: Record<AiAccessAction, (username: string) => string> = {
  grant: (username) => `Accès accordé à ${username}. Bonne séance !`,
  reject: (username) => `Demande de ${username} refusée.`,
  revoke: (username) => `Accès retiré à ${username}.`,
}

export function useAiAccessAction(currentUserId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ user, action }: { user: AdminUser; action: AiAccessAction }) =>
      apiFetch<AdminUser>(`/api/admin/users/${encodeURIComponent(user.id)}/ai-access/${action}`, { method: 'POST' }),
    onSuccess: (updated, { action }) => {
      toast.success(successMessages[action](updated.username))
      if (updated.id === currentUserId) void queryClient.invalidateQueries({ queryKey: currentUserKey })
    },
    onError: (error) => toast.error(actionErrorMessage(error)),
    // La ligne quitte souvent le filtre courant : on recharge la liste et le compteur plutôt que de les deviner.
    onSettled: () => queryClient.invalidateQueries({ queryKey: adminUsersKey }),
  })
}

function actionErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return 'Impossible de joindre le service. Vérifie ta connexion.'
  switch (error.code) {
    case 'CONCURRENT_MODIFICATION':
      return 'Un autre admin est passé par là en même temps. La liste a été rechargée.'
    case 'NOT_FOUND':
      return "Cet utilisateur n'existe plus. La liste a été rechargée."
    default:
      return error.message
  }
}
