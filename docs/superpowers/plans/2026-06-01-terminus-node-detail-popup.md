# Terminus Node Detail Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make non-automation nodes in the Terminus React Flow graph open a side sheet with HA-registry-derived configuration (area, enabled/visible flags, labels, voice exposure, source) plus a deep link to the entity's native HA page.

**Architecture:** A `RegistryProvider` (parallel to existing `LiveStateProvider`) fetches four registries via WebSocket once at panel mount and caches them in context. `SystemMap` gains an `onNodeClick` handler that calls `onSelect` from `App.tsx` for non-automation kinds; automation clicks keep current `navigate(#/auto/<id>)` behavior. `App.tsx` owns sheet open state and renders `NodeDetailSheet` (shadcn Sheet) above the graph.

**Tech Stack:** React 19, TypeScript, vite, shadcn/ui (Sheet primitive), Tailwind v4, `@xyflow/react`, `home-assistant-js-websocket`, vitest + `@testing-library/react` + happy-dom.

**Spec:** `docs/superpowers/specs/2026-06-01-terminus-node-detail-popup-design.md`

---

## File Structure

**New files:**
- `main/terminus/src/lib/registry.tsx` — context provider + `useRegistryEntry` hook
- `main/terminus/src/lib/registry.test.tsx` — provider unit tests
- `main/terminus/src/components/NodeDetailSheet.tsx` — sheet UI
- `main/terminus/src/components/NodeDetailSheet.test.tsx` — sheet unit tests
- `main/terminus/src/components/ui/sheet.tsx` — shadcn Sheet primitive (added via CLI)
- `main/terminus/__fixtures__/registry/entity.json`
- `main/terminus/__fixtures__/registry/area.json`
- `main/terminus/__fixtures__/registry/label.json`
- `main/terminus/__fixtures__/registry/exposure.json`

**Modified:**
- `main/terminus/src/App.tsx` — wrap with `RegistryProvider`, own sheet state, render sheet
- `main/terminus/src/routes/SystemMap.tsx` — `onNodeClick` handler with `onSelect` prop
- `main/terminus/src/routes/SystemMap.test.tsx` — extend with click-dispatch coverage
- `main/terminus/package.json` — adds `@radix-ui/react-dialog` (pulled in by shadcn sheet)

All commands run from `main/terminus/`. Use `pnpm` only — never npm/yarn.

---

## Task 1: Add shadcn Sheet primitive

**Files:**
- Create: `main/terminus/src/components/ui/sheet.tsx` (generated)
- Modify: `main/terminus/package.json` (auto)
- Modify: `main/terminus/pnpm-lock.yaml` (auto)

- [ ] **Step 1: Add the shadcn sheet component**

Run from `main/terminus/`:

```bash
pnpm dlx shadcn@latest add sheet
```

When prompted about overwriting, accept defaults. This creates `src/components/ui/sheet.tsx` and adds `@radix-ui/react-dialog` to `package.json`.

- [ ] **Step 2: Verify typecheck still passes**

