# le-film-la (front)

Appli de recherche de films et séries avec deux modes : classique et IA (description approximative).
Titre accueil : "Mais Si ! Le film là !" — slogan : "Décris-le mal, on le trouve quand même."
Le back Spring Boot est dans un repo séparé. Déploiement : Render Static Site (rewrite `/api/*` vers le back) ; voir `render.yaml`. `Dockerfile` et `nginx/` restent pour Coolify ou un test local.

## Stack
- Vite + React + TypeScript strict, pnpm
- Tailwind + shadcn/ui, Motion (`motion/react`)
- TanStack Router (file-based, search params validés par Zod), TanStack Query, TanStack Form (+ Zod), TanStack Table v9 (`useTable` + `tableFeatures`, pas `useReactTable`), toasts `sonner`

## Commandes
- `pnpm dev` (proxy `/api` → `http://localhost:8080`) / `pnpm build` / `pnpm lint`
- `docker build` + variable `BACKEND_URL` pour tester l'image nginx

## Structure
- `src/routes/` : routes TanStack Router (ne jamais modifier `routeTree.gen.ts`, il est généré)
- `src/components/ui/` : composants shadcn (ne pas réécrire, ajouter via la CLI shadcn)
- `src/components/` : composants partagés ; `src/features/` : composants et logique par fonctionnalité (`search`, `media`, `auth`, `admin`)
- `src/lib/api.ts` : client typé du back + `queryOptions` (CSRF géré dans `apiFetch`)
- `src/features/auth/` : query `/me`, mutations login/register/logout, schémas Zod, formulaires, gestion des 401
- `src/lib/tmdb/` : types du JSON TMDB relayé tel quel par le back, conversion vers `MediaSummary`/`MediaDetails`, URLs d'images
- `src/lib/motion.ts` : variantes et durées d'animation partagées
- `src/services/aiSearch.ts` : recherche IA (appel `POST /api/ai/search`)
- `nginx/` : conf nginx (template avec `BACKEND_URL`)

