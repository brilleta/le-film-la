import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCount, formatMinute } from './format'
import { modeMeta } from './modes'
import type { TimelinePoint } from './types'

const chartConfig = {
  classic: { label: 'Classique', color: modeMeta.CLASSIC.color },
  ai: { label: 'IA', color: modeMeta.AI.color },
} satisfies ChartConfig

/** Requêtes envoyées par minute (frappes intermédiaires comprises), une ligne par mode ; une table masquée donne les mêmes chiffres aux lecteurs d'écran. */
export function TimelineChart({ timeline }: { timeline: TimelinePoint[] }) {
  return (
    <figure className="glass space-y-3 rounded-2xl p-4">
      <figcaption className="font-heading text-lg font-semibold">Requêtes par minute</figcaption>
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full" aria-hidden="true">
        <LineChart data={timeline} margin={{ top: 8, right: 12, bottom: 0, left: -12 }} accessibilityLayer>
          <CartesianGrid vertical={false} strokeOpacity={0.15} />
          <XAxis
            dataKey="start"
            tickFormatter={formatMinute}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            tickMargin={8}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} tickFormatter={formatCount} />
          <ChartTooltip
            cursor={{ strokeOpacity: 0.3 }}
            content={<ChartTooltipContent labelFormatter={(_, payload) => formatMinute(payload[0]?.payload.start)} />}
          />
          {/* Même ordre que les tuiles : classique puis IA (Recharts trie par défaut sur la clé) */}
          <ChartLegend content={<ChartLegendContent />} itemSorter={(item) => (item.dataKey === 'classic' ? 0 : 1)} />
          {/* Pas d'animation : le graphique est redessiné toutes les 2 s */}
          <Line dataKey="classic" type="linear" stroke="var(--color-classic)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          <Line dataKey="ai" type="linear" stroke="var(--color-ai)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
        </LineChart>
      </ChartContainer>
      <table className="sr-only">
        <caption>Requêtes par minute</caption>
        <thead>
          <tr>
            <th scope="col">Minute</th>
            <th scope="col">Classique</th>
            <th scope="col">IA</th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((point) => (
            <tr key={point.start}>
              <th scope="row">{formatMinute(point.start)}</th>
              <td>{point.classic}</td>
              <td>{point.ai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
