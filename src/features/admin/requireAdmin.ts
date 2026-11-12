import { redirect } from '@tanstack/react-router'
import type { User } from '@/features/auth/types'

/** `beforeLoad` des pages d'administration : un non-admin repart vers l'accueil. */
export function requireAdmin(user: User) {
  if (user.role !== 'ADMIN') {
    throw redirect({ to: '/', search: { q: '', mode: 'classic' }, replace: true })
  }
}
