# Plain glibc Debian base — fastembed/onnxruntime ship manylinux (glibc) wheels
# only, so the Alpine/musl HA base images cannot install them. No bashio, no s6.
# No "# syntax=" header and no RUN --mount cache: the Supervisor's classic builder
# errors on them.

# ---- frontend builder ----
FROM node:22-alpine AS frontend
RUN npm install -g pnpm@10.33.0
WORKDIR /build
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

# ---- runtime ----
FROM python:3.12-slim

WORKDIR /app

# Install backend dependencies first, keyed only on the dependency manifest.
# pyproject.toml's version is frozen at 0.0.0, so this layer is reused across
# version bumps and source-only edits; it re-runs only when deps change.
# setuptools needs a buildable package to read [project] metadata, so provide a
# stub package for this deps-only layer.
COPY backend/pyproject.toml /app/backend/pyproject.toml
RUN mkdir -p /app/backend/app \
    && touch /app/backend/app/__init__.py \
    && pip install --no-cache-dir "/app/backend"

# Copy the real backend source and reinstall just the project — dependencies are
# already cached above. This layer busts on any source edit but is cheap.
COPY backend/ /app/backend/
RUN pip install --no-cache-dir --no-deps --force-reinstall "/app/backend"

# The built SPA, served by the backend's conditional StaticFiles mount at /.
COPY --from=frontend /build/dist /app/frontend/dist

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 9000
CMD ["/run.sh"]
