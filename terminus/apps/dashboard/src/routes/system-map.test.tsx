import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "@/router"
import type { Manifest } from "@/types/manifest"
import { LiveStateProvider } from "@/lib/live-state"
import { RegistryProvider } from "@/lib/registry"

vi.mock("@/lib/ha", () => ({
  connectHA: () => new Promise(() => {}),
  watchEntities: () => () => {},
}))

// Avoid pulling in NodeDetailSheet's registry/live-state deps in this unit test
vi.mock("@/components/node-detail-sheet", () => ({
  NodeDetailSheet: ({ open }: { open: boolean }) =>
    open ? <div data-testid="node-sheet" /> : null,
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

function makeRouter(initialPath = "/") {
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { manifest },
  })
}

function renderMap(testRouter = makeRouter()) {
  return render(
    <LiveStateProvider>
      <RegistryProvider>
        <RouterProvider router={testRouter} />
      </RegistryProvider>
    </LiveStateProvider>
  )
}

describe("SystemMap", () => {
  afterEach(() => cleanup())

  it("renders automation node label from manifest", async () => {
    renderMap()
    expect(await screen.findByText("MB: Lamp on when dark")).toBeTruthy()
  })

  it("opens detail sheet when a non-automation node is clicked", async () => {
    renderMap()
    const entityLabel = await screen.findByText("light.lr_lamp")
    fireEvent.click(entityLabel)
    expect(screen.getByTestId("node-sheet")).toBeTruthy()
  })

  it("does not open sheet when automation node is clicked (drill-in handled by AutomationNode)", async () => {
    const testRouter = makeRouter()
    renderMap(testRouter)
    const autoLabel = await screen.findByText("MB: Lamp on when dark")
    fireEvent.click(autoLabel)
    expect(screen.queryByTestId("node-sheet")).toBeNull()
  })
})
