import { z } from 'zod'

export const searchParamsSchema = z.object({
  // Le routeur convertit lui-même ?q=1984 en nombre : on revient à une chaîne.
  q: z.union([z.string(), z.number(), z.boolean()]).transform(String).catch(''),
  mode: z.enum(['classic', 'ai']).catch('classic'),
})

export type SearchMode = z.output<typeof searchParamsSchema>['mode']
