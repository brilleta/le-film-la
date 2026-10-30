import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  children?: ReactNode
}

export function EmptyState({ icon, title, children }: EmptyStateProps) {
  return (
    <div className="glass animate-fade-up mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl p-8 text-center">
      <span className="text-primary [&_svg]:size-8" aria-hidden="true">
        {icon}
      </span>
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </div>
  )
}
