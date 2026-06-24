# Terminus RAG add-on

Standalone Home Assistant knowledge MCP server. Indexes the registry (entities,
helpers, automations, scenes, scripts, blueprints, devices, areas, labels) with
local ONNX embeddings and exposes:

- **Semantic search** (`search_ha`) — find "the lamp by the bed" without the id.
- **Full enumeration** (`list_records`, `list_kinds`, `get_record`).
- **On-demand history** (`get_automation_trace`, `get_logbook`, `get_history`) —
  passthrough to HA's own trace/logbook/recorder, so it inherits HA's retention
  (recorder ~10 days; automations keep ~`stored_traces` traces).
- **Manual `refresh`** to rescan now.

MCP Streamable HTTP at `http://local-terminus-rag:9000/mcp` (internal hassio
network; no LAN port). Optional bearer token via the `api_token` option.

## First boot

The embedding model (`BAAI/bge-small-en-v1.5`, ~130 MB) downloads once into
`/data/models` and is cached across restarts. During that download `/health`
reports `status: "warming"`. Subsequent boots are instant.

## Deploy

Sync source then update/rebuild on the device:

```bash
bin/deploy-addons-ssh.sh
# on device:
ha apps update local_terminus_rag     # if config.yaml version bumped
ha apps rebuild local_terminus_rag    # if source-only change
```

## Base image

`python:3.12-slim` (glibc), not the Alpine HA base — `fastembed`/`onnxruntime`
ship glibc wheels only. There is therefore no bashio/s6; `run.sh` is a plain
entrypoint and options are read directly from `/data/options.json`.

## Playground UI

The add-on serves a tool-console Web UI through Home Assistant ingress (open it
from the add-on's "Open Web UI" / sidebar entry). It lists all MCP tools, renders
a form from each tool's input schema, runs it in-process, and shows the JSON
result, with an index-status header (`/health`).

Access control:
- The UI and its `/playground/*` endpoints are reachable only via HA ingress
  (requests carry the `X-Ingress-Path` header). Direct non-ingress calls get a
  `404` when `api_token` is set.
- The `/mcp` endpoint is unchanged: bearer-token gated when `api_token` is set.
- With no `api_token` configured (local dev), everything is open.
