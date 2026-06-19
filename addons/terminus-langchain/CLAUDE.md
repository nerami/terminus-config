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
- **Every version bump must add a `CHANGELOG.md` entry** under a heading
  matching the new `config.yaml` `version` (the Supervisor surfaces it in the
  add-on UI). No bump without a changelog entry.
- To release: edit `config.yaml` `version` (semver), add the matching
  `CHANGELOG.md` entry, commit, push.

## Package manager

- The frontend uses **pnpm** (`pnpm-lock.yaml` is the source of truth; the Docker build runs
  `pnpm install --frozen-lockfile`). Use `pnpm install` locally — not `npm install`, which would
  regenerate a redundant `package-lock.json`.

## Docker caching strategy

The `Dockerfile` is structured so that **source-only edits don't reinstall
dependencies**, while a dependency change always rebuilds the dep layer (the
image is never missing a newly added dep).

- **Manifest-before-source ordering (both stages).** Each stage copies only its
  dependency manifest, installs deps, then copies the rest of the source:
  - Frontend: `COPY frontend/package.json frontend/pnpm-lock.yaml` →
    `pnpm install --frozen-lockfile` → `COPY frontend/`.
  - Backend: `COPY backend/pyproject.toml` → `pip install ".[server]"` →
    `COPY backend/` → `pip install --no-deps --force-reinstall "."`. setuptools
    needs a buildable package to read `[project]` metadata, so the deps-only
    layer creates a stub `app` package; the real source is reinstalled
    afterward with `--no-deps` (deps already cached, so it's cheap).
- **Frozen versions** (see *Versioning / release* above): the `version` field in
  `package.json` / `pyproject.toml` lives inside the file used as the dep-layer
  cache key, so it's pinned to `0.0.0`. A version bump touches only
  `config.yaml` and therefore reuses both dep layers; adding/changing a real
  dependency still invalidates them.
- **No BuildKit cache mounts.** The HA Supervisor builds local add-ons via the
  docker-py SDK (the legacy/classic builder), which **errors** on
  `# syntax=docker/dockerfile:1` headers and `RUN --mount=type=cache`. The
  Dockerfile therefore stays ordering-only — no cache mounts — so it builds
  under whatever builder the Supervisor uses.
- **Single lockfile.** `pnpm-lock.yaml` is the source of truth and
  `package-lock.json` is intentionally absent — do not run `npm install` (it
  would regenerate a redundant lockfile). If you change frontend deps, run
  `pnpm install` and commit the updated `pnpm-lock.yaml`.
