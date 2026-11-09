export interface User {
  id: number
  email: string
  username: string
}

/** Exposé dans le contexte du routeur pour les gardes de route. */
export interface AuthContext {
  /** Utilisateur courant, depuis le cache ou `/api/auth/me` s'il n'a jamais été chargé. */
  ensureUser: () => Promise<User | null>
}
