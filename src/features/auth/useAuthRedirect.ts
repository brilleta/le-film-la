import { useRouter } from '@tanstack/react-router'

/** Après connexion : retour à la page d'origine (déjà validée par le schéma de recherche). */
export function useAuthRedirect(redirect: string | undefined) {
  const router = useRouter()
  return () => router.history.push(redirect ?? '/')
}
