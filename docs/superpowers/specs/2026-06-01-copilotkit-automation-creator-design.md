# CopilotKit Automation Creator — Design

**Date**: 2026-06-01
**Scope**: V1. NL → HA automation, create-only, via Terminus side panel.

## Problem

Terminus today is a read-only graph of existing automations. Users still hand-write YAML in `packages/*.yaml` or click through the HA UI editor to create new automations. Goal: let the user describe an automation in plain English from inside Terminus and have it land in `automations.yaml`, live, in seconds.

## Decisions Locked During Brainstorm

| Q | Decision |
|---|---|
| Runtime location | **B** — self-hosted CopilotKit runtime as new HA add-on |
| Write target | **A** — `automations.yaml` via HA REST (`/api/config/automation/config/<id>`) |
| V1 scope | **A** — create-only; no edit, delete, or diagnostics |
| LLM grounding | **C** — hybrid: preload entity_ids/areas/scenes/scripts via `useCopilotReadable`; live state via tool call |
| Pre-write validation | **B** — sanity check: entity_ids exist in registry + YAML parses |
| Anthropic model | **A** — `claude-haiku-4-5` |

## Architecture

Two pieces:

1. **`addons/terminus-copilot/`** — new HA local add-on. Node 22-alpine + Express + `@copilotkit/runtime` + `@anthropic-ai/sdk`. Mounts `POST /api/copilotkit`. Exposed via HA Ingress (`ingress: true`, `ingress_port: 3000`). No public port. Reads `ANTHROPIC_API_KEY` from add-on options (user pastes into HA Settings → Add-ons → Configuration; mirrors `secrets.yaml: anthropic_api_key`). Stateless. Anthropic prompt caching enabled.

2. **`main/terminus/`** — existing React panel, edited. Adds `@copilotkit/react-core` + `@copilotkit/react-ui`. Wraps `<Shell>` in `<CopilotKit runtimeUrl=…>`. Mounts `<CopilotSidebar>` in shell. Resolves `runtimeUrl` at boot from `window.location.pathname` (HA ingress prefix); dev fallback `http://localhost:3000/api/copilotkit`.

**Data path**: browser → HA Ingress → add-on Express → Anthropic. Add-on holds the Anthropic key. The frontend writes automation YAML via existing HA REST authed by the existing `hassConnection` token — the runtime does not touch HA's REST.

**Shadow DOM caveat**: CopilotKit's CSS must be injected into the same shadow root as Tailwind, following the existing pattern in `src/main.tsx`. Manual verification inside HA required after first build (vitest does not catch chrome bleed).

## Components

### Add-on layout

```
addons/terminus-copilot/
├── config.yaml          # HA add-on manifest
├── Dockerfile           # node:22-alpine
├── package.json         # express, @copilotkit/runtime, @anthropic-ai/sdk, js-yaml, typescript
├── pnpm-lock.yaml
├── tsconfig.json
├── src/
│   ├── server.ts        # Express boot, port 3000, /api/copilotkit mount
│   └── runtime.ts       # CopilotRuntime + AnthropicAdapter wiring
├── src/runtime.test.ts  # smoke test
└── README.md            # install + config instructions
```

`config.yaml`:
```yaml
name: Terminus Copilot
version: "0.1.0"
slug: terminus_copilot
description: CopilotKit runtime for natural-language automation creation in Terminus.
arch: [aarch64, amd64]
init: false
ingress: true
ingress_port: 3000
options:
  anthropic_api_key: ""
schema:
  anthropic_api_key: password
```

### Frontend layout (new + edited files)

| File | Status | Role |
|---|---|---|
| `src/lib/copilot.tsx` | new | `<CopilotProvider>` wrapper; resolves ingress URL from `window.location.pathname` |
| `src/copilot/readable.tsx` | new | `useCopilotReadable` hook emitting catalog (areas, entity_ids, scenes, scripts, aliases, current_time) |
| `src/copilot/actions.tsx` | new | `useCopilotAction` definitions for the three tools |
| `src/copilot/PreviewCard.tsx` | new | Custom `render` for `propose_automation` — YAML preview + Approve/Reject |
| `src/lib/automationWriter.ts` | new | Pure module: validate, serialize, POST to HA, reload |
| `src/lib/automationWriter.test.ts` | new | Validation, serialization, fetch mock |
| `src/copilot/*.test.tsx` | new | Per-component tests |
| `src/App.tsx` | edit | Wrap `<Shell>` in `<CopilotProvider>`; mount `<CopilotSidebar>` |
| `src/main.tsx` | edit | Inject CopilotKit CSS into shadow root alongside Tailwind |
| `package.json` | edit | Add `@copilotkit/react-core`, `@copilotkit/react-ui` deps |

