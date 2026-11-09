import { z } from 'zod'

// Mêmes règles que le back.
const email = z.email('Adresse email invalide.')
const password = z.string().min(8, '8 caractères minimum.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Mot de passe requis.'),
})

export const registerSchema = z.object({
  email,
  username: z.string().trim().min(3, '3 caractères minimum.').max(30, '30 caractères maximum.'),
  password,
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

const AUTH_PAGES = ['/login', '/register']

/** N'accepte qu'un chemin interne : pas d'URL absolue, ni `//hote`, ni `/\hote`. */
export function isSafeRedirect(path: string) {
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return false
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f]/.test(path)) return false
  const url = new URL(path, window.location.origin)
  return url.origin === window.location.origin && !AUTH_PAGES.includes(url.pathname)
}

export const redirectSearchSchema = z.object({
  redirect: z
    .string()
    .refine(isSafeRedirect)
    .optional()
    .catch(undefined),
})
