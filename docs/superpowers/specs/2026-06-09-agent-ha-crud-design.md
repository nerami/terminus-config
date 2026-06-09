# Terminus Agent — HA Config CRUD

**Date:** 2026-06-09
**Status:** Approved (design)
**Component:** `terminus/apps/agent` (`@terminus/agent`)

## Goal

Let a Home Assistant user, through the Terminus Copilot chat panel, **create / edit / delete
automations, scenes, and scripts** by talking to the laptop-hosted LangGraph agent. These
entities are managed at runtime via HA's Config API — they live in the device's editable root
files, **not** in `packages/*.yaml` and **not** in the git repo.

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Deployment | **Laptop dev** | Ship now on the existing Express/LangGraph server. No add-on. |
| Mechanism | **HA Config API** (`/api/config/<domain>/config/<id>`) | The same REST surface the HA UI editor uses. Auto-reloads, no deploy pipeline, validates server-side. (HA MCP/Assist operates devices — it cannot author automations.) |
| CRUD scope | **automation, scene, script** | The three config-API domains; one uniform pattern. Helpers (input_*, schedule) deferred — they need a separate storage-collection WebSocket API. |
| Versioning | **Device-only** | History = HA backups. Fully decoupled from git/packages. Matches "runtime-editable, not in packages." |
| Confirmation | **Soft gate (prompt-driven)** | System prompt makes the agent state the change + show config YAML + ask "confirm?" before destructive writes. No human-in-loop infra. |
| Packages-managed edit | **Clone into runtime** | Agent can't edit hand-authored autos in place; it offers a runtime copy, disables the original, and warns the original re-enables on restart. |
| Tool design | **Approach A** — 4 verb tools + domain enum | Smallest surface that ships; HA owns validation. |

## Architecture

Deployment unchanged: `@terminus/agent` stays an Express + LangGraph `createReactAgent`
(Sonnet 4.6) server on the laptop.

```
HA dashboard → Copilot panel (ingress)
  → terminus-copilot add-on (Hono)
    → POST terminus_agent_url  (laptop LAN IP:3001)        ← Docker-bridge → LAN hop
      → @terminus/agent (Express) → LangGraph ReAct
        → CRUD tools → HA Config API  (HASS_SERVER over Tailscale, Bearer HASS_TOKEN)
          → HA writes device root *.yaml + auto-reloads the domain
        → SSE (AG-UI) stream back to panel
```

Two network facts, both already satisfied:
- **add-on → agent**: must use the laptop **LAN IP** (`terminus_agent_url`); the SSH/Copilot
  add-on runs in Docker bridge networking and cannot reach Tailscale peers (100.x).
- **agent → HA**: uses **Tailscale MagicDNS** (`HASS_SERVER`); the laptop is a tailnet peer.
  Verified: `GET /api/config/automation/config/__probe__` → HTTP 404 (route live, token valid).

### Boundary model

The Config API can only read/write entities in the device's editable root files
(`automations.yaml` / `scenes.yaml` / `scripts.yaml`). Packages-managed autos return **404** on
`GET /api/config/automation/config/<id>` — that 404 *is* the "hand-managed, hands-off" signal,
cross-checked against the build-time manifest. The agent therefore **cannot** corrupt
hand-authored infra in `packages/` — the separation enforces itself.

## Code changes (all under `apps/agent/src/`)

- **`lib/ha-client.ts`** (new) — `haFetch(path, init)`: base `HASS_SERVER`, `Authorization: Bearer
  HASS_TOKEN`, JSON, `AbortController` ~10s timeout, error normalization (non-2xx → structured
  `{ status, body }`).
- **`tools/ha-config-api.ts`** (new) — the 6 tools below.
- **`graph.ts`** (edit) — merge new tools into `tools[]`; expand `SYSTEM_PROMPT` with boundary
  rules, the soft-gate instruction, and the clone flow.
- **`tools/ha-manifest.ts`**, **`agent.ts`**, **`index.ts`** — unchanged.
- **`.env`** — already carries `HASS_SERVER` / `HASS_TOKEN` (currently unused); now load-bearing.

## Tool surface

All CRUD tools route through `haFetch`. `domain ∈ {automation, scene, script}`.

| Tool | Signature | HA call | Notes |
|---|---|---|---|
| `ha_read_manifest` | `()` | (disk, existing) | Packages context, read-only. Source of the packages-managed set. |
| `ha_config_list` | `(domain)` | `GET /api/states` filtered | Returns `[{entity_id, friendly_name, id, state, packages_managed}]`. `packages_managed` = id present in manifest. |
| `ha_config_get` | `(domain, id)` | `GET /api/config/<domain>/config/<id>` | Full config JSON. **404 = not editable** (packages-managed or absent). |
| `ha_config_upsert` | `(domain, id?, config)` | `POST /api/config/<domain>/config/<id>` | Create (id omitted → tool generates `String(Date.now())`, returns it) or overwrite. Body = config object, passed through; HA validates → 400 on bad. Auto-reloads. |
| `ha_config_delete` | `(domain, id)` | `DELETE /api/config/<domain>/config/<id>` | 404 if not editable. Auto-reloads. |
| `ha_automation_set_enabled` | `(entity_id, enabled)` | `POST /api/services/automation/turn_{on,off}` | Clone-disable flow. **Runtime-only — resets on reload/restart.** Tool desc says so; agent must warn. |

