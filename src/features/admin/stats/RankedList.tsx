import { formatCount } from './format'
import type { Ranked } from './types'

interface RankedListProps {
  title: string
  items: Ranked[]
  color: string
  emptyLabel: string
}

/** Barres horizontales classées, une seule teinte (celle du mode), valeurs écrites en clair. */
export function RankedList({ title, items, color, emptyLabel }: RankedListProps) {
  const max = items[0]?.count ?? 0
  return (
    <section className="glass space-y-3 rounded-2xl p-4">
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="space-y-2">
          {items.map((item) => (
            <li key={item.value} className="space-y-1">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate" title={item.value}>
                  {item.value}
                </span>
                <span className="shrink-0 text-muted-foreground tabular-nums">{formatCount(item.count)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5" aria-hidden="true">
                <div
                  className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${(item.count / max) * 100}%`, backgroundColor: color }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
