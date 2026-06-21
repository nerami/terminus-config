# terminus-rag — Standalone HA Knowledge MCP Add-on

**Date:** 2026-06-21
**Status:** Approved (design)
**Component:** `addons/terminus-rag/` (new local add-on, slug `local_terminus_rag`)
**Spec:** 0 of 4 — see also Spec A (agent discovery tools), Spec B (proxy hardening), Spec C (observability). Read order: 0 → A; B and C are independent.

## Goal

Build a **standalone Home Assistant add-on** that exposes the home's knowledge — entities, helpers,
automations, scenes, scripts, blueprints, devices, areas, labels — as an **MCP server** that *any*
agent on the instance can call. It provides:

1. **Semantic search** over HA registry items (find "the lamp by the bed" without knowing the id).
2. **Full enumeration** of those items by kind (list every scene/automation/etc.).
3. **On-demand history** passthrough (automation traces, logbook, state history) so an agent can
   answer "why didn't scene X fire last night?" within HA's own retention window.

Terminus is the first consumer (Spec A), but the service is HA-generic and reusable by third-party
add-ons over HTTP. Extracting RAG into its own add-on keeps the embedding stack (and its glibc base
image) out of Terminus, and lets one index serve N agents.

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Packaging | **Standalone local add-on** `addons/terminus-rag/` | One index, many consumers; embedding deps isolated from Terminus. |
| Base image | **`python:3.12-slim` (glibc)** | `fastembed`/`onnxruntime` ship glibc (manylinux) wheels only — Alpine (musl) can't install them. A fresh add-on picks its own base, so Terminus stays on `3.12-alpine3.18`. |
| Interface | **MCP server over Streamable HTTP** at `:9000/mcp` | Satisfies "third-party add-ons over HTTP" *and* "MCP-native" with one contract. Auto-discoverable by any MCP client. |
| Addressing | Internal host **`local-terminus-rag:9000`**, **no `ports:`** | Reachable only on the internal hassio network (not the LAN) — safer default. `{REPO}-{SLUG}` DNS per HA docs. |
| Auth | **Optional shared bearer token** (`api_token`, default off) | Frictionless single-instance default; hardenable for multi-add-on/third-party reuse. |
| Embeddings | **Local ONNX `fastembed`, `BAAI/bge-small-en-v1.5` (384-dim)** | No API key, $0/query, entity names never leave the device, offline. Model cached under `/data`. |
| Vector store | **In-memory numpy cosine index, persisted to `/data`** | A few-hundred-record corpus needs no FAISS/Chroma; `query·matrixᵀ` + top-k is enough and dependency-light. |
| Ingestion | **Concrete per-domain functions → `IndexRecord`** (no `Source` protocol yet) | YAGNI. `IndexRecord` is the latent seam; formalize a `Source` abstraction only when a non-HA source appears. |
| Refresh | **Periodic poll (~10 min) + content-hash incremental embedding + persisted index + manual `refresh()`** | Registries change slowly; search needs identity, not live state. Steady-state refresh is near-free. |
| History | **On-demand passthrough to HA trace/logbook/history APIs** | HA's recorder already *is* the history cache. No event capture, no store. A dedicated long-retention store is a deferred future spec. |
| HA access | **`homeassistant_api: true`** → `ws://supervisor/core/websocket` + `SUPERVISOR_TOKEN` | Same Core access pattern Terminus uses; `ha_url`/`ha_token` dev-only fallback. |

## Architecture

```
Any MCP-aware agent (Terminus, Claude, third-party add-on)
  → MCP Streamable HTTP  http://local-terminus-rag:9000/mcp   (internal hassio network)
    → terminus-rag (python:3.12-slim, uvicorn + MCP/FastMCP)
        ├─ MCP tool layer        search_ha / list_records / get_record / list_kinds
        │                        get_automation_trace / get_logbook / get_history / refresh
        ├─ Index (in-memory)     numpy float32 matrix [N×384] + metadata + content-hashes
        │                        ↕ persisted under /data/index/
        ├─ Embedder              fastembed TextEmbedding (bge-small, ONNX), model cache /data/models
        ├─ Ingestion (per-domain)→ IndexRecord{id, kind, text, metadata}
        └─ HA client             ws://supervisor/core/websocket  (registries)
                                 http://supervisor/core/api/...  (states, traces, logbook, history)
  Refresh loop (asyncio): every refresh_interval → fetch sources → hash-diff → embed changed → persist
```

