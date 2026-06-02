ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base:latest

# ---- builder ----
FROM node:22-alpine AS builder
RUN npm install -g pnpm@11.1.1
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile
COPY src ./src
RUN pnpm build \
 && pnpm prune --prod

# ---- runtime ----
FROM ${BUILD_FROM} AS runtime
RUN apk add --no-cache nodejs
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.js"]
