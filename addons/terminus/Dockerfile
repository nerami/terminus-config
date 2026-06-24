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

# Install backend dependencies first, keyed only on the dependency manifest.
# pyproject.toml's version is frozen at 0.0.0, so this layer is reused across
# version bumps and source-only edits; it re-runs only when deps change.
# setuptools needs a buildable package to read [project] metadata, so provide a
# stub package for this deps-only layer.
COPY backend/pyproject.toml /app/backend/pyproject.toml
RUN mkdir -p /app/backend/app \
    && touch /app/backend/app/__init__.py \
    && pip install --no-cache-dir "/app/backend[server]"

# Copy the real backend source and reinstall just the project — dependencies are
# already cached above. This layer busts on any source edit but is cheap.
COPY backend/ /app/backend/
RUN pip install --no-cache-dir --no-deps --force-reinstall "/app/backend"

COPY --from=frontend /build/dist /app/frontend/dist

COPY run.sh /run.sh
RUN chmod a+x /run.sh

# The Supervisor passes the add-on's config.yaml version as the BUILD_VERSION
# build-arg. Bake it into the runtime env so the backend can surface it (sidebar
# version badge via /ha/status). Declared last so a release-only version bump
# rebuilds just this tiny trailing layer, not the cached dep/source layers above.
ARG BUILD_VERSION
ENV TERMINUS_VERSION=${BUILD_VERSION}

EXPOSE 8099
CMD ["/run.sh"]
