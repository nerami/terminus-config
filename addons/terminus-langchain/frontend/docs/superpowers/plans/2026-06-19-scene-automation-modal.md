# Scene / Automation Modal Behavior — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When viewing a scene or automation detail graph, clicking its root node opens EntityDetailModal instead of re-navigating; all other click paths remain unchanged.

**Architecture:** Two targeted edits. `build.ts` gains `interactive: true` on the root nodes of `buildSceneGraph` and `buildAutomationGraph` so the 2-click pattern fires at all. `GraphCanvas.tsx` gains a view-kind+id guard in `onNodeClick` that routes to `setEntityModal` only when the clicked node IS the current view's scene/automation; every other click path navigates as before.

**Tech Stack:** TypeScript, React, @xyflow/react, Jotai, Vitest + @testing-library/react.

## Global Constraints

- `pnpm` only — never `npm install`.
- Run `pnpm test:run` (Vitest) from `addons/terminus-langchain/frontend/`.
- Do NOT bump `package.json` version or `config.yaml` version — this is a source-only change.
- Conventional commit prefix: `feat:`.

---

### Task 1: Make root nodes interactive in `build.ts`

**Files:**
- Modify: `src/lib/ha-graph/build.ts:363-369` (scene root node data)
- Modify: `src/lib/ha-graph/build.ts:422-429` (automation root node data)
- Test: `src/lib/ha-graph/build.test.ts`

**Interfaces:**
- Produces: `buildSceneGraph` root node has `data.interactive === true`; `buildAutomationGraph` root node has `data.interactive === true`. Task 2 relies on these flags existing so the click handler's `if (!data.interactive) return` guard doesn't short-circuit.

- [ ] **Step 1: Write failing tests for root node interactivity**

Add these two `it` blocks to `src/lib/ha-graph/build.test.ts`. First, add `buildSceneGraph` to the existing import:

```typescript
import {
  automationHasStructure,
  buildAreaGraph,
  buildAreasGraph,
  buildAutomationGraph,
  buildSceneGraph,
} from "./build";
import type { AutomationDetail, HaAutomation, HaScene, Topology } from "./types";
```

Then add a new `describe` block at the end of the file (after the existing `buildAutomationGraph` describe block):

```typescript
describe("buildSceneGraph", () => {
  it("root scene node is interactive so double-click fires the modal", () => {
    const scene: HaScene = topology.scenes[0];
    const { nodes } = buildSceneGraph(topology, scene);
    const root = nodes.find((n) => n.id === scene.entity_id);
    expect(root?.data.interactive).toBe(true);
  });

  it("entity child nodes are interactive", () => {
    const scene: HaScene = topology.scenes[0];
    const { nodes } = buildSceneGraph(topology, scene);
    const child = nodes.find((n) => n.id === "light.lamp");
    expect(child?.data.interactive).toBe(true);
  });
});

describe("buildAutomationGraph root node", () => {
  it("root automation node is interactive so double-click fires the modal", () => {
    const automation: HaAutomation = topology.automations[0];
    const detail: AutomationDetail = {
      config: {},
      referenced: { entities: ["light.lamp"], scenes: [], devices: [] },
    };
    const { nodes } = buildAutomationGraph(topology, automation, detail);
    const root = nodes.find((n) => n.id === automation.entity_id);
    expect(root?.data.interactive).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd addons/terminus-langchain/frontend
pnpm test:run src/lib/ha-graph/build.test.ts
```

Expected: two new tests fail — `root scene node is interactive` and `root automation node is interactive`. Existing tests pass.

- [ ] **Step 3: Add `interactive: true` to `buildSceneGraph` root**

In `src/lib/ha-graph/build.ts`, find the root node inside `buildSceneGraph` (around line 363). Add `interactive: true`:

