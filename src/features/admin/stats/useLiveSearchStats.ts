import { queryOptions, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ApiError, apiFetch } from '@/lib/api'
import type { SearchStats } from './types'

/**
 * - `connecting` : flux en cours d'ouverture (ou reconnexion automatique d'EventSource)
 * - `live` : snapshots reçus en direct par SSE
 * - `warming` : le back répond, mais Kafka Streams démarre encore (après un réveil de Render)
 * - `polling` : le flux n'a rien livré, repli sur une lecture périodique
 */
export type LiveStatus = 'connecting' | 'live' | 'warming' | 'polling'

/** Sans événement dans ce délai (proxy qui met le flux en tampon, EventSource refusé…), on passe en lecture périodique. */
const SSE_FALLBACK_MS = 8000
const POLL_INTERVAL_MS = 5000

export const searchStatsOptions = (minutes: number) =>
  queryOptions({
    queryKey: ['admin', 'stats', minutes],
    queryFn: ({ signal }) => apiFetch<SearchStats>(`/api/admin/stats?minutes=${minutes}`, { signal }),
    staleTime: 0,
    // Relu de toute façon toutes les 5 s : inutile de réessayer entre deux lectures
    retry: false,
  })

function isWarmingError(error: unknown) {
  return error instanceof ApiError && error.code === 'STATS_UNAVAILABLE'
}

interface StreamState {
  /** Profondeur du flux qui a produit cet état : un état d'un flux précédent est ignoré. */
  minutes: number
  status: LiveStatus
  stats: SearchStats | null
}

const sseSupported = typeof EventSource !== 'undefined'

export function useLiveSearchStats(minutes: number) {
  const [stream, setStream] = useState<StreamState>({ minutes, status: 'connecting', stats: null })

  useEffect(() => {
    if (!sseSupported) return
    const update = (status: LiveStatus, stats?: SearchStats) =>
      setStream((previous) => ({
        minutes,
        status,
        stats: stats ?? (previous.minutes === minutes ? previous.stats : null),
      }))

    const source = new EventSource(`/api/admin/stats/stream?minutes=${minutes}`)
    let received = false
    const fallback = setTimeout(() => {
      if (!received) {
        source.close()
        update('polling')
      }
    }, SSE_FALLBACK_MS)

    source.addEventListener('stats', (event) => {
      received = true
      update('live', JSON.parse(event.data) as SearchStats)
    })
    source.addEventListener('unavailable', () => {
      received = true
      update('warming')
    })
    source.onerror = () => {
      // CLOSED : refus définitif (401, 403, mauvais type de contenu) ; sinon EventSource se reconnecte seul
      if (source.readyState === EventSource.CLOSED) {
        clearTimeout(fallback)
        update('polling')
      } else {
        update('connecting')
      }
    }

    return () => {
      clearTimeout(fallback)
      source.close()
    }
  }, [minutes])

  const current = stream.minutes === minutes
  const streamStatus: LiveStatus = !sseSupported ? 'polling' : current ? stream.status : 'connecting'
  const polling = streamStatus === 'polling'
  // En lecture périodique, un 401 passe par le QueryCache global (retour au login)
  const polled = useQuery({ ...searchStatsOptions(minutes), enabled: polling, refetchInterval: polling ? POLL_INTERVAL_MS : false })

  const streamed = current ? stream.stats : null
  const stats = polling ? (polled.data ?? streamed) : streamed
  const status: LiveStatus = polling && isWarmingError(polled.error) ? 'warming' : streamStatus
  const error = polling && !isWarmingError(polled.error) ? polled.error : null

  return { stats, status, error, refetch: polled.refetch }
}