### CopilotKit tools

| Tool | Args | Effect | Returns |
|---|---|---|---|
| `get_entity_state` | `entity_id: string` | Filter `LiveStateProvider` snapshot for the entity. Read-only. | `{state, attributes}` or `{error:"not_found"}` |
| `propose_automation` | `{alias, description, mode, triggers[], conditions[], actions[]}` (structured, not raw YAML) | Frontend renders `PreviewCard` with serialized YAML + Approve/Reject. Tool resolves on user click. | `{approved:boolean, feedback?:string}` |
| `commit_automation` | same shape as `propose_automation` | (1) `GET /api/config/automation/config/<id>` — reject with `id_conflict` if it returns 200; (2) validate entity_ids against live registry; (3) serialize YAML; (4) `POST /api/config/automation/config/<id>`; (5) `POST /api/services/automation/reload`. | `{ok, id?, error?:{kind, detail}}` |

Tool args are structured JSON, not raw YAML strings, so schema validation happens at the tool boundary. YAML stringification lives in `automationWriter.ts`. LLM is instructed via system prompt to always call `propose_automation` before `commit_automation` and to skip `commit_automation` when the user rejected.

## Data Flow

### Boot

1. HA `panel_custom` loads `<terminus-panel>`.
2. `App.tsx` boots: `loadManifest()` → static manifest, `LiveStateProvider` connects WS.
3. `<CopilotProvider>` resolves ingress URL by matching `^/api/hassio_ingress/[^/]+/` from `window.location.pathname`. Constructs `runtimeUrl = ${prefix}/api/copilotkit`. Dev fallback to `http://localhost:3000/api/copilotkit`.
4. `<CopilotSidebar>` mounts collapsed.

### NL → automation (happy path)

```
user: "turn LR lamp off at 22:00 weekdays"
   ↓ CopilotSidebar POST runtimeUrl (prompt + tools + readable context)
   ↓ HA Ingress → add-on Express
   ↓ CopilotRuntime → AnthropicAdapter → Anthropic API
LLM grounds on catalog (knows `switch.lr_lamp` from readable)
LLM emits tool_use: propose_automation({alias, mode:"single", triggers:[time], actions:[switch.turn_off]})
   ↓ SSE to browser
Browser invokes useCopilotAction.render → <PreviewCard> with serialized YAML
User clicks Approve
Tool resolves with {approved:true}
LLM emits tool_use: commit_automation(<same shape>)
Browser automationWriter.commit():
   1. validate entity_ids against live WS registry
   2. js-yaml dump
   3. POST /api/config/automation/config/<id>
   4. POST /api/services/automation/reload
LLM gets {ok:true, id} → renders confirmation in sidebar
```

### Failure branches

| Failure | Handling |
|---|---|
| User clicks Reject in PreviewCard | Tool returns `{approved:false}`. LLM continues conversation, can re-propose. |
| Entity_id missing in registry | `commit_automation` returns `{ok:false, error:{kind:"unknown_entity", detail}}`. LLM re-proposes with corrected slug. |
| YAML serialization throws | `{ok:false, error:{kind:"yaml_parse", detail}}`. LLM re-proposes. |
| HA REST 4xx/5xx | `{ok:false, error:{kind:"ha_rest", detail:status+body}}`. No client retry. |
| Ingress 502 (add-on down) | Sidebar shows "Copilot unavailable — add-on not running?" toast. |
| Anthropic 429 | Runtime returns error → sidebar surfaces. User waits. |
| `id` already exists in `automations.yaml` | `{ok:false, error:{kind:"id_conflict"}}`. LLM picks fresh slug or asks user. |

### Readable context shape (per turn)

```ts
{
  areas: {mb: "Master Bedroom", lr: "Living Room", abi: "Abi's room"},
  entities: ["switch.lr_lamp", "light.mb_led_one", ...],  // ids only, no state
  scenes: ["scene.lr_dim", ...],
  scripts: [...],
  current_time: "2026-06-01T15:30:00-06:00",
  user_location: "Costa Rica UTC-6 ~10°N",
}
```

