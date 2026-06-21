# Terminus Agent — Knowledge Tools via terminus-rag (MCP)

**Date:** 2026-06-21
**Status:** Approved (design)
**Component:** `addons/terminus-langchain/backend/` (`local_terminus`)
**Spec:** A of 4 — **depends on Spec 0** (`terminus-rag`) being deployed. See Spec B (proxy), Spec C (observability).

## Goal

Close the agent's **id-grounding gap**: today it can *activate* a scene/automation but cannot
*discover* what exists, so it depends on the user supplying exact ids or on per-turn topology context.
After this spec the agent routes every read/discovery through `terminus-rag`'s MCP tools (semantic
search, full enumeration, exact lookup, and on-demand history), while keeping its state-changing
actuation local and approval-gated. The agent gains the ability to find "the bedroom lamp", list every
scene, and answer "why didn't automation X fire" — without bloating Terminus with embedding deps.

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Discovery source | **All enumeration + search via `terminus-rag` MCP tools** | Single shared HA knowledge index; reusable by other agents. Per locked decision (2): no local list tools. |
| MCP client | **`langchain-mcp-adapters` `MultiServerMCPClient`** | Loads the RAG server's MCP tools as native LangChain tools; no bespoke HTTP client. Idiomatic. |
| Local tools kept | **`ha_basic_info`, `run_scene`, `trigger_automation`** | Instance status + actuation stay self-sufficient so "are you connected / activate a scene" works even if `terminus-rag` is down. Registry enumeration → RAG; instance status → local. |
| Approval gating | **Only `run_scene` / `trigger_automation`** | The mounted RAG tools are read-only → excluded from the human-in-the-loop interrupt. |
| Degradation | **Graceful when `terminus-rag` unreachable** | Mount best-effort; on failure the agent keeps actuation + `ha_basic_info` and is told knowledge tools are offline. Core function never hard-fails on an optional add-on. |
| Connection | **`rag_url` (default `http://local-terminus-rag:9000/mcp`) + `rag_token`** | Internal hostname by default; token passed as MCP header when set. Mirrors the `ha_url`/`ha_token` fallback pattern. |
| Settings reads | **Memoize `load_settings`** | Tools re-read `/data/options.json` + env on every call today; options only change on add-on restart, so a cached load is safe. |

## Architecture

```
LangGraph agent (create_agent, Sonnet 4.6)
  tools = [ ha_basic_info, run_scene, trigger_automation,      # local (unchanged + approval gate)
            *rag_tools ]                                        # mounted from terminus-rag at build
                                          │
            MultiServerMCPClient ─────────┘  (langchain-mcp-adapters)
              → http://local-terminus-rag:9000/mcp  (Streamable HTTP, optional Bearer rag_token)
                → search_ha / list_records / get_record / list_kinds
                  get_automation_trace / get_logbook / get_history / refresh
```

Tool mounting happens in `build_graph()` (`agent.py`): resolve `rag_url`/`rag_token` from settings,
construct the MCP client, load its tools, and append them to the local tool list. Loading is
**best-effort and cached** — see degradation below.

## Code changes (`addons/terminus-langchain/backend/app/`)

- **`agent.py`** (edit):
  - `build_graph()` mounts RAG tools via `MultiServerMCPClient` and merges them with the local three.
  - **Prompt rewrite** of `_BASE_PROMPT` (see below).
  - Approval middleware unchanged (still only `run_scene`/`trigger_automation`); RAG tools naturally
    excluded since they're not listed in `interrupt_on`.
  - The `{approval}` slot logic and `TopologyContextMiddleware` are untouched.
- **`mcp_client.py`** (new): builds the `MultiServerMCPClient` for the `terminus-rag` server, returns
  loaded tools (or `[]` on failure), with the degradation/caching policy. Isolated so it's unit-testable
  with a fake/in-process MCP server.
- **`config.py`** (edit): add `rag_url` (default the internal host URL) and `rag_token` options; add a
  memoized `load_settings` (cache cleared only on process restart — document that options changes need a
  rebuild/restart anyway).
