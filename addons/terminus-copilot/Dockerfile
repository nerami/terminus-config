ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base:latest
FROM ${BUILD_FROM} AS base

RUN apk add --no-cache nodejs npm \
 && npm install -g pnpm@9

WORKDIR /app
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY src ./src
RUN pnpm build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.js"]
