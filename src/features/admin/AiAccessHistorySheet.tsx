import { useQuery } from '@tanstack/react-query'
import { Check, History, RefreshCw, Send, Undo2, X } from 'lucide-react'
import { motion } from 'motion/react'
import type { ComponentType, SVGProps } from 'react'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { gridItemVariants, resultsVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { aiAccessHistoryOptions, historyIsBehind } from './adminQueries'
import { AiAccessBadge } from './AiAccessBadge'
import type { AdminUser, AiAccessEventType, AiAccessHistoryEntry } from './types'

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' })

interface EventStyle {
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  dot: string
}

const eventStyles: Record<AiAccessEventType, EventStyle> = {
  REQUESTED: { label: "Demande d'accès", Icon: Send, dot: 'bg-primary/15 text-primary ring-primary/30' },
  GRANTED: { label: 'Accès accordé', Icon: Check, dot: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30' },
  REJECTED: { label: 'Demande refusée', Icon: X, dot: 'bg-destructive/15 text-destructive ring-destructive/30' },
  REVOKED: { label: 'Accès retiré', Icon: Undo2, dot: 'bg-amber-500/15 text-amber-400 ring-amber-500/30' },
}

interface AiAccessHistorySheetProps {
  /** `null` : panneau fermé. */
  user: AdminUser | null
  onClose: () => void
}

export function AiAccessHistorySheet({ user, onClose }: AiAccessHistorySheetProps) {
  return (
    <Sheet open={user !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="glass w-full gap-0 overflow-y-auto border-l-white/10 sm:max-w-md">
        {user && <HistoryPanel user={user} />}
      </SheetContent>
    </Sheet>
  )
}

function HistoryPanel({ user }: { user: AdminUser }) {
  const history = useQuery(aiAccessHistoryOptions(user))
  const catchingUp = history.isSuccess && historyIsBehind(history.data, user)

  return (
    <>
      <SheetHeader className="pb-2">
        <SheetTitle className="font-heading flex items-center gap-2 text-xl">
          <History className="size-5 text-primary" aria-hidden="true" />
          Historique de {user.username}
        </SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate">{user.email}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            Statut actuel <AiAccessBadge status={user.aiAccess} />
          </span>
        </SheetDescription>
      </SheetHeader>

      <div className="flex items-center justify-between px-4 pb-2 text-xs text-muted-foreground">
        <span aria-live="polite">
          {catchingUp ? 'Synchronisation avec le flux d’événements…' : 'Reconstitué à partir des événements Kafka'}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => void history.refetch()}
          disabled={history.isFetching}
          aria-label="Actualiser l’historique"
        >
          <RefreshCw className={cn(history.isFetching && 'animate-spin')} aria-hidden="true" />
        </Button>
      </div>

      <div className="px-4 pb-6" aria-busy={history.isFetching}>
        {history.isPending ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : history.isError ? (
          <ErrorState error={history.error} onRetry={() => void history.refetch()} />
        ) : history.data.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-muted-foreground">
            {catchingUp
              ? 'Le premier événement arrive…'
              : 'Aucun événement enregistré. Les décisions antérieures à la mise en place de l’historique n’y figurent pas.'}
          </p>
        ) : (
          <Timeline entries={history.data} />
        )}
      </div>
    </>
  )
}

function Timeline({ entries }: { entries: AiAccessHistoryEntry[] }) {
  return (
    <motion.ol
      key={entries[0]?.eventId}
      variants={resultsVariants}
      initial="hidden"
      animate="visible"
      className="relative space-y-6 before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:bg-white/10"
    >
      {entries.map((entry) => {
        const { label, Icon, dot } = eventStyles[entry.type]
        return (
          <motion.li key={entry.eventId} variants={gridItemVariants} className="relative flex gap-3">
            <span
              className={cn('relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-inset [&_svg]:size-4', dot)}
              aria-hidden="true"
            >
              <Icon />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="font-medium leading-tight">
                {label}
                {entry.decidedBy && <span className="font-normal text-muted-foreground"> par {entry.decidedBy.username}</span>}
              </p>
              <time dateTime={entry.occurredAt} className="text-xs text-muted-foreground">
                {dateFormat.format(new Date(entry.occurredAt))}
              </time>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <AiAccessBadge status={entry.previousStatus} />
                <span aria-label="devient">→</span>
                <AiAccessBadge status={entry.newStatus} />
              </p>
            </div>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