- **`tools.py`** (edit, light): no new tools (enumeration moved to RAG). `ha_basic_info`/`run_scene`/
  `trigger_automation` unchanged here except the error-handling hardening that lands in **Spec C**.
- **`pyproject.toml`** (edit): add `langchain-mcp-adapters` dep.
- **`config.yaml`** (edit): add `rag_url`/`rag_token` options + schema; document them in
  `translations/`.

## Prompt rewrite

The current `_BASE_PROMPT` (a) lists three tools, (b) apologizes that the agent "can't … list what
exists", and (c) tells it not to fabricate ids. After this spec:

- **Advertise the knowledge tools** the agent now has (search, enumerate, look up, history) alongside
  the three local ones.
- **Delete the apology** — "list what exists" is now in reach.
- **Instruct discover-before-act:** when a target id is unknown or ambiguous, call `search_ha` /
  `list_records` to find it rather than guessing; confirm ambiguous matches with the user.
- **History guidance:** to answer "what happened / why didn't X fire", use `get_automation_trace` /
  `get_logbook` / `get_history`, and state plainly when HA's retention window doesn't cover the asked
  period.
- **Degraded mode:** when knowledge tools are offline (RAG add-on down), say so and fall back to
  asking the user for exact ids; actuation and instance status still work.
- The approval clause (`{approval}` slot, gated vs auto) and "report tool errors plainly" guidance
  remain.

## Degradation policy

`terminus-rag` is an **optional dependency**. The actuation path must never hard-fail on its absence.

- At `build_graph()`, mounting RAG tools is wrapped: on connect/load failure, log a warning (Spec C
  logging) and proceed with `rag_tools = []`. The agent still has `ha_basic_info`/`run_scene`/
  `trigger_automation`.
- A small status flag (RAG available/unavailable) feeds the prompt so the model knows whether to offer
  discovery or to ask the user for ids.
- Per-call failures of a mounted tool (RAG went down after startup) surface as a tool error the model
  reports plainly — same contract as local tools.
- **Caching:** the MCP client + loaded tools are built once and reused across turns (not per request);
  a failed initial mount is retried on a bounded backoff rather than every turn.

## Error handling

| Case | Behavior |
|---|---|
| RAG unreachable at startup | Warn-log; mount `rag_tools=[]`; prompt enters degraded mode; agent keeps actuation. |
| RAG tool errors mid-session | Tool returns/raises → surfaced to model as a tool error → reported plainly; no crash. |
| `rag_token` set but rejected (401) | Treated as unreachable → degraded mode + warn-log (clear "auth" message). |
| Ambiguous search result | Prompt directs the agent to confirm with the user before actuating. |

## Testing (TDD)

**Unit (fake/in-process MCP server, no real RAG add-on):**
- `mcp_client`: loads tools from a fake MCP server; returns `[]` and logs on connect failure; passes
  `Authorization` header when `rag_token` set; retry/backoff on initial failure.
- `agent`/`build_graph`: tools list = local three + mounted RAG tools when available; = local three
  when RAG mount fails; approval middleware still gates only `run_scene`/`trigger_automation` (mounted
  read tools never interrupt).
- Prompt rendering: degraded-mode vs available-mode text; approval gated vs auto (existing tests
  extended, not replaced).
- `config`: `rag_url`/`rag_token` resolution + memoized `load_settings` (single read; cache stable).

**Integration (marked slow, opt-in):** spin a real `terminus-rag` MCP server (or its test harness),
mount through `MultiServerMCPClient`, and assert `search_ha`/`list_records` reach the agent as callable
tools.

## Out of scope (v1)

- Local fallback enumeration tools (explicitly moved to `terminus-rag` per decision (2)).
- Moving `ha_basic_info` to `terminus-rag` (kept local; revisit only if instance status should be shared).
- Any change to the frontend `/ha/topology` panel (separate consumer; see Spec B).
- Writing/CRUD via the agent (covered by the prior `agent-ha-crud` spec, unrelated).
