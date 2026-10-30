# le-film-la

Appli de recherche de films (API TMDB) avec deux modes : classique et IA (description approximative).
Titre accueil : "Mais Si ! Le film là !" — slogan : "Décris-le mal, on le trouve quand même."
100 % front pour l'instant, déployé sur GitLab Pages (sous-chemin).

## Stack
- Vite + React + TypeScript strict, pnpm
- Tailwind + shadcn/ui, Motion (`motion/react`)
- TanStack Router (file-based, search params validés par Zod), TanStack Query

## Commandes
- `pnpm dev` / `pnpm build` / `pnpm lint`

## Structure
<!-- À ajuster selon l'arborescence réelle -->
- `src/routes/` : routes TanStack Router (ne jamais modifier `routeTree.gen.ts`, il est généré)
- `src/components/ui/` : composants shadcn (ne pas réécrire, ajouter via la CLI shadcn)
- `src/components/` : composants de l'appli
- `src/lib/tmdb.ts` : client TMDB typé + `queryOptions`
- `src/lib/motion.ts` : variantes et durées d'animation partagées
- `src/services/aiSearch.ts` : interface de recherche IA (implémentation temporaire)

## Conventions
- Toujours passer par les composants shadcn existants avant d'en créer
- Toutes les requêtes via TanStack Query et les `queryOptions` de `src/lib/tmdb.ts`
- État de recherche (`q`, `mode`) dans l'URL, pas dans un state local
- Thème sombre ciné + glassmorphism ; animations via les variantes de `src/lib/motion.ts`, respecter `prefers-reduced-motion`
- TMDB : token dans `VITE_TMDB_TOKEN` (`.env`), jamais en dur ; `language=fr-FR`
- Nommage : composants en PascalCase, hooks en `useXxx`, pas de `any`

## Façon de travailler (économiser le contexte)
- Ne lire que les fichiers nécessaires à la tâche ; pas d'exploration globale du repo sans raison
- Ne jamais ouvrir `node_modules`, `dist`, `pnpm-lock.yaml` ni `routeTree.gen.ts`
- Modifications ciblées : éditer le minimum, ne pas réécrire un fichier entier pour un petit changement
- Pas de refactor ni d'ajout de fonctionnalité non demandés ; proposer plutôt que faire
- Réponses courtes : résumé des changements en quelques lignes, sans recopier le code modifié
- Vérifier avec `pnpm build` et `pnpm lint` une fois à la fin d'une étape, pas après chaque micro-modif
- Si une demande est ambiguë, poser une question plutôt que deviner
