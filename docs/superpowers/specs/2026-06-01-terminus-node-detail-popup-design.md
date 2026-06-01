# Terminus Node Detail Popup — Design

**Date:** 2026-06-01
**Scope:** `main/terminus/`
**Status:** Approved (ready for implementation plan)

## Goal

Make non-automation nodes in the Terminus graph clickable. Clicking an entity, scene, script, or template node opens a side sheet showing its registry-derived configuration (area, enabled/visible flags, labels, voice-assistant exposure, source location) plus a deep link to that node's native HA configuration page. Automation nodes keep their existing drill-in behavior (per-automation DAG) and never open the sheet.

## Non-Goals

- Editing entity config from the popup (read-only — HA handles writes).
- Reflecting registry changes in real time (cached at panel mount; manual refresh button).
- Showing automation internals in the sheet (those have a dedicated route).
- Surfacing a YAML viewer for repo-managed entities — show `file:line` as plain text only.

## Architecture

### Registry context provider

New `src/lib/registry.tsx` mirrors `LiveStateProvider`. On mount, awaits `connectHA()` and issues four WebSocket calls in parallel:

| WS type | Maps to |
|---|---|
| `config/entity_registry/list` | `entities: Map<entity_id, EntityRegistryEntry>` |
| `config/area_registry/list` | `areas: Map<area_id, AreaEntry>` |
| `config/label_registry/list` | `labels: Map<label_id, LabelEntry>` |
| `homeassistant/expose_entity/list` | `exposure: Map<entity_id, Record<assistant, boolean>>` |

Provider exposes `status: "loading" | "ready" | "error"`, a `refresh()` callback, and `useRegistryEntry(entity_id)` hook that returns a merged shape:

```ts
type RegistryEntry = {
  entityId: string
  areaName: string | null     // resolved from area_id
  enabled: boolean             // !disabled_by
  visible: boolean             // !hidden_by
  labels: string[]             // label names resolved from label_ids
  exposure: Record<string, boolean>  // empty when exposure call unsupported
  platform: string | null
  inRegistry: boolean          // false → YAML template w/ no registry entry
}
```

Mounted in `App.tsx` alongside `LiveStateProvider`.

### Sheet component

`src/components/NodeDetailSheet.tsx` uses shadcn `Sheet` (right side, slide-in). Add the shadcn sheet primitive first: `pnpm dlx shadcn@latest add sheet`.

Sections (top to bottom):
1. **Header** — node label, kind badge, current state badge (reuses existing `useEntityState`).
2. **Area** — resolved area name, or "Unassigned".
3. **Status** — Enabled / Visible flags as boolean badges.
4. **Labels** — chip list, or "—" when none.
5. **Voice exposure** — one row per assistant from `exposure[entity_id]`. Empty section shows "No voice assistant exposure."
6. **Source** — `file:line` from manifest, plain text.
7. **Actions** — single `<a target="_top">` to the HA config page (URLs below). For YAML-only entries where the page doesn't exist, HA itself renders the "not editable" message — that's the contract.

Link targets:

| Kind | URL (joined with `window.location.origin`) |
|---|---|
| script | `/config/script/edit/<object_id>` where `object_id = entity_id.split('.')[1]` |
| scene | `/config/scene/edit/<scene_id>` (fallback to `object_id` when storage UUID unknown) |
| entity / template | `/config/entities/entity/<entity_id>` |
| automation | n/a — never opens sheet |

### SystemMap integration

`src/routes/SystemMap.tsx` gains an `onNodeClick(_, node)` handler:
- `node.type === "automation"` → existing `navigate(\`#/auto/<id>\`)` path (no change to current behavior).
- Else → call `onSelect(node)` prop passed by `App.tsx`.

`App.tsx` owns the sheet open state and the currently selected node id, so clicking different nodes keeps the sheet mounted and just swaps content.

## Data Flow

```
panel mount
  → connectHA()
  → RegistryProvider effect: 4 parallel WS calls
  → status = ready, children render

user clicks entity/scene/script/template node
  → SystemMap.onNodeClick → App.setSelected({ id, kind })
  → App.setSheetOpen(true)

NodeDetailSheet renders, pulling:
  → manifest.nodes[id] for label, area, source
  → useRegistryEntry(entity_id) for area name, flags, labels, exposure
  → useEntityState(entity_id) for current state badge (already exists)

action link href = window.location.origin + per-kind path
target="_top" so HA chrome navigates, not the panel iframe-less container
```

## Error Handling

| Scenario | Behavior |
|---|---|
| WS calls fail on mount | `status = "error"`, sheet still opens, sections show "Registry unavailable" + retry button calling `refresh()`. |
| Entity missing from registry (common for YAML template sensors) | `inRegistry = false`. Render manifest-derived fields (label, prefix-area, source); other sections render "—". |
| `homeassistant/expose_entity/list` returns error (older HA core) | Exposure map stays empty; section shows "Exposure data unavailable on this HA version." |
| `area_id` null or area missing from `areas` map | "Unassigned". |
| Click on edge / canvas / minimap | Ignored — only `onNodeClick` triggers the sheet. |
| Refresh button clicked while loading | No-op (button disabled when `status === "loading"`). |

## Testing

Stack: existing vitest + `@testing-library/react` + happy-dom. Fixtures in `__fixtures__/registry/{entity,area,label,exposure}.json`, hand-crafted to match HA WS reply shape (use a real reply as the template).

| File | Coverage |
|---|---|
| `src/lib/registry.test.tsx` | Provider mounts → `loading` → `ready`; maps populated from fixtures; `useRegistryEntry` returns merged shape; one rejected call → `error` status; `refresh()` re-runs calls. |
| `src/components/NodeDetailSheet.test.tsx` | Renders `light.lr_lamp` w/ mocked context → asserts area name, enabled/visible badges, label chips, exposure rows, source `file:line`, correct `href`. Entity-not-in-registry case → "—" placeholders, no crash. |
| `src/routes/SystemMap.test.tsx` (extend) | Click on automation node calls `navigate`, does not call `onSelect`. Click on entity node calls `onSelect` with the right id/kind. |

Manual verification (required — vitest can't catch HA chrome / shadow DOM regressions):
1. `pnpm build` → commit `www/terminus/*` artifacts.
2. `bin/deploy-ssh.sh`.
3. Open the panel, click one node of each kind (entity, scene, script, template).
4. Verify popup contents match `Settings → Devices & Services → Entities` for the same entity.
5. Click the action link, confirm it lands on the right HA page.

## Files Touched

**New:**
- `src/lib/registry.tsx`
- `src/lib/registry.test.tsx`
- `src/components/NodeDetailSheet.tsx`
- `src/components/NodeDetailSheet.test.tsx`
- `src/components/ui/sheet.tsx` (shadcn add)
- `__fixtures__/registry/{entity,area,label,exposure}.json`

**Modified:**
- `src/App.tsx` — wrap with `RegistryProvider`, own sheet state.
- `src/routes/SystemMap.tsx` — add `onNodeClick`, accept `onSelect` prop.
- `src/routes/SystemMap.test.tsx` — extend.
- `package.json` — adds `@radix-ui/react-dialog` dep pulled in by shadcn sheet.

## Open Items

None. All design questions resolved during brainstorming session 2026-06-01.