Run from `main/terminus/`:

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd main
git add terminus/src/components/ui/sheet.tsx terminus/package.json terminus/pnpm-lock.yaml
git commit -m "chore(terminus): add shadcn sheet primitive"
```

---

## Task 2: Registry fixtures

**Files:**
- Create: `main/terminus/__fixtures__/registry/entity.json`
- Create: `main/terminus/__fixtures__/registry/area.json`
- Create: `main/terminus/__fixtures__/registry/label.json`
- Create: `main/terminus/__fixtures__/registry/exposure.json`

These match the real HA WebSocket reply shapes. Used by both registry and sheet tests.

- [ ] **Step 1: Create entity registry fixture**

Create `main/terminus/__fixtures__/registry/entity.json`:

```json
[
  {
    "entity_id": "light.lr_lamp",
    "area_id": "lr",
    "device_id": "dev1",
    "disabled_by": null,
    "hidden_by": null,
    "labels": ["climate"],
    "platform": "tuya",
    "config_entry_id": "ce1",
    "name": null,
    "icon": null
  },
  {
    "entity_id": "scene.lr_dim",
    "area_id": "lr",
    "device_id": null,
    "disabled_by": null,
    "hidden_by": null,
    "labels": [],
    "platform": "scene",
    "config_entry_id": null,
    "name": null,
    "icon": null
  },
  {
    "entity_id": "switch.mb_disabled",
    "area_id": "mb",
    "device_id": "dev2",
    "disabled_by": "user",
    "hidden_by": null,
    "labels": [],
    "platform": "tuya",
    "config_entry_id": "ce1",
    "name": null,
    "icon": null
  }
]
```

- [ ] **Step 2: Create area registry fixture**

Create `main/terminus/__fixtures__/registry/area.json`:

```json
[
  { "area_id": "lr", "name": "Living Room", "icon": null, "labels": [] },
  { "area_id": "mb", "name": "Master Bedroom", "icon": null, "labels": [] }
]
```

- [ ] **Step 3: Create label registry fixture**

Create `main/terminus/__fixtures__/registry/label.json`:

```json
[
  { "label_id": "climate", "name": "Climate", "color": "blue", "icon": null, "description": null }
]
```

- [ ] **Step 4: Create exposure fixture**

Create `main/terminus/__fixtures__/registry/exposure.json`:

```json
{
  "exposed_entities": {
    "light.lr_lamp": { "conversation": true },
    "scene.lr_dim": { "conversation": false }
  }
}
```

- [ ] **Step 5: Commit**

```bash
cd main
git add terminus/__fixtures__/registry
git commit -m "test(terminus): add HA registry fixtures"
```

---

## Task 3: Registry provider — types and failing tests

**Files:**
- Create: `main/terminus/src/lib/registry.test.tsx`

Defines the `RegistryEntry` contract and proves the provider transitions states correctly.

- [ ] **Step 1: Write the failing test file**

Create `main/terminus/src/lib/registry.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { RegistryProvider, useRegistryEntry, useRegistryStatus } from "./registry"
import entityFixture from "../../__fixtures__/registry/entity.json"
import areaFixture from "../../__fixtures__/registry/area.json"
import labelFixture from "../../__fixtures__/registry/label.json"
import exposureFixture from "../../__fixtures__/registry/exposure.json"

const sendMessagePromise = vi.fn()
const fakeConn = { sendMessagePromise, close: vi.fn() }

vi.mock("@/lib/ha", () => ({
  connectHA: () => Promise.resolve(fakeConn),
  watchEntities: () => () => {},
}))

beforeEach(() => {
  sendMessagePromise.mockReset()
  sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
    if (msg.type === "config/entity_registry/list") return entityFixture
    if (msg.type === "config/area_registry/list") return areaFixture
    if (msg.type === "config/label_registry/list") return labelFixture
    if (msg.type === "homeassistant/expose_entity/list") return exposureFixture
    throw new Error("unexpected message: " + msg.type)
  })
})

function StatusProbe() {
  const status = useRegistryStatus()
  return <span data-testid="status">{status}</span>
}

function EntryProbe({ id }: { id: string }) {
  const entry = useRegistryEntry(id)
  if (!entry) return <span data-testid="missing">missing</span>
  return (
    <div>
      <span data-testid="area">{entry.areaName ?? "none"}</span>
      <span data-testid="enabled">{String(entry.enabled)}</span>
      <span data-testid="visible">{String(entry.visible)}</span>
      <span data-testid="labels">{entry.labels.join(",")}</span>
      <span data-testid="exposure">{JSON.stringify(entry.exposure)}</span>
      <span data-testid="in-registry">{String(entry.inRegistry)}</span>
    </div>
  )
}

