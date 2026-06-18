ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base-python:3.12-alpine3.18

# ---- frontend builder ----
FROM node:22-alpine AS frontend
RUN npm install -g pnpm@10.33.0
WORKDIR /build
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

# ---- runtime ----
FROM ${BUILD_FROM}
WORKDIR /app

COPY backend/ /app/backend/
RUN pip install --no-cache-dir "/app/backend[server]"

COPY --from=frontend /build/dist /app/frontend/dist

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 8099
CMD ["/run.sh"]
