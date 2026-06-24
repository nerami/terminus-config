# Changelog

All notable changes to the Terminus RAG add-on are recorded here. The version
headings match `config.yaml` `version` (the single canonical version bumped on
release).

## 0.3.0

- **Sidebar navigation + two-column content.** The playground now uses the same
  shadcn sidebar as the Terminus add-on: tools live in a collapsible sidebar
  (with a mobile drawer and an index-status footer) instead of the old fixed
  left column. The main content is a two-column layout — the selected tool's
  name, description, and inputs on the left, the result block on the right
  (stacking on narrow screens).
- **Playground theme.** The tool-console UI now mirrors the Terminus add-on's
  visual theme — the shared shadcn `base-nova`/`mist` palette with light/dark
  tokens, plus the Inter and JetBrains Mono variable fonts — for a consistent
  look across the two add-ons. The result/form panels use theme tokens too, so
  the whole console (not just the shell) follows light/dark.
- **Dev ergonomics.** `./dev.sh` now honors two optional `.env` overrides:
  `DEV_BACKEND_PORT` (when something else holds `:9000` locally, e.g. a
  langfuse-clickhouse stack) and `RAG_DATA_DIR` (a writable stand-in for the
  on-device `/data` mount). Both default to the on-device contract, so the
  built add-on is unaffected. Adds an add-on-level `.gitignore` (ignores
  `.env`, `.dev-data/`, and backend caches).

## 0.2.0

- **New: an in-app tool-console playground.** The add-on now exposes a Web UI
  (HA sidebar / ingress) to run every MCP tool — fill a form generated from each
  tool's schema and inspect the JSON result, plus an index-status header. The UI
  is reachable only through HA ingress (guarded by the `X-Ingress-Path` header);
  the `/mcp` endpoint stays bearer-token gated.

## 0.1.1

- Every add-on option now has a proper name and description in the
  Configuration UI (previously they showed raw keys) via a new
  `translations/en.yaml`.

## 0.1.0

- Initial release. Standalone HA knowledge MCP server: in-memory numpy cosine
  index over the registry (entities, helpers, automations, scenes, scripts,
  blueprints, devices, areas, labels) with local ONNX embeddings
  (`fastembed`, `BAAI/bge-small-en-v1.5`). MCP tools over Streamable HTTP at
  `:9000/mcp`: `search_ha`, `list_records`, `get_record`, `list_kinds`,
  `get_automation_trace`, `get_logbook`, `get_history`, `refresh`; optional
  bearer-token auth; `GET /health`.