describe("RegistryProvider", () => {
  it("transitions from loading to ready and exposes merged entry", async () => {
    render(
      <RegistryProvider>
        <StatusProbe />
        <EntryProbe id="light.lr_lamp" />
      </RegistryProvider>
    )

    expect(screen.getByTestId("status").textContent).toBe("loading")

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready")
    })

    expect(screen.getByTestId("area").textContent).toBe("Living Room")
    expect(screen.getByTestId("enabled").textContent).toBe("true")
    expect(screen.getByTestId("visible").textContent).toBe("true")
    expect(screen.getByTestId("labels").textContent).toBe("Climate")
    expect(screen.getByTestId("exposure").textContent).toBe('{"conversation":true}')
    expect(screen.getByTestId("in-registry").textContent).toBe("true")
  })

  it("reflects disabled_by as enabled=false", async () => {
    render(
      <RegistryProvider>
        <EntryProbe id="switch.mb_disabled" />
      </RegistryProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId("enabled").textContent).toBe("false")
    })
  })

  it("returns inRegistry=false for entities not in registry", async () => {
    render(
      <RegistryProvider>
        <StatusProbe />
        <EntryProbe id="sensor.unknown_template" />
      </RegistryProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready")
    })
    expect(screen.getByTestId("in-registry").textContent).toBe("false")
    expect(screen.getByTestId("area").textContent).toBe("none")
    expect(screen.getByTestId("exposure").textContent).toBe("{}")
  })

  it("transitions to error when a registry call rejects", async () => {
    sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
      if (msg.type === "config/area_registry/list") throw new Error("boom")
      if (msg.type === "config/entity_registry/list") return entityFixture
      if (msg.type === "config/label_registry/list") return labelFixture
      if (msg.type === "homeassistant/expose_entity/list") return exposureFixture
      throw new Error("unexpected: " + msg.type)
    })

    render(
      <RegistryProvider>
        <StatusProbe />
      </RegistryProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("error")
    })
  })

  it("tolerates exposure call failure and stays ready with empty exposure", async () => {
    sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
      if (msg.type === "homeassistant/expose_entity/list")
        throw new Error("unknown_command")
      if (msg.type === "config/entity_registry/list") return entityFixture
      if (msg.type === "config/area_registry/list") return areaFixture
      if (msg.type === "config/label_registry/list") return labelFixture
      throw new Error("unexpected: " + msg.type)
    })

    render(
      <RegistryProvider>
        <StatusProbe />
        <EntryProbe id="light.lr_lamp" />
      </RegistryProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready")
    })
    expect(screen.getByTestId("exposure").textContent).toBe("{}")
  })
})
```

- [ ] **Step 2: Run tests, confirm they fail**

Run from `main/terminus/`:

```bash
pnpm test:run src/lib/registry.test.tsx
```

Expected: FAIL — `Cannot find module './registry'` (file does not exist yet).

---

## Task 4: Implement registry provider

**Files:**
- Create: `main/terminus/src/lib/registry.tsx`

- [ ] **Step 1: Implement the provider**

Create `main/terminus/src/lib/registry.tsx`:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Connection } from "home-assistant-js-websocket"
import { connectHA } from "@/lib/ha"

type EntityRegistryEntry = {
  entity_id: string
  area_id: string | null
  device_id: string | null
  disabled_by: string | null
  hidden_by: string | null
  labels: string[]
  platform: string | null
  config_entry_id: string | null
}

type AreaEntry = { area_id: string; name: string }
type LabelEntry = { label_id: string; name: string }
type ExposureMap = Record<string, Record<string, boolean>>
type ExposureReply = { exposed_entities: ExposureMap }

export type RegistryStatus = "loading" | "ready" | "error"

export type RegistryEntry = {
  entityId: string
  areaName: string | null
  enabled: boolean
  visible: boolean
  labels: string[]
  exposure: Record<string, boolean>
  platform: string | null
  inRegistry: boolean
}

type RegistryState = {
  status: RegistryStatus
  error: string | null
  entities: Map<string, EntityRegistryEntry>
  areas: Map<string, AreaEntry>
  labels: Map<string, LabelEntry>
  exposure: ExposureMap
  refresh: () => void
}

const Ctx = createContext<RegistryState | null>(null)

async function fetchRegistries(conn: Connection) {
  const [entities, areas, labels] = await Promise.all([
    conn.sendMessagePromise<EntityRegistryEntry[]>({
      type: "config/entity_registry/list",
    }),
    conn.sendMessagePromise<AreaEntry[]>({ type: "config/area_registry/list" }),
    conn.sendMessagePromise<LabelEntry[]>({ type: "config/label_registry/list" }),
  ])

  let exposure: ExposureMap = {}
  try {
    const reply = await conn.sendMessagePromise<ExposureReply>({
      type: "homeassistant/expose_entity/list",
    })
    exposure = reply?.exposed_entities ?? {}
  } catch {
    // Older HA cores lack this WS command. Treat as no exposure info.
    exposure = {}
  }

  return { entities, areas, labels, exposure }
}

export function RegistryProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<RegistryStatus>("loading")
  const [error, setError] = useState<string | null>(null)
  const [entities, setEntities] = useState<Map<string, EntityRegistryEntry>>(new Map())
  const [areas, setAreas] = useState<Map<string, AreaEntry>>(new Map())
  const [labels, setLabels] = useState<Map<string, LabelEntry>>(new Map())
  const [exposure, setExposure] = useState<ExposureMap>({})
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus("loading")
    setError(null)

    connectHA()
      .then(async (conn) => {
        const data = await fetchRegistries(conn)
        if (cancelled) return
        setEntities(new Map(data.entities.map((e) => [e.entity_id, e])))
        setAreas(new Map(data.areas.map((a) => [a.area_id, a])))
        setLabels(new Map(data.labels.map((l) => [l.label_id, l])))
        setExposure(data.exposure)
        setStatus("ready")
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const value = useMemo<RegistryState>(
    () => ({ status, error, entities, areas, labels, exposure, refresh }),
    [status, error, entities, areas, labels, exposure, refresh]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function useRegistry(): RegistryState {
  const v = useContext(Ctx)
  if (!v) throw new Error("useRegistry must be used inside <RegistryProvider>")
  return v
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryStatus(): RegistryStatus {
  return useRegistry().status
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryError(): string | null {
  return useRegistry().error
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryRefresh(): () => void {
  return useRegistry().refresh
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryEntry(entityId: string | undefined): RegistryEntry | null {
  const { entities, areas, labels, exposure } = useRegistry()
  if (!entityId) return null
  const raw = entities.get(entityId)
  if (!raw) {
    return {
      entityId,
      areaName: null,
      enabled: true,
      visible: true,
      labels: [],
      exposure: exposure[entityId] ?? {},
      platform: null,
      inRegistry: false,
    }
  }
  const areaName = raw.area_id ? (areas.get(raw.area_id)?.name ?? null) : null
  const resolvedLabels = raw.labels
    .map((id) => labels.get(id)?.name)
    .filter((n): n is string => Boolean(n))
  return {
    entityId,
    areaName,
    enabled: raw.disabled_by === null,
    visible: raw.hidden_by === null,
    labels: resolvedLabels,
    exposure: exposure[entityId] ?? {},
    platform: raw.platform,
    inRegistry: true,
  }
}
```

