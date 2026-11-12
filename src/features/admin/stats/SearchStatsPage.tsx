import { getRouteApi } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { pageItemVariants } from '@/lib/motion'
import { AdminNav } from '../AdminNav'
import { LiveIndicator } from './LiveIndicator'
import { ModeSummary } from './ModeSummary'
import { MODES, modeMeta } from './modes'
import { RankedList } from './RankedList'
import { STATS_WINDOWS } from './searchParams'
import { TimelineChart } from './TimelineChart'
import { useLiveSearchStats } from './useLiveSearchStats'

const route = getRouteApi('/_authenticated/admin_/stats')

const windowLabels: Record<(typeof STATS_WINDOWS)[number], string> = { 5: '5 min', 15: '15 min', 60: '1 h' }

export function SearchStatsPage() {
  const { minutes } = route.useSearch()
  const navigate = route.useNavigate()
  const { stats, status, error, refetch } = useLiveSearchStats(minutes)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <motion.header variants={pageItemVariants} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Statistiques en direct</h1>
          <p className="text-sm text-muted-foreground">
            Ce que les cinéphiles cherchent, calculé par Kafka Streams. Remis à zéro à chaque redémarrage du back.
          </p>
        </div>
        <AdminNav />
      </motion.header>

      <motion.div variants={pageItemVariants} className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={String(minutes)}
          onValueChange={(value) => void navigate({ search: { minutes: Number(value) as (typeof STATS_WINDOWS)[number] }, replace: true })}
        >
          <TabsList className="glass rounded-xl" aria-label="Période">
            {STATS_WINDOWS.map((window) => (
              <TabsTrigger key={window} value={String(window)} className="h-8 rounded-lg px-3">
                {windowLabels[window]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <LiveIndicator status={status} />
      </motion.div>

      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : !stats ? (
        <StatsSkeleton />
      ) : (
        <>
          <motion.div variants={pageItemVariants} className="grid gap-6 md:grid-cols-2">
            {MODES.map((mode) => (
              <ModeSummary key={mode} mode={mode} stats={stats.modes[mode]} />
            ))}
          </motion.div>

          <motion.div variants={pageItemVariants}>
            <TimelineChart timeline={stats.timeline} />
          </motion.div>

          <motion.div variants={pageItemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {MODES.flatMap((mode) => [
              <RankedList
                key={`${mode}-queries`}
                title={mode === 'AI' ? 'Descriptions IA fréquentes' : 'Requêtes fréquentes'}
                items={stats.modes[mode].topQueries}
                color={modeMeta[mode].color}
                emptyLabel="Aucune recherche sur la période."
              />,
              <RankedList
                key={`${mode}-titles`}
                title={mode === 'AI' ? "Titres proposés par l'IA" : 'Titres les plus affichés'}
                items={stats.modes[mode].topTitles}
                color={modeMeta[mode].color}
                emptyLabel="Rien à l'affiche pour l'instant."
              />,
            ])}
          </motion.div>
        </>
      )}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Chargement des statistiques">
      <div className="grid gap-6 md:grid-cols-2">
        {MODES.map((mode) => (
          <div key={mode} className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  )
}