Two processes are **not** needed (unlike Terminus): a single uvicorn process hosts the MCP app, the
refresh loop runs as an asyncio background task in the same process.

### Module layout (`addons/terminus-rag/backend/app/`)

| Module | Responsibility |
|---|---|
| `config.py` | Resolve add-on options + HA connection (Supervisor token vs dev fallback). Mirrors Terminus `config.py`. |
| `ha_source.py` | Short-lived authenticated HA websocket/REST client + the per-domain `fetch_*` functions producing `IndexRecord`s. |
| `records.py` | `IndexRecord` dataclass + pure `compose_text()` (what gets embedded) + `content_hash()`. |
| `embedder.py` | Thin wrapper over `fastembed.TextEmbedding`; `embed(texts) -> np.ndarray`. Injectable (fake in tests). |
| `index.py` | In-memory cosine index: add/replace/remove records, `search(vec, kind?, area?, top_k)`, `list(kind?, area?)`, persistence (`load`/`save` under `/data/index`). Pure-ish; embedder injected. |
| `refresher.py` | Orchestrates a refresh pass: fetch all sources → hash-diff vs index → embed new/changed → drop removed → persist. Single-flight via `asyncio.Lock`. Owns the poll loop. |
| `history.py` | On-demand passthrough: `get_automation_trace`, `get_logbook`, `get_history` (HA trace/logbook/history APIs). No index involvement. |
| `mcp_app.py` | MCP server (FastMCP) defining the tools; optional bearer-token auth middleware; `GET /health`; wires refresher startup/shutdown into the ASGI lifespan. |
| `main.py` | uvicorn entrypoint. |

## Data model

```python
@dataclass(frozen=True)
class IndexRecord:
    id: str            # stable unique: f"{kind}:{native_id}"  e.g. "entity:light.mb_led_one"
    kind: str          # entity | helper | automation | scene | script | blueprint | device | area | label
    text: str          # the embedded string (compose_text below)
    metadata: dict      # everything a consumer wants back (see per-kind below)
```

`compose_text(record)` builds a dense descriptor so semantic match is good, e.g. for an entity:
`"Master Bedroom LED One | light | area: Master Bedroom | device: MB Strip | aliases: bedside, reading light"`.
The richer the text (friendly name + area name + device name + registry aliases + original_name),
the better fuzzy queries resolve. `content_hash(record)` = stable hash of `text` (drives incremental
re-embedding).

### Per-kind ingestion (concrete functions, no abstraction)

| Function | HA source(s) | `kind` | metadata highlights |
|---|---|---|---|
| `fetch_areas()` | `config/area_registry/list` (ws) | `area` | `area_id`, `name`, `labels` |
| `fetch_labels()` | `config/label_registry/list` (ws) | `label` | `label_id`, `name`, `color` |
| `fetch_devices()` | `config/device_registry/list` (ws) | `device` | `device_id`, `name`, `manufacturer`, `model`, `area_id` |
| `fetch_entities()` | `entity_registry/list` + `get_states` | `entity`, `helper`* | `entity_id`, `name`, `domain`, `area_id`, `area_name`, `device_id`, `device_name`, `aliases` |
| `fetch_scenes_scripts_automations()` | `get_states` + REST/trace config (reuse Terminus `ha_registry` patterns) | `scene` / `script` / `automation` | `entity_id`, `name`, `area_id`, `numeric_id` (autos), `entities` (scenes) |
| `fetch_blueprints()` | `blueprint/list` (ws, automation+script) | `blueprint` | `path`, `domain`, `name`, `source_url` |

*Helpers are config entities (`input_*`, `timer`, `counter`, `schedule`, …). `fetch_entities()` tags
them `kind="helper"` (filterable) rather than being a separate fetch. The helper domain set is a
documented constant.

Area resolution mirrors Terminus `build_topology`: `entity.area_id` → falling back to the entity's
device's `area_id`. Area/device names are denormalized into entity records so search text and results
carry human labels without a join on the consumer side.

