import path from "node:path"
import { describe, expect, it } from "vitest"
import { buildManifest } from "./vite-plugin-graph"

const FIXTURE_ROOT = path.resolve(__dirname, "__fixtures__")

describe("buildManifest", () => {
  it("parses automation, script, scene from fixtures", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)

    const autoIds = manifest.nodes
      .filter((n) => n.kind === "automation")
      .map((n) => n.id)
      .sort()
    expect(autoIds).toEqual([
      "auto:lr_dynamic_target",
      "auto:mb_lamp_on_dark",
      "auto:ui_kitchen_off",
    ])

    const scriptIds = manifest.nodes
      .filter((n) => n.kind === "script")
      .map((n) => n.id)
      .sort()
    expect(scriptIds).toEqual(["script:lr_evening", "script:ui_only_script"])

    const sceneIds = manifest.nodes.filter((n) => n.kind === "scene").map((n) => n.id)
    expect(sceneIds).toContain("scene:scene.mb_bluish")
  })

  it("captures source file + line for each automation", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const mbLamp = manifest.nodes.find((n) => n.id === "auto:mb_lamp_on_dark")
    expect(mbLamp).toBeDefined()
    expect(mbLamp!.source.file).toContain("packages/sample.yaml")
    expect(mbLamp!.source.line).toBeGreaterThan(0)
  })
})

describe("buildManifest edges", () => {
  it("emits trigger/condition/action edges in data-flow direction", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const auto = "auto:mb_lamp_on_dark"

    const triggers = manifest.edges.filter((e) => e.kind === "trigger" && e.target === auto)
    expect(triggers.map((e) => e.source)).toEqual(["binary_sensor.is_dark"])

    const conditions = manifest.edges.filter(
      (e) => e.kind === "condition" && e.target === auto
    )
    expect(conditions.map((e) => e.source)).toEqual(["person.norman"])

    const actions = manifest.edges.filter((e) => e.kind === "action" && e.source === auto)
    expect(actions.map((e) => e.target).sort()).toEqual(["light.mb_led_one"])
  })

  it("emits script_call + scene_call edges", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const auto = "auto:mb_lamp_on_dark"
    expect(
      manifest.edges.some(
        (e) => e.kind === "script_call" && e.source === auto && e.target === "script:lr_evening"
      )
    ).toBe(true)
    expect(
      manifest.edges.some(
        (e) =>
          e.kind === "scene_call" && e.source === auto && e.target === "scene:scene.mb_bluish"
      )
    ).toBe(true)
  })

  it("emits template edges for jinja-templated targets", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const tmpls = manifest.edges.filter(
      (e) => e.kind === "template" && e.source === "auto:lr_dynamic_target"
    )
    expect(tmpls).toHaveLength(1)
    expect(tmpls[0].target).toMatch(/^template:/)
    expect(manifest.nodes.some((n) => n.id === tmpls[0].target && n.kind === "template")).toBe(true)
  })

  it("only emits entity nodes that are referenced", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const referenced = new Set<string>()
    manifest.edges.forEach((e) => {
      referenced.add(e.source)
      referenced.add(e.target)
    })
    const entityNodes = manifest.nodes.filter((n) => n.kind === "entity")
    for (const en of entityNodes) {
      expect(referenced.has(en.id)).toBe(true)
    }
  })
})

describe("buildManifest layout + detail", () => {
  it("assigns finite positions to every node", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    for (const n of manifest.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true)
      expect(Number.isFinite(n.position.y)).toBe(true)
    }
  })

  it("emits per-automation flowNodes + flowEdges", async () => {
    const manifest = await buildManifest(FIXTURE_ROOT)
    const detail = manifest.automations["mb_lamp_on_dark"]
    expect(detail).toBeDefined()
    // Expect at least: 1 automation root + 1 trigger entity + 1 condition entity + 1 action entity
    expect(detail.flowNodes.length).toBeGreaterThanOrEqual(4)
    expect(detail.flowEdges.length).toBeGreaterThan(0)
    for (const n of detail.flowNodes) {
      expect(Number.isFinite(n.position.x)).toBe(true)
    }
  })
})
