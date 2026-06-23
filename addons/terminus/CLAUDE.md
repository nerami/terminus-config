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

## Local development / testing

This is a **local add-on** (it lives under the HA config dir's `addons/` folder and has
no `image:` key, so the Supervisor builds it from the `Dockerfile`). Its full Supervisor
slug is therefore `local_terminus`.

- **Don't bump the version to test changes.** The add-on UI's **Update** button is
  version-gated — it only appears when `config.yaml` `version` is higher than the installed
  one. That gate is for *releasing* to users, not for iterating. Bumping per test iteration
  would pollute `CHANGELOG.md`/version history. Reserve a bump for a real release.
- **To pick up source changes, Rebuild** (not Restart). A plain Restart reuses the existing
  image and will NOT include code changes:
  - UI: add-on page → top-right **⋮ → Rebuild**.
  - CLI (SSH/Terminal add-on or `ha`): `ha addons rebuild local_terminus`.
  - Thanks to the manifest-before-source layering (see *Docker caching strategy*), a
    source-only edit rebuilds fast — deps stay cached; only the `COPY frontend/` /
    `COPY backend/` layers and downstream rebuild.
- If you changed `config.yaml` options/schema or `translations/`, **Reload** first so the
  Supervisor re-reads metadata: `ha addons reload` (or refresh the add-on store).
- **Faster front-end loop:** the frontend is compiled into the image, so the Rebuild is the
  slow part of UI testing. For rapid UI work run the Vite dev server against the backend
  (`cd frontend && pnpm dev`) and only Rebuild the add-on to verify the integrated/ingress
  build. Backend-only Python changes still need a Rebuild (or run the backend locally).

## Package manager

- The frontend uses **pnpm** (`pnpm-lock.yaml` is the source of truth; the Docker build runs
  `pnpm install --frozen-lockfile`). Use `pnpm install` locally — not `npm install`, which would
  regenerate a redundant `package-lock.json`.

## Frontend data fetching

- **Plain REST → axios + react-query.** The backend's REST endpoints (`/ha/*`, `/info`,
  `/title`) go through the shared axios instance (`src/lib/http.ts` — auth headers via its
  interceptor) and TanStack react-query (provider/client in `src/lib/query-client.ts`). Don't
  add raw `fetch` for these: build URLs with `endpoints()` (`src/runtime-config.ts`) and reuse
  the existing shared `queryOptions` patterns (e.g. `haStatusQueryOptions`).
- **Leave the LangGraph SDK alone.** Chat streaming + threads (`useStream`, `createClient`,
  `client.threads.*`) own their transport — never route them through axios/react-query.

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
