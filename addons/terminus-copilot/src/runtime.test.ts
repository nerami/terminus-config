import { describe, expect, it, vi } from "vitest"

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({ name: "fake-anthropic" })),
}))

import { buildRuntime } from "./runtime"

describe("buildRuntime", () => {
  it("returns an Express handler function when given an api key", () => {
    const handler = buildRuntime({ apiKey: "sk-test" })
    expect(typeof handler).toBe("function")
  })

  it("throws when apiKey is empty", () => {
    expect(() => buildRuntime({ apiKey: "" })).toThrow(/api key/i)
  })
})
