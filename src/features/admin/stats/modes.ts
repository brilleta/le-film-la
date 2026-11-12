import type { SearchMode } from './types'

/**
 * Identité des deux modes dans tous les graphiques : palette catégorielle validée (contraste, daltonisme)
 * sur la surface sombre de l'appli. Le texte reste dans les couleurs de texte, la couleur marque seulement l'identité.
 */
export const modeMeta: Record<SearchMode, { label: string; color: string; key: 'classic' | 'ai' }> = {
  CLASSIC: { label: 'Recherche classique', color: '#3987e5', key: 'classic' },
  AI: { label: 'Recherche IA', color: '#d95926', key: 'ai' },
}

export const MODES: SearchMode[] = ['CLASSIC', 'AI']
