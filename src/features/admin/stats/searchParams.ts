import { z } from 'zod'

export const STATS_WINDOWS = [5, 15, 60] as const

export const statsSearchDefaults = { minutes: 15 } as const

export const statsSearchSchema = z.object({
  minutes: z.coerce
    .number()
    .refine((value): value is (typeof STATS_WINDOWS)[number] => (STATS_WINDOWS as readonly number[]).includes(value))
    .catch(statsSearchDefaults.minutes),
})

export type StatsSearch = z.output<typeof statsSearchSchema>
