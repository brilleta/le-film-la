export type SearchMode = 'CLASSIC' | 'AI'

export interface Ranked {
  value: string
  count: number
}

export interface ModeStats {
  searches: number
  errors: number
  /** Entre 0 et 1. */
  errorRate: number
  /** Entre 0 et 1. */
  cacheHitRate: number
  avgLatencyMs: number
  maxLatencyMs: number
  topQueries: Ranked[]
  topTitles: Ranked[]
}

export interface TimelinePoint {
  /** Début de la minute (ISO). */
  start: string
  classic: number
  ai: number
}

/** `GET /api/admin/stats` et événement `stats` du flux SSE : agrégats Kafka Streams, remis à zéro à chaque redémarrage du back. */
export interface SearchStats {
  generatedAt: string
  windowMinutes: number
  modes: Record<SearchMode, ModeStats>
  timeline: TimelinePoint[]
}
