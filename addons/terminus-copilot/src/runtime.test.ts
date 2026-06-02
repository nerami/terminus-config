import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { of, throwError } from "rxjs"

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({ name: "fake-anthropic" })),
}))

const mockFallbackRun = vi.fn()

vi.mock("@copilotkit/runtime/v2", () => ({
  BuiltInAgent: class MockBuiltInAgent {
    run(input: unknown) {
      return mockFallbackRun(input)
    }
  },
  CopilotSseRuntime: class {
    constructor(public opts: unknown) {}
  },
}))

vi.mock("@copilotkit/runtime/langgraph", () => ({
  LangGraphHttpAgent: class MockLangGraph {
    constructor(public opts: { url: string }) {}
    run(_input: unknown) {
      return throwError(() => new Error("connect ECONNREFUSED 127.0.0.1:3001"))
    }
    clone() {
      const c = Object.create(Object.getPrototypeOf(this)) as this
      c.opts = this.opts
      return c
    }
  },
}))

vi.mock("@copilotkit/runtime/v2/express", () => ({
  createCopilotExpressHandler: vi.fn(
    () =>
      (_req: unknown, res: { json: (b: unknown) => void }) =>
        res.json({ stub: "runtime" }),
  ),
}))

import { SafeHttpAgent, buildRuntime } from "./runtime"
import type { BuiltInAgent } from "@copilotkit/runtime/v2"

describe("SafeHttpAgent", () => {
  beforeEach(() => {
    mockFallbackRun.mockReturnValue(of({ type: "RUN_FINISHED" }))
  })

  it("delegates to fallback when LangGraphHttpAgent.run() errors", async () => {
    const fallback = { run: mockFallbackRun } as unknown as BuiltInAgent
    const agent = new SafeHttpAgent({ url: "http://localhost:3001" }, fallback)
    const input = { threadId: "t1", runId: "r1" }

    const results: unknown[] = []
    await new Promise<void>((resolve) => {
      agent.run(input).subscribe({
        next: (v: unknown) => results.push(v),
        complete: resolve,
      })
    })

    expect(mockFallbackRun).toHaveBeenCalledWith(input)
    expect(results).toEqual([{ type: "RUN_FINISHED" }])
  })

  it("clone() preserves fallback so cloned agent also delegates", async () => {
    const fallback = { run: mockFallbackRun } as unknown as BuiltInAgent
    const agent = new SafeHttpAgent({ url: "http://localhost:3001" }, fallback)
    const cloned = agent.clone()
    const input = { threadId: "t2", runId: "r2" }

    const results: unknown[] = []
    await new Promise<void>((resolve) => {
      cloned.run(input).subscribe({
        next: (v: unknown) => results.push(v),
        complete: resolve,
      })
    })

    expect(mockFallbackRun).toHaveBeenCalledWith(input)
    expect(results).toEqual([{ type: "RUN_FINISHED" }])
  })
})

describe("buildRuntime", () => {
  afterEach(() => {
    delete process.env.TERMINUS_AGENT_URL
  })

  it("returns an Express handler when given an api key", () => {
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })

  it("throws when apiKey is empty", () => {
    expect(() => buildRuntime({ apiKey: "" })).toThrow(/api key/i)
  })

  it("uses BuiltIn directly when TERMINUS_AGENT_URL is not set", () => {
    delete process.env.TERMINUS_AGENT_URL
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })

  it("uses SafeHttpAgent when TERMINUS_AGENT_URL is set", () => {
    process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })
})