## MCP tool surface

All tools return JSON-serializable objects. `kind` filters use the enum above.

| Tool | Signature | Returns | Notes |
|---|---|---|---|
| `search_ha` | `(query: str, kind?: str, area?: str, top_k: int = 10)` | `[{id, kind, name, domain?, area?, score, metadata}]` | Embed query → cosine top-k over the (optionally kind/area-filtered) index. The token-bounded discovery path. |
| `list_records` | `(kind: str, area?: str)` | `[{id, kind, name, ...metadata}]` | **Full enumeration** (no embedding). The complete-list path the agent uses for "what scenes exist?". |
| `list_kinds` | `()` | `[{kind, count}]` | What's indexed + counts. Cheap orientation. |
| `get_record` | `(id: str, kind: str)` | full `metadata` for one item, or `{error}` | Exact lookup once an id is known. |
| `get_automation_trace` | `(automation: str, run_id?: str)` | latest (or specified) trace config + step outcome, or `{error}` | Passthrough: `trace/list` → newest → `trace/get`. Answers "why didn't it fire". Accepts entity id or numeric id. |
| `get_logbook` | `(start: str, end?: str, entity_id?: str)` | logbook events in range | Passthrough: `logbook/get_events`. Human-readable "what happened". |
| `get_history` | `(entity_id: str, start: str, end?: str)` | state history in range | Passthrough: `history/history_during_period`. |
| `refresh` | `()` | `{added, changed, removed, total, took_ms}` | Force a rescan now (e.g. just added a device). Single-flight with the poll loop. |

`GET /health` (non-MCP) → `{status, indexed, kinds, last_refresh, model}` for liveness/monitoring.

### History tools — retention reality (documented, not hidden)

These read **HA's existing** recorder/trace stores, so they inherit HA's retention: recorder purges
after ~10 days by default; automations keep the last ~`stored_traces` (default 5) traces. The tool
descriptions state this so the agent doesn't promise history HA no longer has. Extending retention
(our own event store) is explicitly a **future spec**, not this one.

## Auth

- `api_token` add-on option (`password`, default `""`).
- When non-empty, an ASGI middleware requires `Authorization: Bearer <api_token>` on `/mcp` (and
  `/health` stays open for liveness). When empty, the server is open on the internal network.
- Consumers (Spec A) pass the token via the MCP client's per-server `headers`.
- Constant-time comparison (`secrets.compare_digest`). No token in logs.

## Refresh & persistence

- **Startup:** load persisted index from `/data/index` if present (instant), then kick one refresh
  pass to reconcile; if absent, build from scratch.
- **Poll loop:** every `refresh_interval` (default 600 s) run a pass under the single-flight lock.
- **Incremental embedding:** per record, compare `content_hash` to the stored one; embed only new or
  changed records; drop records whose ids vanished. Unchanged corpus ⇒ zero embeddings.
- **Persistence:** `vectors.npy` (float32 `[N×384]`, L2-normalized), `meta.json` (records minus
  vectors), `hashes.json`. Atomic write (temp file + rename) so a crash mid-write can't corrupt.
- **Cost:** full build of a few-hundred short strings on the HA Green ARM CPU is a few seconds;
  steady-state is near-free. Model weights (~130 MB) download once to `/data/models` (cached across
  restarts; documented first-boot delay).

## Configuration (`config.yaml` options + schema)

| Option | Type | Default | Purpose |
|---|---|---|---|
| `api_token` | `password?` | `""` | Optional bearer token gating `/mcp`. |
| `refresh_interval` | `int` | `600` | Seconds between poll passes. |
| `embed_model` | `str` | `BAAI/bge-small-en-v1.5` | fastembed model id. |
| `top_k_default` | `int` | `10` | Default `search_ha` top-k. |
| `log_level` | `list(debug\|info\|warning\|error)` | `info` | Logger verbosity. |
| `ha_url` | `str?` | `""` | Dev-only Core URL (ignored under Supervisor). |
| `ha_token` | `password?` | `""` | Dev-only Core token. |

