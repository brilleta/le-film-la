# Mais Si ! Le film là !

> Décris-le mal, on le trouve quand même.

Application de recherche de films basée sur l'API TMDB, avec un mode Classique et un mode IA (interface seulement pour l'instant).

## Démarrer

```sh
pnpm install
cp .env.example .env   # renseigner VITE_TMDB_TOKEN (Read Access Token TMDB)
pnpm dev
```

## Scripts

- `pnpm dev` : serveur de développement
- `pnpm build` : vérification des types et build de production dans `dist/`
- `pnpm lint` : oxlint
- `pnpm preview` : sert le build en local

## Token TMDB

Le token est lu depuis `VITE_TMDB_TOKEN`. Il ne doit jamais être commité, mais Vite l'inclut en clair dans le JS livré au navigateur : il est donc visible par les visiteurs du site déployé. Seul un proxy côté serveur permettrait de le masquer.

---

This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
