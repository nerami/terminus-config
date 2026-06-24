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

Laptop dev (6374x convention; backend defaults to its real port :9000):

| Port | Service |
|---|---|
| `63743` | Vite dev server (playground SPA) — `frontend/vite.config.ts` |

`dev.sh` runs the backend (`:9000`) + Vite (`:63743`) together; open
`http://localhost:63743`.

## Local dev env overrides

`dev.sh` sources `.env` (gitignored; copy from `.env.example`). Beyond the HA
connection (`HASS_URL`/`HASS_TOKEN`) and add-on options (`RAG_API_TOKEN`), two
**dev-only** overrides exist. Both **default to the on-device contract**, so the
built add-on is unaffected — they only activate when set in `.env`:

| Var | Default | Why override |
|---|---|---|
| `DEV_BACKEND_PORT` | `9000` | Free the bind port when something else holds `:9000` locally — notably a **langfuse-clickhouse** stack (ClickHouse's native protocol is `:9000`). `dev.sh` binds uvicorn to it and the Vite proxy targets follow it (`frontend/vite.config.ts` reads `process.env.DEV_BACKEND_PORT`). |
| `RAG_DATA_DIR` | `/data` | The Supervisor mounts a writable per-add-on volume at `/data` on-device, but on a laptop `/data` is the **read-only root** — fastembed can't create `/data/models` and the index can't persist. Point this at a writable local dir (`.dev-data/`, gitignored). Read in `backend/app/main.py` → `$RAG_DATA_DIR/{models,index}`. |

`9000` is also the production MCP port the sibling Terminus add-on reaches at
`http://local-terminus-rag:9000/mcp`, so dev stays on `9000` by default and only
diverges when forced.