```typescript
  const nodes: RFNode[] = [
    {
      id: scene.entity_id,
      type: "scene",
      position: { x: 0, y: 0 },
      data: {
        label: scene.name,
        kind: "scene",
        entityId: scene.entity_id,
        sceneId: scene.entity_id,
        sublabel: `${scene.entities.length} entities`,
        interactive: true,
      },
    },
  ];
```

- [ ] **Step 4: Add `interactive: true` to `buildAutomationGraph` root**

In `src/lib/ha-graph/build.ts`, find the root node push inside `buildAutomationGraph` (around line 418). Add `interactive: true`:

```typescript
  nodes.push({
    id: rootId,
    type: "automation",
    position: { x: 0, y: 0 },
    data: {
      label: automation.name,
      kind: "automation",
      entityId: automation.entity_id,
      automationId: automation.entity_id,
      sublabel: "automation",
      interactive: true,
    },
  });
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
cd addons/terminus-langchain/frontend
pnpm test:run src/lib/ha-graph/build.test.ts
```

Expected: all tests pass, including the two new ones.

- [ ] **Step 6: Commit**

```bash
git add addons/terminus-langchain/frontend/src/lib/ha-graph/build.ts \
        addons/terminus-langchain/frontend/src/lib/ha-graph/build.test.ts
git commit -m "feat: make scene/automation root nodes interactive in detail views"
```

---

### Task 2: View-aware click routing in `GraphCanvas.tsx`

**Files:**
- Modify: `src/components/graph/GraphCanvas.tsx:219-235` (scene and automation branches of `onNodeClick`)

**Interfaces:**
- Consumes: `entityModalAtom` setter (`setEntityModal`) — already imported via `useAtom(entityModalAtom)` in `GraphCanvas.tsx`. `GraphView` type from `atoms.ts` — `view.sceneId` and `view.automationId` are present on the `"scene"` and `"automation"` view variants respectively.

- [ ] **Step 1: Update the scene branch in `onNodeClick`**

In `src/components/graph/GraphCanvas.tsx`, locate the `onNodeClick` callback (around line 200). Replace the flat scene branch (lines ~221-227):

**Before:**
```typescript
      } else if (data.kind === "scene" && data.sceneId) {
        setView({
          kind: "scene",
          areaId: currentAreaId ?? "",
          sceneId: data.sceneId,
          via: view.kind === "scenes" ? "scenes" : "area",
        });
```

**After:**
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
```

- [ ] **Step 2: Update the automation branch in `onNodeClick`**

Immediately after the scene branch, replace the flat automation branch (lines ~228-235):

**Before:**
```typescript
      } else if (data.kind === "automation" && data.automationId) {
        setView({
          kind: "automation",
          areaId: currentAreaId ?? "",
          automationId: data.automationId,
          via: view.kind === "automations" ? "automations" : "area",
        });
      }
```

**After:**
```typescript
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

- [ ] **Step 3: Run the full test suite**

```bash
cd addons/terminus-langchain/frontend
pnpm test:run
```

Expected: all tests pass (no regressions — GraphCanvas has no unit tests, which is fine; the click logic is covered by manual verification in the next step).

- [ ] **Step 4: Manual verification**

Start the dev server:
```bash
cd addons/terminus-langchain/frontend
pnpm dev
```

Verify each path through the click handler:

| Scenario | Steps | Expected |
|---|---|---|
| Navigate to scene | Area view → click scene node → click again | Drill into scene view |
| Scene modal | Scene view → click root scene node → click again | EntityDetailModal opens |
| Navigate to automation | Area view → click automation node → click again | Drill into automation view |
| Automation modal | Automation view → click root automation node → click again | EntityDetailModal opens |
| Scene in automation view | Automation view → click a leaf scene node → click again | Navigates to scene view (not modal) |
| Entity modal unchanged | Any view → click entity node → click again | EntityDetailModal opens as before |

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-langchain/frontend/src/components/graph/GraphCanvas.tsx
git commit -m "feat: show modal instead of navigating when clicking root scene/automation node"
```
