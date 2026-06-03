import { describe, expect, it } from "vitest"
import { generateAutomationId } from "./automation-writer"
import { validateAutomation, type AutomationProposal } from "./automation-writer"
import { commitAutomation, serializeYamlPreview } from "./automation-writer"

describe("generateAutomationId", () => {
  it("slugifies the alias and appends a stable 6-char hash", () => {
    const id = generateAutomationId("LR lamp off at 22:00")
    expect(id).toMatch(/^lr_lamp_off_at_22_00_[a-z0-9]{6}$/)
  })

  it("is deterministic for the same alias", () => {
    expect(generateAutomationId("foo bar")).toBe(generateAutomationId("foo bar"))
  })

  it("differs for different aliases", () => {
    expect(generateAutomationId("foo bar")).not.toBe(generateAutomationId("baz qux"))
  })

  it("collapses repeated separators and trims edges", () => {
    expect(generateAutomationId("  Multi   space___test  ")).toMatch(
      /^multi_space_test_[a-z0-9]{6}$/
    )
  })
})

const sampleProposal: AutomationProposal = {
  alias: "LR lamp off at 22:00",
  description: "Turn off LR lamp every night",
  mode: "single",
  triggers: [{ platform: "time", at: "22:00:00" }],
  conditions: [],
  actions: [{ service: "switch.turn_off", target: { entity_id: "switch.lr_lamp" } }],
}

describe("validateAutomation", () => {
  it("returns ok when all referenced entities exist", () => {
    const known = new Set(["switch.lr_lamp"])
    expect(validateAutomation(sampleProposal, known)).toEqual({ ok: true })
  })

  it("rejects unknown entity_id with kind unknown_entity", () => {
    const known = new Set<string>()
    const res = validateAutomation(sampleProposal, known)
    expect(res).toEqual({
      ok: false,
      error: { kind: "unknown_entity", detail: "switch.lr_lamp" },
    })
  })

  it("rejects missing alias with kind missing_field", () => {
    const bad = { ...sampleProposal, alias: "" }
    const res = validateAutomation(bad, new Set())
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.kind).toBe("missing_field")
  })

  it("walks plural triggers/conditions/actions keys", () => {
    const plural: AutomationProposal = {
      alias: "x",
      mode: "single",
      triggers: [],
      conditions: [],
      actions: [
        {
          choose: [
            {
              conditions: [{ condition: "state", entity_id: "binary_sensor.unknown" }],
              sequence: [],
            },
          ],
        },
      ],
    }
    const res = validateAutomation(plural, new Set())
    expect(res).toEqual({
      ok: false,
      error: { kind: "unknown_entity", detail: "binary_sensor.unknown" },
    })
  })
})

type Call = { url: string; init?: RequestInit }

function mockFetch(
  handlers: { method: "GET" | "POST"; pattern: string; res: () => Response }[]
): { fetch: typeof fetch; calls: Call[] } {
  const calls: Call[] = []
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.toString()
    const method = (init?.method ?? "GET").toUpperCase()
    calls.push({ url, init })
    for (const h of handlers) {
      if (method === h.method && url.includes(h.pattern)) return h.res()
    }
    return new Response("not mocked", { status: 500 })
  }
  return { fetch: fetchImpl, calls }
}

describe("commitAutomation", () => {
  const known = new Set(["switch.lr_lamp"])

  it("rejects with id_conflict when GET returns 200", async () => {
    const { fetch } = mockFetch([
      { method: "GET", pattern: "/automation/config/", res: () => new Response("{}", { status: 200 }) },
    ])
    const res = await commitAutomation(sampleProposal, known, { fetch, token: "t" })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.kind).toBe("id_conflict")
  })

  it("writes and reloads when GET returns 404", async () => {
    const { fetch, calls } = mockFetch([
      { method: "GET", pattern: "/automation/config/", res: () => new Response("not found", { status: 404 }) },
      { method: "POST", pattern: "/automation/config/", res: () => new Response("{}", { status: 200 }) },
      { method: "POST", pattern: "/services/automation/reload", res: () => new Response("[]", { status: 200 }) },
    ])
    const res = await commitAutomation(sampleProposal, known, { fetch, token: "t" })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.id).toMatch(/^lr_lamp_off_at_22_00_/)

    const methods = calls.map((c) => `${(c.init?.method ?? "GET").toUpperCase()} ${c.url}`)
    expect(methods.some((m) => m.startsWith("GET ") && m.includes("/automation/config/"))).toBe(true)
    expect(methods.some((m) => m.startsWith("POST ") && m.includes("/automation/config/"))).toBe(true)
    expect(methods.some((m) => m.includes("/services/automation/reload"))).toBe(true)
  })

  it("rejects with unknown_entity before any fetch when validation fails", async () => {
    const { fetch, calls } = mockFetch([])
    const res = await commitAutomation(sampleProposal, new Set(), { fetch, token: "t" })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.kind).toBe("unknown_entity")
    expect(calls).toEqual([])
  })

  it("surfaces ha_rest error on POST failure", async () => {
    const { fetch } = mockFetch([
      { method: "GET", pattern: "/automation/config/", res: () => new Response("not found", { status: 404 }) },
      { method: "POST", pattern: "/automation/config/", res: () => new Response("boom", { status: 500 }) },
    ])
    const res = await commitAutomation(sampleProposal, known, { fetch, token: "t" })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error.kind).toBe("ha_rest")
      expect(res.error.detail).toContain("500")
    }
  })
})

describe("serializeYamlPreview", () => {
  it("dumps a valid YAML string with the generated id", () => {
    const yaml = serializeYamlPreview(sampleProposal)
    expect(yaml).toContain("alias: LR lamp off at 22:00")
    expect(yaml).toMatch(/^id: lr_lamp_off_at_22_00_/m)
    expect(yaml).toContain("entity_id: switch.lr_lamp")
  })
})
