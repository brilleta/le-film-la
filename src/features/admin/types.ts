import type { AiAccess, Role } from '@/features/auth/types'

export interface AdminUser {
  id: string
  email: string
  username: string
  role: Role
  aiAccess: AiAccess
  createdAt: string
  aiAccessRequestedAt: string | null
  aiAccessDecidedAt: string | null
  /** `null` si la décision vient du système ou si l'admin a été supprimé. */
  aiAccessDecidedBy: { id: string; username: string } | null
}

/** Format maison du back : `page` commence à 0. */
export interface AdminUsersPage {
  content: AdminUser[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type AiAccessAction = 'grant' | 'reject' | 'revoke'

export type AiAccessEventType = 'REQUESTED' | 'GRANTED' | 'REJECTED' | 'REVOKED'

/** Entrée de `GET /api/admin/users/{id}/ai-access/history`, alimentée par Kafka (cohérence à terme). */
export interface AiAccessHistoryEntry {
  eventId: string
  type: AiAccessEventType
  previousStatus: AiAccess
  newStatus: AiAccess
  decidedBy: { id: string; username: string } | null
  occurredAt: string
}
