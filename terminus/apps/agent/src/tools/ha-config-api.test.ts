import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("@terminus/manifest", () => ({
  buildManifest: async () => ({
    automations: { "111": { id: "111" } },
    nodes: [],
  }),
}))

import { haConfigTools } from "./ha-config-api.js"

// tools have heterogeneous zod schemas; the union's generic .invoke signatures
// are not mutually assignable, so expose a loosely-typed handle for tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const byName = (n: string): any => haConfigTools.find((t) => t.name === n)
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

describe("ha_config_get", () => {
  it("returns the config JSON on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ alias: "Yard", trigger: [] }), { status: 200 })),
    )
    const out = JSON.parse(await byName("ha_config_get").invoke({ domain: "automation", id: "222" }))
    expect(out.alias).toBe("Yard")
  })

  it("maps 404 to a not-editable message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Not found", { status: 404 })))
    const out = JSON.parse(await byName("ha_config_get").invoke({ domain: "automation", id: "999" }))
    expect(out.status).toBe(404)
    expect(out.error).toContain("not editable")
  })
})

describe("ha_config_upsert", () => {
  it("POSTs to the supplied id and reports ok", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: "ok" }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    const out = JSON.parse(
      await byName("ha_config_upsert").invoke({
        domain: "automation",
        id: "222",
        config: { alias: "Yard", trigger: [], action: [] },
      }),
    )
    expect(out.result).toBe("ok")
    expect(out.id).toBe("222")
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe("https://ha.test/api/config/automation/config/222")
    expect(init.method).toBe("POST")
    expect(JSON.parse(init.body as string)).toEqual({ alias: "Yard", trigger: [], action: [] })
  })

  it("generates an id when none is supplied and returns it", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: "ok" }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const out = JSON.parse(
      await byName("ha_config_upsert").invoke({ domain: "automation", config: { alias: "New" } }),
    )
    expect(out.id).toMatch(/^\d+$/)
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[0]).toContain(`/config/${out.id}`)
  })

  it("surfaces a 400 validation body for the model to fix", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("invalid trigger platform", { status: 400 })))
    const out = JSON.parse(
      await byName("ha_config_upsert").invoke({ domain: "automation", id: "1", config: {} }),
    )
    expect(out.status).toBe(400)
    expect(out.error).toContain("invalid trigger")
  })
})

describe("ha_config_delete", () => {
  it("DELETEs the id and reports ok", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: "ok" }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const out = JSON.parse(await byName("ha_config_delete").invoke({ domain: "automation", id: "222" }))
    expect(out.result).toBe("ok")
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].method).toBe("DELETE")
  })

  it("maps 404 to a not-editable message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Not found", { status: 404 })))
    const out = JSON.parse(await byName("ha_config_delete").invoke({ domain: "automation", id: "999" }))
    expect(out.status).toBe(404)
    expect(out.error).toContain("not editable")
  })
})