- [ ] **Step 2: Run registry tests, confirm pass**

Run from `main/terminus/`:

```bash
pnpm test:run src/lib/registry.test.tsx
```

Expected: 5 tests PASS.

- [ ] **Step 3: Run full test suite to confirm no regressions**

Run from `main/terminus/`:

```bash
pnpm test:run
```

Expected: all existing tests still PASS.

- [ ] **Step 4: Typecheck**

Run from `main/terminus/`:

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd main
git add terminus/src/lib/registry.tsx terminus/src/lib/registry.test.tsx
git commit -m "feat(terminus): add HA registry context provider"
```

---

## Task 5: NodeDetailSheet — failing tests

**Files:**
- Create: `main/terminus/src/components/NodeDetailSheet.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `main/terminus/src/components/NodeDetailSheet.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { NodeDetailSheet } from "./NodeDetailSheet"
import { RegistryProvider } from "@/lib/registry"
import { LiveStateProvider } from "@/lib/liveState"
import type { GraphNode } from "@/types/manifest"
import entityFixture from "../../__fixtures__/registry/entity.json"
import areaFixture from "../../__fixtures__/registry/area.json"
import labelFixture from "../../__fixtures__/registry/label.json"
import exposureFixture from "../../__fixtures__/registry/exposure.json"

const sendMessagePromise = vi.fn()
const fakeConn = { sendMessagePromise, close: vi.fn() }

vi.mock("@/lib/ha", () => ({
  connectHA: () => Promise.resolve(fakeConn),
  watchEntities: () => () => {},
}))

beforeEach(() => {
  sendMessagePromise.mockReset()
  sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
    if (msg.type === "config/entity_registry/list") return entityFixture
    if (msg.type === "config/area_registry/list") return areaFixture
    if (msg.type === "config/label_registry/list") return labelFixture
    if (msg.type === "homeassistant/expose_entity/list") return exposureFixture
    if (msg.type === "subscribe_entities") return {}
    throw new Error("unexpected: " + msg.type)
  })
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { origin: "https://terminus.tanuki-mirzam.ts.net", hash: "" },
  })
})

function renderSheet(node: GraphNode) {
  return render(
    <LiveStateProvider>
      <RegistryProvider>
        <NodeDetailSheet open node={node} onOpenChange={() => {}} />
      </RegistryProvider>
    </LiveStateProvider>
  )
}

const entityNode: GraphNode = {
  id: "light.lr_lamp",
  kind: "entity",
  label: "light.lr_lamp",
  area: "lr",
  source: { file: "packages/living_room.yaml", line: 42 },
  position: { x: 0, y: 0 },
}

const sceneNode: GraphNode = {
  id: "scene.lr_dim",
  kind: "scene",
  label: "Living Dim",
  area: "lr",
  source: { file: "packages/living_room.yaml", line: 12 },
  position: { x: 0, y: 0 },
}

const scriptNode: GraphNode = {
  id: "script.lr_night",
  kind: "script",
  label: "LR Night",
  area: "lr",
  source: { file: "packages/living_room.yaml", line: 80 },
  position: { x: 0, y: 0 },
}

describe("NodeDetailSheet", () => {
  it("renders registry-derived sections for a known entity", async () => {
    renderSheet(entityNode)

    await waitFor(() => {
      expect(screen.getByText("Living Room")).toBeTruthy()
    })

    expect(screen.getByText("Climate")).toBeTruthy()
    expect(screen.getByText(/packages\/living_room\.yaml:42/)).toBeTruthy()

    const link = screen.getByRole("link", { name: /open in home assistant/i }) as HTMLAnchorElement
    expect(link.href).toBe(
      "https://terminus.tanuki-mirzam.ts.net/config/entities/entity/light.lr_lamp"
    )
    expect(link.target).toBe("_top")
  })

  it("builds scene edit link from object_id", async () => {
    renderSheet(sceneNode)
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /open in home assistant/i }) as HTMLAnchorElement
      expect(link.href).toBe(
        "https://terminus.tanuki-mirzam.ts.net/config/scene/edit/lr_dim"
      )
    })
  })

  it("builds script edit link from object_id", async () => {
    renderSheet(scriptNode)
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /open in home assistant/i }) as HTMLAnchorElement
      expect(link.href).toBe(
        "https://terminus.tanuki-mirzam.ts.net/config/script/edit/lr_night"
      )
    })
  })

  it("renders fallback dashes when entity not in registry", async () => {
    const orphan: GraphNode = {
      id: "sensor.template_only",
      kind: "template",
      label: "sensor.template_only",
      area: "common",
      source: { file: "packages/sample.yaml", line: 1 },
      position: { x: 0, y: 0 },
    }
    renderSheet(orphan)
    await waitFor(() => {
      expect(screen.getAllByText("—").length).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 2: Run tests, confirm failure**

Run from `main/terminus/`:

```bash
pnpm test:run src/components/NodeDetailSheet.test.tsx
```

Expected: FAIL — `Cannot find module './NodeDetailSheet'`.

---

## Task 6: Implement NodeDetailSheet

**Files:**
- Create: `main/terminus/src/components/NodeDetailSheet.tsx`

- [ ] **Step 1: Implement the component**

Create `main/terminus/src/components/NodeDetailSheet.tsx`:

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEntityState } from "@/lib/liveState"
import {
  useRegistryEntry,
  useRegistryStatus,
  useRegistryError,
  useRegistryRefresh,
} from "@/lib/registry"
import type { GraphNode } from "@/types/manifest"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: GraphNode | null
}

function configHref(node: GraphNode): string {
  const origin = window.location.origin
  const objectId = node.id.split(".")[1] ?? node.id
  switch (node.kind) {
    case "script":
      return `${origin}/config/script/edit/${objectId}`
    case "scene":
      return `${origin}/config/scene/edit/${objectId}`
    case "entity":
    case "template":
    default:
      return `${origin}/config/entities/entity/${node.id}`
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  )
}

export function NodeDetailSheet({ open, onOpenChange, node }: Props) {
  const status = useRegistryStatus()
  const error = useRegistryError()
  const refresh = useRegistryRefresh()
  const entry = useRegistryEntry(node?.kind === "entity" || node?.kind === "template" || node?.kind === "scene" || node?.kind === "script" ? node.id : undefined)
  const liveState = useEntityState(node?.id)

  if (!node) return null

  const labels = entry?.labels ?? []
  const exposure = entry?.exposure ?? {}
  const exposureKeys = Object.keys(exposure)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono text-sm">{node.id}</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <Badge variant="outline">{node.kind}</Badge>
            {liveState && (
              <Badge variant="secondary" className="font-mono text-[10px]">
                {liveState}
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        {status === "error" && (
          <div className="my-3 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs">
            <div>Registry unavailable.</div>
            {error && <div className="font-mono opacity-70">{error}</div>}
            <Button size="sm" variant="outline" className="mt-1" onClick={refresh}>
              Retry
            </Button>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <Section title="Area">{entry?.areaName ?? "—"}</Section>

          <Section title="Status">
            <div className="flex flex-wrap gap-2">
              <Badge variant={entry?.enabled ? "default" : "destructive"}>
                {entry?.enabled ? "Enabled" : "Disabled"}
              </Badge>
              <Badge variant={entry?.visible ? "default" : "secondary"}>
                {entry?.visible ? "Visible" : "Hidden"}
              </Badge>
            </div>
          </Section>

          <Section title="Labels">
            {labels.length === 0 ? (
              "—"
            ) : (
              <div className="flex flex-wrap gap-1">
                {labels.map((l) => (
                  <Badge key={l} variant="outline">
                    {l}
                  </Badge>
                ))}
              </div>
            )}
          </Section>

          <Section title="Voice exposure">
            {exposureKeys.length === 0 ? (
              "No voice assistant exposure."
            ) : (
              <ul className="space-y-0.5">
                {exposureKeys.map((k) => (
                  <li key={k} className="flex justify-between font-mono text-xs">
                    <span>{k}</span>
                    <span>{exposure[k] ? "exposed" : "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Source">
            <span className="font-mono text-xs">
              {node.source.file}:{node.source.line}
            </span>
          </Section>

          <a
            href={configHref(node)}
            target="_top"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open in Home Assistant
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 2: Run sheet tests, confirm pass**

Run from `main/terminus/`:

```bash
pnpm test:run src/components/NodeDetailSheet.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 3: Typecheck**

