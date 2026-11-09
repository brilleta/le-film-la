import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.auth.ensureUser()
    if (!user) {
      throw redirect({ to: '/login', search: { redirect: location.href }, replace: true })
    }
    return { user }
  },
  component: Outlet,
})
