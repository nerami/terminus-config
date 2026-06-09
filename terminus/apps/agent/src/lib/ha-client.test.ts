import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { haFetch } from "./ha-client.js"

const ORIG = { ...process.env }

beforeEach(() => {
  process.env.HASS_SERVER = "https://ha.test"
  process.env.HASS_TOKEN = "tok"
})
afterEach(() => {
  vi.unstubAllGlobals()
  process.env = { ...ORIG }
})

describe("haFetch", () => {
  it("sends bearer auth + JSON headers to the right URL and parses JSON", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ result: "ok" }), { status: 200 }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const res = await haFetch("/api/states")

    expect(res).toEqual({ ok: true, status: 200, data: { result: "ok" } })
    const call = fetchMock.mock.calls[0]
    expect(call).toBeDefined()
    const [url, init] = call
    expect(url).toBe("https://ha.test/api/states")
    expect((init!.headers as Record<string, string>).Authorization).toBe("Bearer tok")
    expect((init!.headers as Record<string, string>)["Content-Type"]).toBe("application/json")
  })

  it("returns ok:false with status + body on non-2xx", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad config", { status: 400 })))
    const res = await haFetch("/api/config/automation/config/1", { method: "POST", body: "{}" })
    expect(res).toEqual({ ok: false, status: 400, error: "bad config" })
  })

  it("reports HA unreachable on abort/timeout", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      const e = new Error("aborted")
      e.name = "AbortError"
      throw e
    }))
    const res = await haFetch("/api/states")
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toContain("unreachable")
  })

  it("returns ok:false when env is missing", async () => {
    delete process.env.HASS_TOKEN
    const res = await haFetch("/api/states")
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toContain("HASS_")
  })
})
