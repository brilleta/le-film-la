import { z } from 'zod'
import type { AiAccess } from '@/features/auth/types'

export const aiAccessLabels: Record<AiAccess, string> = {
  PENDING: 'En attente',
  GRANTED: 'Accordé',
  REJECTED: 'Refusé',
  NONE: 'Aucun',
}

export const AI_ACCESS_FILTERS = ['PENDING', 'GRANTED', 'REJECTED', 'NONE', 'ALL'] as const

export type AiAccessFilter = (typeof AI_ACCESS_FILTERS)[number]

export const adminSearchDefaults = { status: 'PENDING', q: '', page: 0 } as const

export const adminSearchSchema = z.object({
  status: z.enum(AI_ACCESS_FILTERS).catch(adminSearchDefaults.status),
  // Le routeur peut convertir ?q=42 en nombre : on revient à une chaîne.
  q: z.union([z.string(), z.number(), z.boolean()]).transform(String).catch(adminSearchDefaults.q),
  page: z.coerce.number().int().min(0).catch(adminSearchDefaults.page),
})

export type AdminSearch = z.output<typeof adminSearchSchema>
