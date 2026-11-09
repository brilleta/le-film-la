import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  field: AnyFieldApi
  label: string
  type?: 'text' | 'email' | 'password'
  autoComplete: string
}

export function FormField({ field, label, type = 'text', autoComplete }: FormFieldProps) {
  const { isTouched, errors } = field.state.meta
  const error = isTouched ? fieldErrorMessage(errors[0]) : null
  const errorId = `${field.name}-error`

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        autoComplete={autoComplete}
        value={field.state.value as string}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-10"
      />
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/** Les validateurs Zod renvoient des issues `{ message }`. */
function fieldErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return null
}
