# Scene / Automation Modal Behavior — Design Spec
Date: 2026-06-19

## Problem

Entity nodes in the Topology graph open a detail modal on the second click. Scene and automation nodes always navigate to their drill-down view, even when you are already inside that view. There is no way to inspect a scene's or automation's HA entity state from within its own detail view.

## Goal

When a user is already viewing a scene's or automation's detail graph (i.e., the current view IS that scene/automation), clicking its root node shows the EntityDetailModal instead of re-navigating. All other click paths remain unchanged.

## Behavioral Rules

| Context (view.kind) | Node clicked | Result |
|---|---|---|
| `"area"` / `"scenes"` / `"automations"` | scene node | navigate to scene drill-down (unchanged) |
| `"area"` / `"scenes"` / `"automations"` | automation node | navigate to automation drill-down (unchanged) |
| `"automation"` | leaf scene node (different id) | navigate to scene drill-down (unchanged) |
| `"scene"` + `view.sceneId === data.sceneId` | scene root node | open EntityDetailModal |
| `"automation"` + `view.automationId === data.automationId` | automation root node | open EntityDetailModal |

The modal condition requires both the view kind AND the matching id — this ensures a scene node that references a *different* scene still navigates rather than opening the wrong modal.

## Changes Required

### 1. `src/lib/ha-graph/build.ts`

**`buildSceneGraph`** — root scene node (line ~363): add `interactive: true`.  
Without it the 2-click pattern never fires because the handler early-exits on `!data.interactive`.

**`buildAutomationGraph`** — root automation node (line ~418): add `interactive: true`.  
Same reason.

No other nodes are affected.

### 2. `src/components/graph/GraphCanvas.tsx`

In `onNodeClick` (lines 221–234), replace the flat navigate-only branches with view-aware checks:

```typescript
} else if (data.kind === "scene" && data.sceneId) {
  if (view.kind === "scene" && view.sceneId === data.sceneId) {
    setEntityModal(data.entityId!);
  } else {
    setView({
      kind: "scene",
      areaId: currentAreaId ?? "",
      sceneId: data.sceneId,
      via: view.kind === "scenes" ? "scenes" : "area",
    });
  }
} else if (data.kind === "automation" && data.automationId) {
  if (view.kind === "automation" && view.automationId === data.automationId) {
    setEntityModal(data.entityId!);
  } else {
    setView({
      kind: "automation",
      areaId: currentAreaId ?? "",
      automationId: data.automationId,
      via: view.kind === "automations" ? "automations" : "area",
    });
  }
}
```

### 3. `src/components/graph/EntityDetailModal.tsx`

No changes. The modal reads `entityModalAtom` (an entity_id string) and fetches `/api/states/{entityId}`. Scene and automation entity_ids (`scene.lr_dim`, `automation.lr_sunset_dim`) are valid HA entities — their state and attributes render correctly with zero modifications.

## Out of Scope

- A richer scene-specific modal (entity list) or automation-specific modal (config summary) — deferred.
- Any changes to node styling or the breadcrumb trail.
- Storybook story updates (the interaction requires live HA state; unit-level stories for click behavior already exist).