Run from `main/terminus/`:

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd main
git add terminus/src/components/NodeDetailSheet.tsx terminus/src/components/NodeDetailSheet.test.tsx
git commit -m "feat(terminus): add NodeDetailSheet for non-automation nodes"
```

---

## Task 7: SystemMap onNodeClick — failing test

**Files:**
- Modify: `main/terminus/src/routes/SystemMap.test.tsx`

Extend existing test file with click-dispatch coverage. The current test only verifies a label renders.

- [ ] **Step 1: Replace test file**

Overwrite `main/terminus/src/routes/SystemMap.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { SystemMap } from "./SystemMap"
import type { Manifest } from "@/types/manifest"
import { LiveStateProvider } from "@/lib/liveState"

vi.mock("@/lib/ha", () => ({
  connectHA: () => new Promise(() => {}),
  watchEntities: () => () => {},
}))

const manifest: Manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  nodes: [
    {
      id: "auto:mb_lamp_on_dark",
      kind: "automation",
      label: "MB: Lamp on when dark",
      area: "mb",
      source: { file: "packages/sample.yaml", line: 2 },
      position: { x: 0, y: 0 },
    },
    {
      id: "light.lr_lamp",
      kind: "entity",
      label: "light.lr_lamp",
      area: "lr",
      source: { file: "packages/sample.yaml", line: 10 },
      position: { x: 200, y: 0 },
    },
  ],
  edges: [],
  automations: {
    mb_lamp_on_dark: {
      id: "mb_lamp_on_dark",
      alias: "MB: Lamp on when dark",
      mode: "single",
      triggers: [],
      conditions: [],
      actions: [],
      flowNodes: [],
      flowEdges: [],
    },
  },
}

