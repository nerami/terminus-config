import { describe, expect, it } from "vitest"
import { generateAutomationId } from "./automationWriter"
import { validateAutomation, type AutomationProposal } from "./automationWriter"

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
