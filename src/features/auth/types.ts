export type Role = 'USER' | 'ADMIN'

export type AiAccess = 'NONE' | 'PENDING' | 'GRANTED' | 'REJECTED'

export interface User {
  id: string
  email: string
  username: string
  role: Role
  aiAccess: AiAccess
}

/** Exposé dans le contexte du routeur pour les gardes de route. */
export interface AuthContext {
  /** Utilisateur courant, depuis le cache ou `/api/auth/me` s'il n'a jamais été chargé. */
  ensureUser: () => Promise<User | null>
}
