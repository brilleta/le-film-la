import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { FormError } from './AuthCard'
import { authErrorMessage, useLogin } from './authQueries'
import { FormField } from './FormField'
import { loginSchema } from './schemas'

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const login = useLogin()
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onBlur: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await login.mutateAsync(value).then(onSuccess, () => {})
    },
  })

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FormError message={login.isError ? authErrorMessage(login.error, 'login') : null} />
      <form.Field name="email">
        {(field) => <FormField field={field} label="Email" type="email" autoComplete="email" />}
      </form.Field>
      <form.Field name="password">
        {(field) => <FormField field={field} label="Mot de passe" type="password" autoComplete="current-password" />}
      </form.Field>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" size="lg" className="mt-2 h-10" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
