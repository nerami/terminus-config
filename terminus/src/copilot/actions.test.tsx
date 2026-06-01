import { describe, expect, it } from "vitest"
import { runGetEntityStateHandler } from "./actions"

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
