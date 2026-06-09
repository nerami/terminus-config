import { describe, it, expect } from "vitest"
import { createGraph } from "./graph.js"

describe("createGraph", () => {
  it("returns an agent exposing streamEvents (LangGraph-compiled)", () => {
    const agent = createGraph("test-api-key")
    expect(typeof agent.streamEvents).toBe("function")
    expect(typeof agent.invoke).toBe("function")
  })
})
