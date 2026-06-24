# Changelog

All notable changes to the Terminus RAG add-on are recorded here. The version
headings match `config.yaml` `version` (the single canonical version bumped on
release).

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
