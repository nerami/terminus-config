import { describe, expect, it, vi } from "vitest"
import { resolveAddonIngressUrl, resolveRuntimeUrl } from "./copilot"

describe("resolveRuntimeUrl", () => {
  it("derives ingress prefix from /api/hassio_ingress/<token>/", () => {
    expect(
      resolveRuntimeUrl({
        pathname: "/api/hassio_ingress/abc123token/index.html",
        fallback: "http://dev/api/copilotkit",
      })
    ).toBe("/api/hassio_ingress/abc123token/api/copilotkit")
  })

  it("falls back to dev URL when no ingress prefix present", () => {
    expect(
      resolveRuntimeUrl({
        pathname: "/lovelace/0",
        fallback: "http://dev/api/copilotkit",
      })
    ).toBe("http://dev/api/copilotkit")
  })

  it("uses default localhost dev URL when fallback not provided", () => {
    expect(resolveRuntimeUrl({ pathname: "/" })).toBe(
      "http://localhost:3000/api/copilotkit"
    )
  })
})

describe("resolveAddonIngressUrl", () => {
  it("POSTs session, GETs info, returns ingress_url + /api/copilotkit", async () => {
    const calls: Array<{ url: string; method: string }> = []
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString()
      const method = (init?.method ?? "GET").toUpperCase()
      calls.push({ url, method })
      if (url.includes("/api/hassio/ingress/session")) {
        return new Response(JSON.stringify({ data: { session: "S1" } }), { status: 200 })
      }
      if (url.includes("/api/hassio/addons/terminus_copilot/info")) {
        return new Response(
          JSON.stringify({ data: { ingress_url: "/api/hassio_ingress/TOK/" } }),
          { status: 200 }
        )
      }
      return new Response("not mocked", { status: 500 })
    }) as unknown as typeof fetch

    const url = await resolveAddonIngressUrl("terminus_copilot", "t", fetchImpl)
    expect(url).toBe("/api/hassio_ingress/TOK/api/copilotkit")
    expect(calls.some((c) => c.method === "POST" && c.url.includes("/ingress/session"))).toBe(
      true
    )
    expect(calls.some((c) => c.method === "GET" && c.url.includes("/addons/terminus_copilot/info"))).toBe(
      true
    )
  })

  it("throws when session POST fails", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 401 })) as unknown as typeof fetch
    await expect(resolveAddonIngressUrl("terminus_copilot", "t", fetchImpl)).rejects.toThrow(
      /ingress\/session 401/
    )
  })

  it("throws when info response lacks ingress_url", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString()
      if (url.includes("/ingress/session")) {
        return new Response("{}", { status: 200 })
      }
      return new Response(JSON.stringify({ data: {} }), { status: 200 })
    }) as unknown as typeof fetch
    await expect(resolveAddonIngressUrl("terminus_copilot", "t", fetchImpl)).rejects.toThrow(
      /no ingress_url/
    )
  })
})
