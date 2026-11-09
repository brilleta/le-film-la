import { createFileRoute, redirect, stripSearchParams } from '@tanstack/react-router'
import { AdminPage } from '@/features/admin/AdminPage'
import { adminSearchDefaults, adminSearchSchema } from '@/features/admin/searchParams'

export const Route = createFileRoute('/_authenticated/admin')({
  validateSearch: adminSearchSchema,
  search: { middlewares: [stripSearchParams(adminSearchDefaults)] },
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'ADMIN') {
      throw redirect({ to: '/', search: { q: '', mode: 'classic' }, replace: true })
    }
  },
  component: AdminPage,
})
