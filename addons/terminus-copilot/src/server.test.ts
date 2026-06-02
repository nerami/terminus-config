import { describe, expect, it, vi, afterEach } from "vitest"
import request from "supertest"

vi.mock("./runtime", () => ({
  buildRuntime: vi.fn(
    () =>
      (_req: unknown, res: { json: (body: unknown) => void }) =>
        res.json({ stub: "runtime" }),
  ),
}))

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

import { createApp } from "./server"

describe("createApp", () => {
  afterEach(() => {
    delete process.env.TERMINUS_AGENT_URL
    mockFetch.mockReset()
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

  describe("GET /health", () => {
    it("returns { status: ok, agent: builtin } when TERMINUS_AGENT_URL is not set", async () => {
      delete process.env.TERMINUS_AGENT_URL
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "ok", agent: "builtin" })
    })

    it("returns { status: ok, agent: external } when terminus-agent responds", async () => {
      process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
      mockFetch.mockResolvedValueOnce({ ok: true })
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "ok", agent: "external" })
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/health",
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      )
    })

    it("returns { status: degraded, agent: offline } when terminus-agent returns non-ok status", async () => {
      process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "degraded", agent: "offline" })
    })

    it("returns { status: degraded, agent: offline } when terminus-agent is unreachable", async () => {
      process.env.TERMINUS_AGENT_URL = "http://localhost:3001"
      mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"))
      const app = createApp({ apiKey: "sk-test" })
      const res = await request(app).get("/health")
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "degraded", agent: "offline" })
    })
  })
})
