import { Badge } from '@/components/ui/badge'
import type { AiAccess } from '@/features/auth/types'
import { cn } from '@/lib/utils'
import { aiAccessLabels } from './searchParams'

const styles: Record<AiAccess, string> = {
  PENDING: 'bg-primary/15 text-primary',
  GRANTED: 'bg-emerald-500/15 text-emerald-400',
  REJECTED: 'bg-destructive/15 text-destructive',
  NONE: 'bg-muted text-muted-foreground',
}

export function AiAccessBadge({ status }: { status: AiAccess }) {
  return <Badge className={cn('border-transparent', styles[status])}>{aiAccessLabels[status]}</Badge>
}
