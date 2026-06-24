# Terminus RAG add-on

Standalone HA knowledge MCP server (`backend/`, Python). One Docker image
(`Dockerfile`), glibc base.

## Versioning / release

- **`config.yaml` `version` is the single canonical version** — the ONLY one bumped
  on release. **Do NOT bump `backend/pyproject.toml`** (pinned `0.0.0`; bumping it
  busts the Docker pip dep-layer cache). Adding/changing a real dependency still
  correctly invalidates that layer.
- **Every version bump adds a matching `CHANGELOG.md` entry** under a heading equal
  to the new `config.yaml` `version`.

## Local development / testing

- Local add-on → full slug `local_terminus_rag`.
- **Don't bump the version to test changes.** The Update button is version-gated for
  *releasing*, not iterating. To pick up source changes, **Rebuild**
  (`ha apps rebuild local_terminus_rag`), not Restart.
- If you changed `config.yaml` options/schema, **Reload** first
  (`ha supervisor reload && ha store reload`) so the Supervisor re-reads metadata.

## Docker caching strategy

- **Manifest-before-source:** `COPY backend/pyproject.toml` → `pip install`
  (stub `app` package) → `COPY backend/` → `pip install --no-deps`. Source-only
  edits reuse the dep layer.
- **No BuildKit cache mounts / no `# syntax=` header** — the classic builder errors
  on them.

## Base image

`python:3.12-slim` (glibc) — fastembed/onnxruntime need glibc wheels. No bashio, no
s6: `run.sh` is a plain entrypoint; options are read directly from
`/data/options.json` in `config.py`.

## Dev ports

Laptop dev (6374x convention; backend stays on its real port :9000):

| Port | Service |
|---|---|
| `63743` | Vite dev server (playground SPA) — `frontend/vite.config.ts` |
| `63744` | Storybook — `frontend/package.json` |

`dev.sh` runs the backend (`:9000`) + Vite (`:63743`) together; open
`http://localhost:63743`.