describe("SystemMap", () => {
  it("renders automation node label from manifest", async () => {
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} onSelect={() => {}} />
      </LiveStateProvider>
    )
    expect(await screen.findByText("MB: Lamp on when dark")).toBeTruthy()
  })

  it("calls onSelect for non-automation node clicks", async () => {
    const onSelect = vi.fn()
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} onSelect={onSelect} />
      </LiveStateProvider>
    )
    const entityLabel = await screen.findByText("light.lr_lamp")
    fireEvent.click(entityLabel)
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0].id).toBe("light.lr_lamp")
  })

  it("does NOT call onSelect for automation node clicks (handled by drill-in)", async () => {
    const onSelect = vi.fn()
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} onSelect={onSelect} />
      </LiveStateProvider>
    )
    const autoLabel = await screen.findByText("MB: Lamp on when dark")
    fireEvent.click(autoLabel)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests, confirm failure**

Run from `main/terminus/`:

```bash
pnpm test:run src/routes/SystemMap.test.tsx
```

Expected: type errors — `SystemMap` does not accept `onSelect` prop yet — plus the two new click tests failing.

---

## Task 8: Implement SystemMap onNodeClick

**Files:**
- Modify: `main/terminus/src/routes/SystemMap.tsx`

- [ ] **Step 1: Add onSelect prop and handler**

