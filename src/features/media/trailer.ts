import type { Video } from '@/lib/tmdb/types'

const score = (video: Video) =>
  (video.type === 'Trailer' ? 4 : 0) + (video.iso_639_1 === 'fr' ? 2 : 0) + (video.official ? 1 : 0)

/** Meilleure vidéo à afficher : une bande-annonce plutôt qu'un teaser, en français de préférence. */
export function pickTrailer(videos: Video[]): Video | undefined {
  return videos
    .filter((video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
    .toSorted((a, b) => score(b) - score(a))[0]
}
