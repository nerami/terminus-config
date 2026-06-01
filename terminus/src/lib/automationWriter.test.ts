import { describe, expect, it } from "vitest"
import { generateAutomationId } from "./automationWriter"

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
