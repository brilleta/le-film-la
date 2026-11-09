import { createFileRoute, Link } from '@tanstack/react-router'
import { AuthCard } from '@/features/auth/AuthCard'
import { RegisterForm } from '@/features/auth/RegisterForm'
import { redirectSearchSchema } from '@/features/auth/schemas'
import { useAuthRedirect } from '@/features/auth/useAuthRedirect'

export const Route = createFileRoute('/_guest/register')({
  validateSearch: redirectSearchSchema,
  component: RegisterPage,
})

function RegisterPage() {
  const { redirect } = Route.useSearch()
  const goBack = useAuthRedirect(redirect)

  return (
    <AuthCard
      title="Créer un compte"
      description="Pour retrouver tes films d'un appareil à l'autre."
      footer={
        <p>
          Déjà inscrit ?{' '}
          <Link to="/login" search={{ redirect }} className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      }
    >
      <RegisterForm onSuccess={goBack} />
    </AuthCard>
  )
}
