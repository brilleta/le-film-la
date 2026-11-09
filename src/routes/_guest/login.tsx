import { createFileRoute, Link } from '@tanstack/react-router'
import { AuthCard } from '@/features/auth/AuthCard'
import { LoginForm } from '@/features/auth/LoginForm'
import { redirectSearchSchema } from '@/features/auth/schemas'
import { useAuthRedirect } from '@/features/auth/useAuthRedirect'

export const Route = createFileRoute('/_guest/login')({
  validateSearch: redirectSearchSchema,
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()
  const goBack = useAuthRedirect(redirect)

  return (
    <AuthCard
      title="Connexion"
      description="Content de te revoir."
      footer={
        <p>
          Pas encore de compte ?{' '}
          <Link to="/register" search={{ redirect }} className="font-medium text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      }
    >
      <LoginForm onSuccess={goBack} />
    </AuthCard>
  )
}
