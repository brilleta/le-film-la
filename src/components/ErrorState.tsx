import { Copy, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ApiError, errorReference } from '@/lib/api'

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof ApiError ? error.message : 'Vérifie ta connexion et réessaie.'
  const reference = errorReference(error)

  return (
    <div
      role="alert"
      className="glass animate-fade-up mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl p-8 text-center"
    >
      <TriangleAlert className="size-8 text-destructive" aria-hidden="true" />
      <h2 className="font-heading text-lg font-semibold">Une erreur est survenue</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      {reference && <ErrorReference reference={reference} />}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  )
}

/** Identifiant de trace du back, abrégé à l'écran et copié en entier (c'est lui qu'on cherche dans Grafana). */
function ErrorReference({ reference }: { reference: string }) {
  const copy = () =>
    navigator.clipboard.writeText(reference).then(
      () => toast.success('Référence copiée'),
      () => toast.error('Copie impossible : sélectionne la référence à la main.'),
    )

  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      Référence :{' '}
      <code className="select-all font-mono" title={reference}>
        {reference.slice(0, 8)}
      </code>
      <Button variant="ghost" size="icon-xs" onClick={() => void copy()} aria-label="Copier la référence complète">
        <Copy className="size-3.5" aria-hidden="true" />
      </Button>
    </p>
  )
}
