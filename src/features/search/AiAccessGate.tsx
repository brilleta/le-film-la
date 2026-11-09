import { Link, useLocation } from '@tanstack/react-router'
import { Clock, Lock, LogIn, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { requestAccessErrorMessage, useRequestAiAccess, type AiAccessState } from './aiAccess'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 } }

/** Remplace la saisie du mode IA tant que l'accès n'est pas accordé. */
export function AiAccessGate({ state }: { state: Exclude<AiAccessState, 'granted'> }) {
  if (state === 'loading') {
    return <Skeleton className="min-h-28 flex-1 rounded-xl" aria-hidden="true" />
  }

  return (
    <motion.div
      key={state}
      initial={fade.initial}
      animate={fade.animate}
      role="status"
      className="flex min-h-28 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 bg-background/30 px-4 py-5 text-center"
    >
      {state === 'anonymous' && <AnonymousGate />}
      {state === 'none' && <RequestGate />}
      {state === 'rejected' && <RejectedGate />}
      {state === 'pending' && <PendingGate />}
    </motion.div>
  )
}

function GateMessage({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <>
      <span className="text-primary [&_svg]:size-6" aria-hidden="true">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="font-heading font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </>
  )
}

function AnonymousGate() {
  const { href } = useLocation()
  return (
    <>
      <GateMessage icon={<Lock />} title="L'IA devine les films, pas qui tu es.">
        Connecte-toi pour décrire ton film n'importe comment.
      </GateMessage>
      <Button asChild>
        <Link to="/login" search={{ redirect: href }}>
          <LogIn aria-hidden="true" />
          Se connecter
        </Link>
      </Button>
    </>
  )
}

function RequestGate() {
  return (
    <>
      <GateMessage icon={<Sparkles />} title="L'IA est en avant-première privée.">
        Demande ton ticket, un admin le tamponne dès que possible.
      </GateMessage>
      <RequestButton label="Demander l'accès" />
    </>
  )
}

function RejectedGate() {
  return (
    <>
      <GateMessage icon={<Lock />} title="Recalé au casting… pour cette fois.">
        Ta demande a été refusée. Rien n'empêche de retenter ta chance.
      </GateMessage>
      <RequestButton label="Redemander l'accès" />
    </>
  )
}

function PendingGate() {
  return (
    <GateMessage icon={<Clock className="motion-safe:animate-pulse" />} title="Demande en attente de validation.">
      Le projectionniste cherche ses lunettes. Reviens un peu plus tard !
    </GateMessage>
  )
}

function RequestButton({ label }: { label: string }) {
  const request = useRequestAiAccess()
  const error = request.isError ? requestAccessErrorMessage(request.error) : null

  return (
    <>
      <Button type="button" onClick={() => request.mutate()} disabled={request.isPending}>
        <Sparkles aria-hidden="true" />
        {request.isPending ? 'Envoi…' : label}
      </Button>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </>
  )
}
