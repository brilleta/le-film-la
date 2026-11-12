import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { requireAdmin } from '@/features/admin/requireAdmin'
import { SearchStatsPage } from '@/features/admin/stats/SearchStatsPage'
import { statsSearchDefaults, statsSearchSchema } from '@/features/admin/stats/searchParams'

export const Route = createFileRoute('/_authenticated/admin_/stats')({
  validateSearch: statsSearchSchema,
  search: { middlewares: [stripSearchParams(statsSearchDefaults)] },
  beforeLoad: ({ context }) => requireAdmin(context.user),
  component: SearchStatsPage,
})