Edit `main/terminus/src/routes/SystemMap.tsx`. Replace the file with:

```tsx
import { useCallback, useMemo } from "react"
import { ReactFlow, Background, Controls, type Edge, type Node } from "@xyflow/react"
import type { GraphNode, Manifest } from "@/types/manifest"
import { nodeTypes } from "@/components/nodes"

const EDGE_STYLE: Record<string, { stroke: string; strokeDasharray?: string }> = {
  trigger: { stroke: "var(--color-emerald-500)" },
  condition: { stroke: "var(--color-amber-500)", strokeDasharray: "4 4" },
  action: { stroke: "var(--color-sky-500)" },
  script_call: { stroke: "var(--color-fuchsia-500)" },
  scene_call: { stroke: "var(--color-pink-500)" },
  template: { stroke: "var(--color-zinc-500)", strokeDasharray: "2 2" },
}

type Props = {
  manifest: Manifest
  onSelect: (node: GraphNode) => void
}

export function SystemMap({ manifest, onSelect }: Props) {
  const nodes: Node[] = useMemo(
    () =>
      manifest.nodes.map((n) => {
        const data =
          n.kind === "automation"
            ? {
                autoId: n.id.replace(/^auto:/, ""),
                label: n.label,
                area: n.area,
                mode: manifest.automations[n.id.replace(/^auto:/, "")]?.mode ?? "single",
              }
            : n.kind === "entity" || n.kind === "template"
              ? { entityId: n.id, label: n.label, area: n.area }
              : { label: n.label, area: n.area }
        return {
          id: n.id,
          type: n.kind,
          position: n.position,
          data,
        }
      }),
    [manifest]
  )

  const edges: Edge[] = useMemo(
    () =>
      manifest.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        style: EDGE_STYLE[e.kind],
        animated: false,
      })),
    [manifest]
  )

  const byId = useMemo(() => {
    const m = new Map<string, GraphNode>()
    for (const n of manifest.nodes) m.set(n.id, n)
    return m
  }, [manifest])

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, n: Node) => {
      const graphNode = byId.get(n.id)
      if (!graphNode) return
      if (graphNode.kind === "automation") return // drill-in handled by AutomationNode itself
      onSelect(graphNode)
    },
    [byId, onSelect]
  )

  return (
    <div className="h-[calc(100svh-4rem)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
```

- [ ] **Step 2: Run SystemMap tests, confirm pass**

Run from `main/terminus/`:

```bash
pnpm test:run src/routes/SystemMap.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 3: Typecheck and full test run**

Run from `main/terminus/`:

```bash
pnpm typecheck && pnpm test:run
```

Expected: clean typecheck; all tests pass (including pre-existing ones).

- [ ] **Step 4: Commit**

```bash
cd main
git add terminus/src/routes/SystemMap.tsx terminus/src/routes/SystemMap.test.tsx
git commit -m "feat(terminus): SystemMap dispatches onSelect for non-automation clicks"
```

---

## Task 9: Wire RegistryProvider + sheet into App

**Files:**
- Modify: `main/terminus/src/App.tsx`

- [ ] **Step 1: Replace App.tsx**

Overwrite `main/terminus/src/App.tsx`:

```tsx
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { LiveStateProvider, useLiveState } from "@/lib/liveState"
import { RegistryProvider } from "@/lib/registry"
import { loadManifest } from "@/lib/graph"
import { useRoute } from "@/lib/router"
import { SystemMap } from "@/routes/SystemMap"
import { AutomationView } from "@/routes/AutomationView"
import { EmptyState } from "@/components/EmptyState"
import { NodeDetailSheet } from "@/components/NodeDetailSheet"
import type { GraphNode, Manifest } from "@/types/manifest"

const STALE_DAYS = 7
const NOW_MS = Date.now()

function StatusBadge() {
  const { status } = useLiveState()
  const label =
    status === "connecting" ? "Connecting…" : status === "connected" ? "Connected" : "Error"
  const variant =
    status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"
  return <Badge variant={variant}>{label}</Badge>
}

