import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api'

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof ApiError ? error.message : 'Vérifie ta connexion et réessaie.'

  return (
    <div
      role="alert"
      className="glass animate-fade-up mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl p-8 text-center"
    >
      <TriangleAlert className="size-8 text-destructive" aria-hidden="true" />
      <h2 className="font-heading text-lg font-semibold">Une erreur est survenue</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  )
}
