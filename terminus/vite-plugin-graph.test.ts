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
