import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import { NodeDetailSheet } from "./node-detail-sheet"
import { RegistryProvider } from "@/lib/registry"
import { LiveStateProvider } from "@/lib/live-state"
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

afterEach(() => cleanup())

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
