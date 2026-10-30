const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

type PosterSize = 'w185' | 'w342' | 'w500'
type BackdropSize = 'w780' | 'w1280'
type ProfileSize = 'w185'

function imageUrl(size: string, path: string | null) {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : undefined
}

export const posterUrl = (path: string | null, size: PosterSize = 'w342') => imageUrl(size, path)
export const backdropUrl = (path: string | null, size: BackdropSize = 'w1280') => imageUrl(size, path)
export const profileUrl = (path: string | null, size: ProfileSize = 'w185') => imageUrl(size, path)
