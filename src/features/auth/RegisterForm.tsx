import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { FormError } from './AuthCard'
import { authErrorMessage, useRegister } from './authQueries'
import { FormField } from './FormField'
import { registerSchema } from './schemas'

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const register = useRegister()
  const form = useForm({
    defaultValues: { email: '', username: '', password: '' },
    validators: { onBlur: registerSchema, onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      await register.mutateAsync(registerSchema.parse(value)).then(onSuccess, () => {})
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
      <FormError message={register.isError ? authErrorMessage(register.error, 'register') : null} />
      <form.Field name="email">
        {(field) => <FormField field={field} label="Email" type="email" autoComplete="email" />}
      </form.Field>
      <form.Field name="username">
        {(field) => <FormField field={field} label="Pseudo" autoComplete="username" />}
      </form.Field>
      <form.Field name="password">
        {(field) => <FormField field={field} label="Mot de passe" type="password" autoComplete="new-password" />}
      </form.Field>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" size="lg" className="mt-2 h-10" disabled={isSubmitting}>
            {isSubmitting ? 'Création…' : 'Créer mon compte'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