Net: 6 tools (1 existing manifest + 4 CRUD + 1 set_enabled).

### HA quirks to bake in (not optional)

- **script uses `object_id`** (the slug after `script.`) as `<id>` in the config path — not a
  generated numeric id. automation/scene use the `id:` field.
- **No native "list configs" endpoint** — `ha_config_list` reads `/api/states`, filters by domain
  prefix, and classifies. Editability is confirmed lazily: a `get`/`delete` 404 is the real signal,
  cross-checked against `packages_managed`.

## User flows

Soft gate = agent states the change, shows the config YAML, asks "confirm?", and waits for a user
turn before any destructive call. Pure create is non-destructive → skip the gate;
overwrite / delete / clone-disable → gated.

**1. Create** — "turn off the yard light at 11pm"
1. `ha_read_manifest` + `ha_config_list(automation)` — context, avoid semantic dup.
2. Draft config; echo YAML in chat.
3. `ha_config_upsert(automation, config)` (no id → tool generates + returns it).
4. HA validates + auto-reloads. Agent reports the new entity_id. *(No gate.)*

**2. Edit runtime** — "change that to 10pm"
1. `ha_config_list(automation)` → entity, `packages_managed: false`.
2. `ha_config_get(automation, id)` → current config.
3. Show updated YAML → **confirm?** → wait.
4. On yes: `ha_config_upsert(automation, id, newConfig)`. Auto-reload. Confirm.

**3. Edit packages-managed → clone** — "edit the living room TV automation"
1. `ha_config_list` / `ha_read_manifest` → `packages_managed: true`; `ha_config_get` 404 confirms.
2. Agent explains the original is hand-authored; **offers a runtime clone** with the change. Shows
   YAML → **confirm?** → wait.
3. On yes:
   - `ha_config_upsert(automation, clonedConfig)` → new runtime automation. The cloned config
     **must drop the original `id:` field** so the tool assigns a fresh id (else the body carries
     the packages id).
   - `ha_automation_set_enabled(original_entity, false)` → prevent double-fire.
   - **Warn**: original re-enables on HA restart/reload; to remove permanently, edit
     `packages/living_room.yaml` in the repo by hand.

**4. Delete** — "delete the yard automation"
1. `ha_config_list` → resolve id. If `packages_managed: true` → refuse (explain it's in the repo).
2. If runtime: show what will be deleted → **confirm?** → wait.
3. On yes: `ha_config_delete(automation, id)`. Auto-reload. Confirm. *(Recoverable only via HA
   backup — agent says so.)*

Scenes/scripts follow flows 1/2/4 identically (no enable/disable; script id = object_id).

## Error handling & validation

Tools **return** errors (not throw) so the ReAct loop can react and the model can fix-and-retry:

| Case | Tool returns | Why |
|---|---|---|
| 400 on upsert | HA's validation body verbatim | Model fixes config + retries — the key feedback loop. |
| 404 on get/delete | "not editable / not found — likely packages-managed; check manifest" | Drives clone-offer + delete-refuse. |
| 401 | "auth failed" | Shouldn't happen (admin token); surface clearly. |
| timeout / ECONN | "HA unreachable" | Agent tells user instead of hanging. `haFetch` `AbortController` ~10s. |
| 5xx | server error string | Transient; retry or report. |

- **Validation authority = HA** (400 feedback). The agent does not reimplement HA's config schema.
  Tool args get light zod guards only: `domain` enum, `id` string, `config` = passthrough object
  (`z.record(z.any())`). Accepted Approach-A trade-off.
- **Idempotency**: upsert = overwrite (safe re-run); delete on missing = 404 = already-gone.
- **ID generation**: create id = `String(Date.now())`; collision risk negligible on single-user
  dev. Noted as a minor known risk, not guarded.
- **Safety / blast radius**: admin token → agent can write editable config + toggle automations.
  Cannot touch `packages/`, `.storage/`, or any service beyond `automation.turn_on/off`. Soft gate
  is prompt-enforced (not hard) — a confused model could overwrite un-gated; HA backup is the net.

## Testing

`@terminus/agent` has no test setup today (only dev/build/start/typecheck). Add vitest +
`test` / `test:run`, mirroring `apps/dashboard`.

**Unit (mock global `fetch`) — no live HA:**
- `ha-client`: URL/header build, error normalization (400 / 404 / timeout).
- `upsert`: create (id-gen returned) vs overwrite (id passed); body passthrough; 400 body surfaced.
- `get`: 404 → "not editable" message.
- `list`: filters `/api/states` by domain; sets `packages_managed` from manifest.
- script **object_id** path is correct (`/api/config/script/config/<slug>`).

**Manual smoke (real HA on laptop, post-build):** drive create → edit → clone → delete of a
throwaway automation through Copilot; verify the device root `*.yaml` updated, the domain reloaded,
and the entity appears/disappears.

## Out of scope (v1)

- Helpers (`input_*`, schedule) and any storage-collection-only entities.
- Git/source-control sync of agent-authored entities (device-only by decision).
- Hard human-in-the-loop interrupt gate (soft gate only).
- In-HA add-on packaging (laptop dev; add-on is a later prod step).
- Arbitrary service calls beyond `automation.turn_on/off`.
