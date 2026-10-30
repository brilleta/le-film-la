# Mais Si ! Le film là !

> Décris-le mal, on le trouve quand même.

Application de recherche de films et de séries, avec un mode Classique et un mode IA. Les données passent par un back Spring Boot, dans un repo séparé.

## Démarrer

Le back doit tourner sur `http://localhost:8080` : `pnpm dev` y redirige `/api`.

```sh
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` : serveur de développement
- `pnpm build` : vérification des types et build de production dans `dist/`
- `pnpm lint` : oxlint
- `pnpm preview` : sert le build en local

## Déploiement

L'image Docker sert le build avec nginx sur le port 80 et redirige `/api` vers `BACKEND_URL`, à donner sans `/` final :

```sh
docker build -t le-film-la .
docker run -p 8000:80 --network <réseau-du-back> -e BACKEND_URL=http://<service-back>:8080 le-film-la
```

Le front et le back doivent être sur le même réseau Docker défini par l'utilisateur (c'est le cas sur Coolify) : nginx utilise son DNS interne.

---

This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