## Contrat d'API du back
- `GET /api/movies/search?q=` / `GET /api/movies/{type}/{id}` (type = `movie` | `tv`) / `GET /api/trending`
- `POST /api/ai/search` `{ "description" }` (connecté + `aiAccess = GRANTED`, sinon 401 ou 403 `AI_ACCESS_REQUIRED`) → `{ "results": [{ "tmdbId", "type", "title", "year", "posterPath", "voteAverage", "reason" }] }`
- Erreurs : `{ "error", "message" }` (dont dépassement de la limite de requêtes)
- Header `X-Trace-Id` sur les réponses : lu par `apiFetch` dans `ApiError.traceId` ; `errorReference()` le renvoie pour les 5xx seulement, affiché comme « Référence » (8 premiers caractères, copie de l'identifiant complet) dans `ErrorState` et les toasts d'erreur des actions admin
- Auth (JWT en cookie httpOnly, jamais lu par le front) :
  - `POST /api/auth/register` `{ email, username, password }` → 201 + utilisateur ; `POST /api/auth/login` `{ email, password }` → 200 + utilisateur
  - `POST /api/auth/logout` → 204 sans corps ; `GET /api/auth/me` → `{ id, email, username, role, aiAccess }` ou 401 (= non connecté)
  - Règles : email valide, pseudo 3-30 caractères, mot de passe 8 minimum ; 429 si trop de tentatives
- Accès IA : `POST /api/ai/access-request` (409 si déjà en attente ou accordé)
- Admin (`role = ADMIN`) :
  - `GET /api/admin/users?aiAccess=&q=&page=&size=` → `{ content: AdminUser[], page, size, totalElements, totalPages }` (`page` à partir de 0, `size` 1-100, 20 par défaut)
  - `POST /api/admin/users/{id}/ai-access/grant|reject|revoke` → 200 + `AdminUser` ; erreurs 404 `NOT_FOUND`, 409 `INVALID_AI_ACCESS_TRANSITION` / `CONCURRENT_MODIFICATION`, 403 `SELF_ACCESS_CHANGE`
  - Compteur des demandes : `?aiAccess=PENDING&size=1` puis `totalElements`
  - `GET /api/admin/users/{id}/ai-access/history` → `[{ eventId, type: 'REQUESTED'|'GRANTED'|'REJECTED'|'REVOKED', previousStatus, newStatus, decidedBy: { id, username } | null, occurredAt }]`, le plus récent d'abord ; 404 `NOT_FOUND`. Alimenté par Kafka côté back : cohérence à terme (quelques ms après une action)
  - `GET /api/admin/stats?minutes=` (1-60) → `SearchStats` (`src/features/admin/stats/types.ts`) : par mode `CLASSIC`/`AI` volume, taux d'erreur et de cache (0-1), latence moyenne/max, top 10 requêtes et titres ; `timeline` minute par minute ; 503 `STATS_UNAVAILABLE` tant que Kafka Streams démarre ; remis à zéro à chaque redémarrage du back
  - `GET /api/admin/stats/stream?minutes=` : SSE (`EventSource`), événement `stats` (même JSON) tout de suite puis toutes les 2 s, `unavailable` pendant le démarrage du flux, fermé après 15 min (reconnexion automatique)
- Aucun appel direct à TMDB ni aucune clé dans le front ; seules les images viennent de image.tmdb.org

## Auth et CSRF
- `apiFetch` envoie les cookies (same-origin) et, sur POST/PUT/PATCH/DELETE, relit le cookie `XSRF-TOKEN` à chaque requête pour le mettre dans `X-XSRF-TOKEN` (le jeton change après login/register/logout : ne jamais le garder en mémoire). Ne jamais ajouter ce header au cas par cas.
- Utilisateur courant = query `currentUserOptions()` (`['auth', 'me']`, `null` si déconnecté). Login/register font `setQueryData` avec l'utilisateur renvoyé, logout le met à `null`.
- Un 401 hors mutations d'auth (clé `['auth', …]`) remet l'utilisateur à `null` et redirige vers `/login?redirect=…` (`QueryCache`/`MutationCache` dans `src/router.ts`).
- Contexte du routeur : `{ queryClient, auth }` ; `auth.ensureUser()` attend `/me` (pas de redirection prématurée).
- Routes protégées : sous `src/routes/_authenticated/` (le layout redirige vers `/login?redirect=<href>` et ajoute `user` au contexte). `/login` et `/register` sont sous `_guest/` (déjà connecté → accueil).
- Statuts IA : `NONE` → (demande) `PENDING` → `GRANTED` (grant) ou `REJECTED` (reject, l'utilisateur peut redemander) ; `revoke` : `GRANTED` → `NONE`. Seul `aiAccess === 'GRANTED'` ouvre la recherche IA (rôle admin compris) : `useAiAccess()` + `AiAccessGate` dans la barre de recherche. Un 403 `AI_ACCESS_REQUIRED` invalide `/me`.
- `/admin` (sous `_authenticated`) : redirige vers l'accueil si `role !== 'ADMIN'` ; filtre `status` (`PENDING` par défaut), `q` et `page` dans les search params ; après une action, invalidation de `['admin', 'users']` (liste + compteur + historiques).
- Historique d'accès IA : `AiAccessHistorySheet` (shadcn `Sheet`, bouton dans la colonne actions), query `['admin', 'users', 'history', userId]`. Tant que `historyIsBehind` (dernière entrée ≠ statut courant), refetch toutes les secondes, 8 fois max : le back écrit l'historique via Kafka après la réponse HTTP.
- `/admin/stats` (route `_authenticated/admin_.stats.tsx`, hors du layout `/admin` ; garde `requireAdmin` partagée) : `useLiveSearchStats(minutes)` ouvre l'`EventSource` ; sans événement en 8 s (proxy qui met en tampon, refus) ou flux fermé, repli sur `searchStatsOptions` toutes les 5 s (un 401 y passe par le `QueryCache`). Statuts affichés : `connecting`, `live`, `warming`, `polling`. `minutes` (5, 15, 60) dans l'URL. Navigation entre les pages admin : `AdminNav`
- Graphiques : shadcn `chart` (Recharts), chargé seulement dans le chunk de `/admin/stats` (code splitting du routeur). Couleurs des modes dans `stats/modes.ts` (palette validée contraste + daltonisme sur la surface sombre), texte toujours en couleurs de texte, pas d'animation Recharts (mise à jour toutes les 2 s), table `sr-only` pour la courbe
- Login, register et logout suppriment les queries propres au compte (`['ai-search']`, `['admin']`).
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
