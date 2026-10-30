const BASE_URL = 'https://api.themoviedb.org/3'

export class TmdbError extends Error {
  /** Statut HTTP, ou `null` si la requête n'a pas pu partir (token absent). */
  readonly status: number | null

  constructor(message: string, status: number | null) {
    super(message)
    this.name = 'TmdbError'
    this.status = status
  }

  get isRetryable() {
    return this.status !== null && this.status >= 500
  }
}

interface RequestOptions {
  params?: Record<string, string>
  signal?: AbortSignal
}

export async function tmdbFetch<T>(path: string, { params, signal }: RequestOptions = {}): Promise<T> {
  const token = import.meta.env.VITE_TMDB_TOKEN
  if (!token) {
    throw new TmdbError('Le token TMDB est manquant : renseigne VITE_TMDB_TOKEN dans le fichier .env.', null)
  }

  const url = new URL(`${BASE_URL}${path}`)
  url.search = new URLSearchParams({ language: 'fr-FR', ...params }).toString()

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new TmdbError(errorMessage(response.status), response.status)
  }

  return response.json() as Promise<T>
}

function errorMessage(status: number) {
  if (status === 401) return 'TMDB refuse le token : vérifie VITE_TMDB_TOKEN.'
  if (status === 404) return 'Ce film est introuvable.'
  if (status === 429) return 'Trop de requêtes envoyées à TMDB. Réessaie dans un instant.'
  return 'TMDB ne répond pas correctement. Réessaie dans un instant.'
}
