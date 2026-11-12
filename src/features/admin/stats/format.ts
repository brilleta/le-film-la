const percent = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 0 })
const integer = new Intl.NumberFormat('fr-FR')
const seconds = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })
const minuteFormat = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

export const formatPercent = (ratio: number) => percent.format(ratio)
export const formatCount = (value: number) => integer.format(value)
export const formatLatency = (ms: number) => (ms >= 1000 ? `${seconds.format(ms / 1000)} s` : `${integer.format(ms)} ms`)
export const formatMinute = (iso: string) => minuteFormat.format(new Date(iso))
