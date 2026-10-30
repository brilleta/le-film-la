# le-film-la (front)

Appli de recherche de films et séries avec deux modes : classique et IA (description approximative).
Titre accueil : "Mais Si ! Le film là !" — slogan : "Décris-le mal, on le trouve quand même."
Le back Spring Boot est dans un repo séparé. Déploiement : Docker (nginx) sur Coolify.

## Stack
- Vite + React + TypeScript strict, pnpm
- Tailwind + shadcn/ui, Motion (`motion/react`)
- TanStack Router (file-based, search params validés par Zod), TanStack Query

## Commandes
- `pnpm dev` (proxy `/api` → `http://localhost:8080`) / `pnpm build` / `pnpm lint`
- `docker build` + variable `BACKEND_URL` pour tester l'image nginx

## Structure
- `src/routes/` : routes TanStack Router (ne jamais modifier `routeTree.gen.ts`, il est généré)
- `src/components/ui/` : composants shadcn (ne pas réécrire, ajouter via la CLI shadcn)
- `src/components/` : composants partagés ; `src/features/` : composants et logique par fonctionnalité (`search`, `media`)
- `src/lib/api.ts` : client typé du back + `queryOptions`
- `src/lib/tmdb/` : types du JSON TMDB relayé tel quel par le back, conversion vers `MediaSummary`/`MediaDetails`, URLs d'images
- `src/lib/motion.ts` : variantes et durées d'animation partagées
- `src/services/aiSearch.ts` : recherche IA (appel `POST /api/ai/search`)
- `nginx/` : conf nginx (template avec `BACKEND_URL`)

## Contrat d'API du back
- `GET /api/movies/search?q=` / `GET /api/movies/{type}/{id}` (type = `movie` | `tv`) / `GET /api/trending`
- `POST /api/ai/search` `{ "description" }` → `{ "results": [{ "tmdbId", "type", "title", "year", "posterPath", "voteAverage", "reason" }] }`
- Erreurs : `{ "error", "message" }` (dont dépassement de la limite de requêtes)
- Aucun appel direct à TMDB ni aucune clé dans le front ; seules les images viennent de image.tmdb.org

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
