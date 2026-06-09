import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("@terminus/manifest", () => ({
  buildManifest: async () => ({
    automations: { "111": { id: "111" } },
    nodes: [],
  }),
}))

import { haConfigTools } from "./ha-config-api.js"

const byName = (n: string) => haConfigTools.find((t) => t.name === n)!
const ORIG = { ...process.env }

beforeEach(() => {
  process.env.HASS_SERVER = "https://ha.test"
  process.env.HASS_TOKEN = "tok"
  process.env.REPO_ROOT = "/tmp/repo"
})
afterEach(() => {
  vi.unstubAllGlobals()
  process.env = { ...ORIG }
})

describe("ha_config_list", () => {
  it("filters by domain and flags packages-managed automations", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            { entity_id: "automation.yard", state: "on", attributes: { id: "111", friendly_name: "Yard" } },
            { entity_id: "automation.dim", state: "on", attributes: { id: "222", friendly_name: "Dim" } },
            { entity_id: "light.lr_lamp", state: "off", attributes: {} },
          ]),
          { status: 200 },
        ),
      ),
    )

    const out = JSON.parse(await byName("ha_config_list").invoke({ domain: "automation" }))
    expect(out).toHaveLength(2)
    expect(out.find((r: any) => r.id === "111").packages_managed).toBe(true)
    expect(out.find((r: any) => r.id === "222").packages_managed).toBe(false)
  })

  it("uses object_id as id for scripts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            { entity_id: "script.good_morning", state: "off", attributes: { friendly_name: "Good Morning" } },
          ]),
          { status: 200 },
        ),
      ),
    )
    const out = JSON.parse(await byName("ha_config_list").invoke({ domain: "script" }))
    expect(out[0].id).toBe("good_morning")
  })
})
