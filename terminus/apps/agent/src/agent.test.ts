import { describe, it, expect } from "vitest"
import { HumanMessage, AIMessage, ToolMessage, SystemMessage } from "@langchain/core/messages"
import { aguiToLangchain } from "./agent.js"

describe("aguiToLangchain", () => {
  it("maps a user message to HumanMessage", () => {
    const out = aguiToLangchain([{ role: "user", content: "hi" }])
    expect(out).toHaveLength(1)
    expect(out[0]).toBeInstanceOf(HumanMessage)
    expect(out[0].content).toBe("hi")
  })

  it("maps an assistant tool call to AIMessage with tool_calls", () => {
    const out = aguiToLangchain([
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "tc1", function: { name: "ha_read_manifest", arguments: "{}" } }],
      },
    ])
    expect(out[0]).toBeInstanceOf(AIMessage)
    expect((out[0] as AIMessage).tool_calls).toEqual([
      { id: "tc1", name: "ha_read_manifest", args: {}, type: "tool_call" },
    ])
  })

  it("maps a tool result to ToolMessage", () => {
    const out = aguiToLangchain([{ role: "tool", content: "result", toolCallId: "tc1", name: "ha_read_manifest" }])
    expect(out[0]).toBeInstanceOf(ToolMessage)
    expect((out[0] as ToolMessage).tool_call_id).toBe("tc1")
  })

  it("maps system and developer roles to SystemMessage", () => {
    const out = aguiToLangchain([
      { role: "system", content: "sys" },
      { role: "developer", content: "dev" },
    ])
    expect(out[0]).toBeInstanceOf(SystemMessage)
    expect(out[1]).toBeInstanceOf(SystemMessage)
  })
})
