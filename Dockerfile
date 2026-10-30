FROM ghcr.io/pnpm/pnpm:12 AS build
WORKDIR /app
RUN pnpm runtime set node 26 -g
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:stable-alpine
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
