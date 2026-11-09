import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

/** Pages de connexion : un utilisateur déjà connecté n'a rien à y faire. */
export const Route = createFileRoute('/_guest')({
  beforeLoad: async ({ context }) => {
    if (await context.auth.ensureUser()) {
      throw redirect({ to: '/', search: { q: '', mode: 'classic' }, replace: true })
    }
  },
  component: Outlet,
})
