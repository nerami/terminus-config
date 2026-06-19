# Terminus add-on

Home Assistant add-on: a chat UI (`frontend/`, React + Vite + pnpm) backed by a local
LangChain/LangGraph agent (`backend/`, Python). The frontend is built and served by the
backend; both ship in one Docker image (`Dockerfile`).

## Versioning / release

- **`config.yaml` `version` is the single canonical version** — it is the ONLY version bumped
  on release. Bumping it is what makes Home Assistant offer the update.
- **Do NOT bump `frontend/package.json` or `backend/pyproject.toml`** — they are intentionally
  pinned to a static `0.0.0`. Their `version` field lives inside the dependency manifests, so
  bumping it would bust the Docker pnpm/pip dependency-cache layers on every release. (Adding or
  changing a dependency still correctly invalidates those layers; only the version is frozen.)
- To release: edit `config.yaml` `version` only (semver), commit, push.

## Package manager

- The frontend uses **pnpm** (`pnpm-lock.yaml` is the source of truth; the Docker build runs
  `pnpm install --frozen-lockfile`). Use `pnpm install` locally — not `npm install`, which would
  regenerate a redundant `package-lock.json`.

<!-- Caching strategy: TODO (to be added). -->