Add-on manifest: `homeassistant_api: true`, `init: false`, `boot: auto`, `startup: application`,
no `ports:`, `slug: terminus_rag`, `map: []` (uses `/data` only). `CHANGELOG.md` from v0.1.0.

## Docker & deploy conventions (match terminus-langchain)

- **Manifest-before-source layering:** `COPY pyproject.toml` → `pip install` → `COPY backend/` →
  `pip install --no-deps .`, so source-only edits don't reinstall deps. Version pinned `0.0.0` in
  `pyproject.toml`; the only bumped version is `config.yaml`.
- **No BuildKit cache mounts / `# syntax=` header** — the Supervisor's classic builder errors on them.
- **`fastembed` install:** glibc slim base; add minimal apt deps only if a wheel needs them (verify
  `onnxruntime` aarch64 wheel resolves at build — it does on manylinux).
- **Model download — lazy by default:** fetch the model on first boot into `/data/models` (cached
  across restarts), keeping the image smaller; document the one-time first-boot delay and report it via
  `/health` (`status: warming`). Build-time bake-in is a noted alternative if first-boot latency proves
  unacceptable.
- **Plain base ⇒ no bashio/s6:** `python:3.12-slim` is the official Debian image (the HA `*-base-python`
  images are Alpine/musl — exactly what we're avoiding), so there is **no bashio or s6-overlay**. `run.sh`
  is a plain entrypoint that `exec`s uvicorn (`init: false`); add-on options are read **directly from
  `/data/options.json`** in `config.py` (no `bashio::config` env export), which the mirrored Terminus
  `config.py` already does.
- Deploy via `bin/deploy-addons-ssh.sh`; on device `ha apps update local_terminus_rag` (version
  bumped) or `ha apps rebuild local_terminus_rag` (source-only). Update AGENTS.md add-on table.

## Error handling

- HA websocket/REST failures during a refresh: **logged** and the pass aborts *without* discarding the
  last good index (degrade to stale, never to empty). `/health` reports `last_refresh` age so staleness
  is visible.
- Per-source failure is isolated: one failing `fetch_*` logs and is skipped; other kinds still index
  (mirrors Terminus `fetch_topology`'s per-automation resilience, but with logging — see Spec C's
  lesson applied from the start).
- MCP tools return structured `{error}` on bad input / HA-unreachable rather than raising, so the
  calling agent can react.
- Every broad `except` **logs before degrading** (Spec C's central lesson, baked in here from day one).

## Testing (TDD — test-first, watch-it-fail)

Greenfield, so tests lead every module.

**Pure / unit (no network, fake embedder returning deterministic vectors):**
- `records`: `compose_text` per kind (entity with/without area/device/aliases; helper tagging);
  `content_hash` stability + change-on-text-change.
- `index`: add/replace/remove; `search` ranking + `kind`/`area` filter + `top_k` bound; `list`
  enumeration; persistence round-trip (save→load equality); atomic-write leaves no partial file.
- `refresher`: hash-diff embeds only changed records; removed ids dropped; single-flight (two
  concurrent passes ⇒ one runs); failed fetch keeps prior index.
- `ha_source`: registry JSON → `IndexRecord`s (fake ws); area fallback (entity→device); helper domain
  classification; blueprint/list normalization.
- `history`: trace/list→newest→trace/get selection; logbook/history param shaping; `{error}` on HA failure.
- `mcp_app`: tool contracts (schemas, return shapes) via an in-process MCP client; bearer-token
  middleware (401 without/with bad token, pass with good, `/health` open); `search_ha` end-to-end with
  fake embedder + seeded index.

**Integration (marked slow, opt-in):** real `fastembed` load + embed a handful of strings; assert
dimensionality and that a known query ranks the expected record first.

## Out of scope (v1)

- Dedicated long-retention **event store** / event capture via persistent ws (future spec; would also
  graduate refresh poll→hybrid).
- The formal `Source` protocol / non-HA sources (YAGNI; `IndexRecord` seam only).
- Semantic search *over history* (history is on-demand passthrough, not embedded).
- A management UI / ingress panel (CLI + `/health` suffice; could add later).
- Multi-instance / multi-home federation.
- Re-ranking, hybrid BM25+vector, chunking (corpus is short labels; cosine over dense text suffices).
