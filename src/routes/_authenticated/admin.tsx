import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { AdminPage } from '@/features/admin/AdminPage'
import { requireAdmin } from '@/features/admin/requireAdmin'
import { adminSearchDefaults, adminSearchSchema } from '@/features/admin/searchParams'

export const Route = createFileRoute('/_authenticated/admin')({
  validateSearch: adminSearchSchema,
  search: { middlewares: [stripSearchParams(adminSearchDefaults)] },
  beforeLoad: ({ context }) => requireAdmin(context.user),
  component: AdminPage,
})
