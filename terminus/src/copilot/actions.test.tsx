import { describe, expect, it } from "vitest"
import { runGetEntityStateHandler } from "./actions"
import { createProposeAutomationController } from "./actions"
import type { AutomationProposal } from "@/lib/automationWriter"

const proposal: AutomationProposal = {
  alias: "x",
  mode: "single",
  triggers: [],
  conditions: [],
  actions: [],
}

describe("get_entity_state handler", () => {
  const liveStates = new Map([
    ["switch.lr_lamp", { state: "off", attributes: { friendly_name: "LR Lamp" } }],
  ])

  it("returns state + attributes when entity exists", () => {
    const res = runGetEntityStateHandler(
      { entity_id: "switch.lr_lamp" },
      { liveStates }
    )
    expect(res).toEqual({
      state: "off",
      attributes: { friendly_name: "LR Lamp" },
    })
  })

  it("returns error shape when entity missing", () => {
    const res = runGetEntityStateHandler(
      { entity_id: "switch.nope" },
      { liveStates }
    )
    expect(res).toEqual({ error: "not_found" })
  })
})

describe("propose_automation controller", () => {
  it("resolves with approved:true when approve() is called", async () => {
    const ctl = createProposeAutomationController()
    const pending = ctl.handler(proposal)
    ctl.approve()
    await expect(pending).resolves.toEqual({ approved: true })
  })

  it("resolves with approved:false + feedback when reject() is called", async () => {
    const ctl = createProposeAutomationController()
    const pending = ctl.handler(proposal)
    ctl.reject("too aggressive")
    await expect(pending).resolves.toEqual({
      approved: false,
      feedback: "too aggressive",
    })
  })

  it("exposes the current pending proposal for the render layer", () => {
    const ctl = createProposeAutomationController()
    expect(ctl.pending).toBeNull()
    void ctl.handler(proposal)
    expect(ctl.pending).toEqual(proposal)
  })
})