function StalenessBanner({ generatedAt }: { generatedAt: string }) {
  const days = Math.floor((NOW_MS - Date.parse(generatedAt)) / (1000 * 60 * 60 * 24))
  if (days < STALE_DAYS) return null
  return (
    <div className="border-b bg-amber-100 px-4 py-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      Manifest is {days} days old — run <code>bin/deploy-ssh.sh</code> to refresh.
    </div>
  )
}

function Shell() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const route = useRoute()

  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  if (error) {
    return (
      <EmptyState
        title="Graph manifest missing"
        body="Run `pnpm build` in terminus/ to generate `www/terminus/graph.json`."
      />
    )
  }
  if (!manifest) return null

  return (
    <div className="flex h-svh flex-col">
      <StalenessBanner generatedAt={manifest.generatedAt} />
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-base font-semibold">Terminus</h1>
        <StatusBadge />
      </header>
      <main className="flex-1">
        {route.name === "map" ? (
          <SystemMap
            manifest={manifest}
            onSelect={(node) => {
              setSelected(node)
              setSheetOpen(true)
            }}
          />
        ) : (
          <AutomationView manifest={manifest} autoId={route.id} />
        )}
      </main>
      <NodeDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} node={selected} />
    </div>
  )
}

export function App() {
  return (
    <LiveStateProvider>
      <RegistryProvider>
        <Shell />
      </RegistryProvider>
    </LiveStateProvider>
  )
}

export default App
```

- [ ] **Step 2: Typecheck and run full test suite**

Run from `main/terminus/`:

```bash
pnpm typecheck && pnpm test:run
```

Expected: no errors; all tests pass.

- [ ] **Step 3: Lint**

Run from `main/terminus/`:

```bash
pnpm lint
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
cd main
git add terminus/src/App.tsx
git commit -m "feat(terminus): mount RegistryProvider and NodeDetailSheet in App shell"
```

---

## Task 10: Build, smoke-test in dev, prepare for deploy

**Files:**
- Modify: `main/www/terminus/index.js` (build output)
- Modify: `main/www/terminus/style.css` (build output)
- Modify: `main/www/terminus/graph.json` (build output)

- [ ] **Step 1: Build production bundle**

Run from `main/terminus/`:

```bash
pnpm build
```

Expected: `../www/terminus/{index.js,style.css,graph.json}` updated. No build errors.

- [ ] **Step 2: Quick dev sanity check (optional, manual)**

Run from `main/terminus/`:

```bash
pnpm dev
```

Open the printed URL. The panel won't have HA chrome, but verify:
- Page renders without runtime errors in the console.
- Clicking an entity/scene/script node opens the sheet on the right.
- Clicking an automation node does NOT open the sheet.
- Action link `href` matches expected `/config/...` path.

Stop dev server when done (Ctrl+C).

- [ ] **Step 3: Commit built artifacts**

```bash
cd main
git add www/terminus/index.js www/terminus/style.css www/terminus/graph.json
git commit -m "chore(terminus): rebuild bundle with node detail popup"
```

- [ ] **Step 4: Inform user, request deploy approval**

Stop here. Tell the user:

> "Implementation complete. Bundle built and committed. Ready to push and deploy — `git push` then `bin/deploy-ssh.sh`. Approve?"

Do not push or deploy without explicit approval (per memory: `feedback_always_commit.md` covers commits, not push/deploy).

---

## Self-Review Summary

**Spec coverage checked:**
- §1 Architecture (RegistryProvider, 4 WS calls, context) → Tasks 3–4
- §2 Components (registry.tsx, NodeDetailSheet.tsx, sheet.tsx, SystemMap mod, App mod) → Tasks 1, 4, 6, 8, 9
- §3 Data flow (onNodeClick gating, link construction, `window.location.origin`, `target="_top"`) → Tasks 6, 8
- §4 Error handling (status states, missing entity, exposure failure, retry button) → Tasks 3, 4, 6
- §5 Testing (registry tests, sheet tests, SystemMap test extension, manual verification) → Tasks 3, 5, 7, 10

**Type consistency:**
- `RegistryEntry` defined in Task 4, used in Task 4 hook and Task 6 sheet — fields match.
- `SystemMap` `onSelect: (node: GraphNode) => void` signature consistent in Tasks 7, 8, 9.
- `NodeDetailSheet` props `{ open, onOpenChange, node }` consistent in Tasks 5, 6, 9.

**Placeholder scan:** none.