Live state (`on`/`off`/attrs) fetched on demand via `get_entity_state`, not preloaded.

## Error Handling & Security

### Rules

- No silent failures. Every tool returns `{ok, error?}` — LLM sees errors in-band, no toasts swallow tool errors.
- No client-side retries. The LLM decides whether to retry; it has full context.
- Validation errors are structured (`error.kind`) so the LLM can react differentially: `unknown_entity` → re-propose; `id_conflict` → pick new slug; `ha_rest` → surface to user.
- Fail-fast on ingress URL resolution. If `<CopilotProvider>` cannot parse the ingress prefix, render disabled sidebar with explanation rather than crashing.
- Do not render `<CopilotSidebar>` until `LiveStateProvider` status === `connected` — otherwise `get_entity_state` would 500 on every call.

### Security

- Anthropic key never reaches the browser. Stored in add-on options at `/data/options.json`, root-readable. Add-on reads at boot.
- Ingress provides same-origin auth. HA injects a per-session ingress token into the URL prefix; only authenticated HA users can reach `/api/copilotkit`. No CORS, no public port.
- The LLM cannot directly call HA REST. `commit_automation` runs in the browser under the user's HA auth — same surface as HA's UI editor.
- Tool args revalidated server-side at the write boundary. `commit_automation` re-checks entity_ids against the live registry, not just the LLM-claimed catalog. Defends against stale-catalog or jailbroken-LLM bogus IDs.
- ID collision rejected; no overwrites.
- v1 has no separate rate-limit gate. Anthropic adapter's 429 surfaces naturally.

### Explicitly out of scope (YAGNI)

- Audit log of NL → YAML conversions.
- Multi-tab conversation history (sidebar is per-tab in-memory).
- Edit / delete / disable operations.
- Full HA `check_config` validation.
- Trace / diagnostics tools.
- Repo-side commit of generated YAML to `packages/`.
- Promotion path from `automations.yaml` → `packages/` (a graduation flow can be added later).

## Testing

### Add-on (`addons/terminus-copilot/`)

- `src/runtime.test.ts` — vitest smoke: `createRuntime({apiKey:"fake"})` returns Express handler, mounts `/api/copilotkit`, health endpoint returns 200. Anthropic SDK mocked.
- Manual integration: `docker build && docker run` locally, curl health, watch logs.
- On-device verify: `ha addons install`, hit ingress URL, watch logs in HA UI.

### Frontend (`main/terminus/`)

| File | Coverage |
|---|---|
| `copilot/readable.test.tsx` | `useCopilotReadable` emits expected catalog shape from manifest + registry fixtures |
| `copilot/actions.test.tsx` | Each `useCopilotAction` schema validates; `get_entity_state` happy + missing-entity error paths; `propose_automation` resolves with approve/reject state |
| `copilot/PreviewCard.test.tsx` | Renders YAML preview, Approve/Reject buttons fire correct callbacks |
| `lib/automationWriter.test.ts` | **Highest priority.** Validation rejects unknown entity_ids; YAML round-trip stable; slug+hash id generation deterministic; POST body shape matches HA `/api/config/automation/config/<id>` (fetch mocked) |
| `lib/copilot.test.tsx` | Ingress URL resolver: parses HA pathname; falls back to dev URL when no ingress prefix |

### Not tested

- LLM output quality. "Turn off LR lights at 22:00" → correct YAML is empirical; Anthropic non-determinism makes pinning brittle.
- Shadow DOM CSS injection. happy-dom does not catch HA chrome bleed (same caveat as existing Tailwind layer). Manual verification.
- End-to-end against real HA. Fetch mocked in unit tests; full path verified manually on first deploy.

### Acceptance smoke (manual, post-deploy)

1. Type "turn LR lamp off at 22:00" → preview card appears with valid YAML.
2. Approve → automation appears in HA UI under Settings → Automations.
3. Manually trigger time → lamp goes off.
4. Type "turn off the fridge light" (no such entity) → LLM responds with "no entity matches" or proposes a close match; no bad write occurs.
5. Reject preview → no write; LLM offers refinement.

## Open Questions Deferred

- Add-on distribution: committed to this repo under `addons/terminus-copilot/` and installed via "Local add-on" in HA, or hosted in a separate repo. Default for v1: in-repo, since the rest of the project is committed here.
- System prompt copy for the LLM (tone, constraints, examples). To be drafted during implementation; not architectural.
