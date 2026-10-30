import type { MediaSummary } from '@/lib/tmdb/types'

/** Un film et une série peuvent porter le même id : le type fait partie de l'identité. */
export const mediaKey = ({ mediaType, id }: MediaSummary) => `${mediaType}-${id}`

/** Identifie une liste de résultats : la grille ne se rejoue que si les résultats changent. */
export const mediaListKey = (results: MediaSummary[]) => results.map(mediaKey).join('_')
