const STORAGE_KEY = 'search-session'

/** Repli si le stockage est indisponible (navigation privée stricte, cookies bloqués) : un identifiant par chargement. */
let fallbackId: string | null = null

function newId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Identifiant aléatoire de l'onglet (sessionStorage : un par onglet, oublié à sa fermeture), sans lien avec le compte.
 * Le back s'en sert seulement pour regrouper les frappes successives d'une même recherche dans ses statistiques.
 */
function searchSessionId() {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const created = newId()
    sessionStorage.setItem(STORAGE_KEY, created)
    return created
  } catch {
    fallbackId ??= newId()
    return fallbackId
  }
}

/** Header à joindre aux recherches (classique et IA). */
export const searchSessionHeaders = () => ({ 'X-Search-Session': searchSessionId() })
