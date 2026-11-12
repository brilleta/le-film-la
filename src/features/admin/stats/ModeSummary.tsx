import { formatCount, formatLatency, formatPercent } from './format'
import { modeMeta } from './modes'
import type { ModeStats, SearchMode } from './types'

/** Rangée de tuiles d'un mode : des chiffres clés, pas un graphique. */
export function ModeSummary({ mode, stats }: { mode: SearchMode; stats: ModeStats }) {
  const meta = modeMeta[mode]
  const empty = stats.searches === 0
  const tiles = [
    { label: 'Recherches', value: formatCount(stats.searches), detail: null },
    {
      label: 'Latence moyenne',
      value: empty ? '—' : formatLatency(stats.avgLatencyMs),
      detail: empty ? null : `max ${formatLatency(stats.maxLatencyMs)}`,
    },
    { label: 'Servies par le cache', value: empty ? '—' : formatPercent(stats.cacheHitRate), detail: null },
    {
      label: 'Erreurs',
      value: empty ? '—' : formatPercent(stats.errorRate),
      detail: empty ? null : `${formatCount(stats.errors)} sur ${formatCount(stats.searches)}`,
    },
  ]

  return (
    <section aria-labelledby={`summary-${meta.key}`} className="space-y-3">
      <h2 id={`summary-${meta.key}`} className="flex items-center gap-2 font-heading text-lg font-semibold">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
        {meta.label}
      </h2>
      <dl className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="glass flex flex-col gap-1 rounded-2xl p-4">
            <dt className="text-xs text-muted-foreground">{tile.label}</dt>
            <dd className="font-heading text-2xl font-semibold tabular-nums">{tile.value}</dd>
            {/* Ligne réservée même vide : les tuiles des deux modes restent alignées */}
            <dd className="text-xs text-muted-foreground tabular-nums">{tile.detail ?? '\u00a0'}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
