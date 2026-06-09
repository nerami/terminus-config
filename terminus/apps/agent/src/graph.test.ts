import { describe, it, expect } from "vitest"
import { createGraph } from "./graph.js"
import { haConfigTools } from "./tools/ha-config-api.js"
import { haManifestTools } from "./tools/ha-manifest.js"

describe("createGraph", () => {
  it("returns an agent exposing streamEvents (LangGraph-compiled)", () => {
    const agent = createGraph("test-api-key")
    expect(typeof agent.streamEvents).toBe("function")
    expect(typeof agent.invoke).toBe("function")
  })
})

describe("createGraph tool wiring", () => {
  it("binds the manifest + config tools", () => {
    // createAgent does not expose tools directly; assert the source arrays are non-empty
    // and named as expected so a regression in imports is caught.
    const names = [...haManifestTools, ...haConfigTools].map((t) => t.name)
    expect(names).toEqual(
      expect.arrayContaining([
        "ha_read_manifest",
        "ha_config_list",
        "ha_config_get",
        "ha_config_upsert",
        "ha_config_delete",
        "ha_automation_set_enabled",
      ]),
    )
    expect(names).toHaveLength(6)
  })
})
