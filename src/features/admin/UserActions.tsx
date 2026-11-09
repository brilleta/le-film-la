import { Check, Undo2, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { AdminUser, AiAccessAction } from './types'

interface UserActionsProps {
  user: AdminUser
  isSelf: boolean
  pending: boolean
  onAction: (action: AiAccessAction) => void
}

export function UserActions({ user, isSelf, pending, onAction }: UserActionsProps) {
  // Le back refuse qu'un admin modifie son propre accès (SELF_ACCESS_CHANGE).
  if (isSelf) return <span className="text-xs text-muted-foreground">C'est toi !</span>

  return (
    <div className="flex justify-end gap-1.5">
      {user.aiAccess !== 'GRANTED' && (
        <Button size="sm" disabled={pending} onClick={() => onAction('grant')}>
          <Check aria-hidden="true" />
          Accorder
        </Button>
      )}
      {user.aiAccess === 'PENDING' && (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => onAction('reject')}>
          <X aria-hidden="true" />
          Refuser
        </Button>
      )}
      {user.aiAccess === 'GRANTED' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={pending}>
              <Undo2 aria-hidden="true" />
              Retirer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Retirer l'accès IA à {user.username} ?</AlertDialogTitle>
              <AlertDialogDescription>
                {user.username} ne pourra plus utiliser la recherche IA et devra refaire une demande.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => onAction('revoke')}>
                Retirer l'accès
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
