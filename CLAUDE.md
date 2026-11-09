# le-film-la (front)

Appli de recherche de films et séries avec deux modes : classique et IA (description approximative).
Titre accueil : "Mais Si ! Le film là !" — slogan : "Décris-le mal, on le trouve quand même."
Le back Spring Boot est dans un repo séparé. Déploiement : Docker (nginx) sur Coolify.

## Stack
- Vite + React + TypeScript strict, pnpm
- Tailwind + shadcn/ui, Motion (`motion/react`)
- TanStack Router (file-based, search params validés par Zod), TanStack Query, TanStack Form (+ Zod)

## Commandes
- `pnpm dev` (proxy `/api` → `http://localhost:8080`) / `pnpm build` / `pnpm lint`
- `docker build` + variable `BACKEND_URL` pour tester l'image nginx

## Structure
- `src/routes/` : routes TanStack Router (ne jamais modifier `routeTree.gen.ts`, il est généré)
- `src/components/ui/` : composants shadcn (ne pas réécrire, ajouter via la CLI shadcn)
- `src/components/` : composants partagés ; `src/features/` : composants et logique par fonctionnalité (`search`, `media`)
- `src/lib/api.ts` : client typé du back + `queryOptions` (CSRF géré dans `apiFetch`)
- `src/features/auth/` : query `/me`, mutations login/register/logout, schémas Zod, formulaires, gestion des 401
- `src/lib/tmdb/` : types du JSON TMDB relayé tel quel par le back, conversion vers `MediaSummary`/`MediaDetails`, URLs d'images
- `src/lib/motion.ts` : variantes et durées d'animation partagées
- `src/services/aiSearch.ts` : recherche IA (appel `POST /api/ai/search`)
- `nginx/` : conf nginx (template avec `BACKEND_URL`)

## Contrat d'API du back
- `GET /api/movies/search?q=` / `GET /api/movies/{type}/{id}` (type = `movie` | `tv`) / `GET /api/trending`
- `POST /api/ai/search` `{ "description" }` → `{ "results": [{ "tmdbId", "type", "title", "year", "posterPath", "voteAverage", "reason" }] }`
- Erreurs : `{ "error", "message" }` (dont dépassement de la limite de requêtes)
- Auth (JWT en cookie httpOnly, jamais lu par le front) :
  - `POST /api/auth/register` `{ email, username, password }` → 201 + utilisateur ; `POST /api/auth/login` `{ email, password }` → 200 + utilisateur
  - `POST /api/auth/logout` → 204 sans corps ; `GET /api/auth/me` → `{ id, email, username }` ou 401 (= non connecté)
  - Règles : email valide, pseudo 3-30 caractères, mot de passe 8 minimum ; 429 si trop de tentatives
- Aucun appel direct à TMDB ni aucune clé dans le front ; seules les images viennent de image.tmdb.org

## Auth et CSRF
- `apiFetch` envoie les cookies (same-origin) et, sur POST/PUT/PATCH/DELETE, relit le cookie `XSRF-TOKEN` à chaque requête pour le mettre dans `X-XSRF-TOKEN` (le jeton change après login/register/logout : ne jamais le garder en mémoire). Ne jamais ajouter ce header au cas par cas.
- Utilisateur courant = query `currentUserOptions()` (`['auth', 'me']`, `null` si déconnecté). Login/register font `setQueryData` avec l'utilisateur renvoyé, logout le met à `null`.
- Un 401 hors mutations d'auth (clé `['auth', …]`) remet l'utilisateur à `null` et redirige vers `/login?redirect=…` (`QueryCache`/`MutationCache` dans `src/router.ts`).
- Contexte du routeur : `{ queryClient, auth }` ; `auth.ensureUser()` attend `/me` (pas de redirection prématurée).
- Routes protégées : sous `src/routes/_authenticated/` (le layout redirige vers `/login?redirect=<href>` et ajoute `user` au contexte). `/login` et `/register` sont sous `_guest/` (déjà connecté → accueil).
- Le search param `redirect` n'accepte que des chemins internes (`redirectSearchSchema`).

## Conventions
- Toujours passer par les composants shadcn existants avant d'en créer
- Toutes les requêtes via TanStack Query et les `queryOptions` de `src/lib/api.ts`
- État de recherche (`q`, `mode`) dans l'URL, pas dans un state local
- Thème sombre ciné + glassmorphism ; animations via `src/lib/motion.ts`, respecter `prefers-reduced-motion`
- Mention et logo TMDB en footer
- Nommage : composants en PascalCase, hooks en `useXxx`, pas de `any`

## Façon de travailler (économiser le contexte)
- Ne lire que les fichiers nécessaires à la tâche ; pas d'exploration globale sans raison
- Ne jamais ouvrir `node_modules`, `dist`, `pnpm-lock.yaml` ni `routeTree.gen.ts`
- Modifications ciblées, pas de réécriture de fichier entier pour un petit changement
- Pas de refactor ni de fonctionnalité non demandés ; proposer plutôt que faire
- Réponses courtes : résumé des changements, sans recopier le code
- Lancer `pnpm build` et `pnpm lint` une fois à la fin d'une étape, pas après chaque micro-modif
- Si une demande est ambiguë, poser une question plutôt que deviner
