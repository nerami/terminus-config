import { describe, expect, it } from "vitest"
import { buildCatalog } from "./readable"
import type { Manifest, GraphNode } from "@/types/manifest"

function entity(id: string, kind: GraphNode["kind"], area: GraphNode["area"]): GraphNode {
  return {
    id,
    kind,
    label: id,
    area,
    source: { file: "x.yaml", line: 1 },
    position: { x: 0, y: 0 },
  }
}

const fixtureManifest: Manifest = {
  version: 1,
  generatedAt: "2026-06-01T00:00:00Z",
  nodes: [
    entity("switch.lr_lamp", "entity", "lr"),
    entity("scene.lr_dim", "scene", "lr"),
    entity("script.bedtime", "script", "common"),
    entity("automation.foo", "automation", "lr"),
  ],
  edges: [],
  automations: {},
}

describe("buildCatalog", () => {
  it("includes entities, scenes, scripts, areas, and time", () => {
    const cat = buildCatalog({
      manifest: fixtureManifest,
      now: new Date("2026-06-01T15:30:00-06:00"),
    })
    expect(cat.entities).toContain("switch.lr_lamp")
    expect(cat.entities).not.toContain("automation.foo")
    expect(cat.entities).not.toContain("scene.lr_dim")
    expect(cat.scenes).toContain("scene.lr_dim")
    expect(cat.scripts).toContain("script.bedtime")
    expect(cat.areas).toEqual({
      mb: "Master Bedroom",
      lr: "Living Room",
      abi: "Abi's room",
    })
    expect(cat.user_location).toContain("Costa Rica")
    expect(cat.current_time).toMatch(/^2026-06-01T\d{2}:\d{2}:\d{2}/)
  })
})
