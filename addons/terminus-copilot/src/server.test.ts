import { describe, expect, it, vi } from "vitest"
import request from "supertest"

vi.mock("./runtime", () => ({
  buildRuntime: vi.fn(() => (_req: unknown, res: { json: (body: unknown) => void }) =>
    res.json({ stub: "runtime" })
  ),
}))

import { createApp } from "./server"

describe("createApp", () => {
  it("responds 200 on /health", async () => {
    const app = createApp({ apiKey: "sk-test" })
    const res = await request(app).get("/health")
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it("mounts copilotkit handler at /api/copilotkit", async () => {
    const app = createApp({ apiKey: "sk-test" })
    const res = await request(app).post("/api/copilotkit").send({})
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ stub: "runtime" })
  })

  it("throws if api key missing", () => {
    expect(() => createApp({ apiKey: "" })).toThrow(/api key/i)
  })
})
