import { Loader2, Radio, RefreshCw, Timer } from 'lucide-react'
import type { LiveStatus } from './useLiveSearchStats'

const statusContent: Record<LiveStatus, { label: string; icon: React.ReactNode; className: string }> = {
  live: { label: 'En direct', icon: <Radio aria-hidden="true" />, className: 'text-emerald-300' },
  connecting: { label: 'Connexion…', icon: <Loader2 aria-hidden="true" className="motion-safe:animate-spin" />, className: 'text-muted-foreground' },
  warming: { label: 'Le flux Kafka démarre…', icon: <Timer aria-hidden="true" />, className: 'text-amber-300' },
  polling: { label: 'Mise à jour toutes les 5 s', icon: <RefreshCw aria-hidden="true" />, className: 'text-muted-foreground' },
}

/** État de la connexion : icône + libellé, jamais la couleur seule. */
export function LiveIndicator({ status }: { status: LiveStatus }) {
  const { label, icon, className } = statusContent[status]
  return (
    <p role="status" className={`glass inline-flex h-8 w-fit items-center gap-2 rounded-xl px-3 text-sm font-medium [&_svg]:size-4 ${className}`}>
      {status === 'live' && (
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex size-full rounded-full bg-current opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {status !== 'live' && icon}
      {label}
    </p>
  )
}
