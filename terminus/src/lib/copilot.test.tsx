import { describe, expect, it } from "vitest"
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

type WsMsg = { type: string; endpoint: string; method: string }

describe("resolveAddonIngressUrl", () => {
  it("calls supervisor/api for session + info via websocket, returns ingress URL", async () => {
    const calls: WsMsg[] = []
    const send = async <T,>(msg: WsMsg): Promise<T> => {
      calls.push(msg)
      if (msg.endpoint === "/ingress/session") return {} as T
      if (msg.endpoint === "/addons/terminus_copilot/info") {
        return { ingress_url: "/api/hassio_ingress/TOK/" } as T
      }
      throw new Error(`unexpected endpoint ${msg.endpoint}`)
    }

    const url = await resolveAddonIngressUrl("terminus_copilot", send)
    expect(url).toBe("/api/hassio_ingress/TOK/api/copilotkit")
    expect(calls).toEqual([
      { type: "supervisor/api", endpoint: "/ingress/session", method: "POST" },
      {
        type: "supervisor/api",
        endpoint: "/addons/terminus_copilot/info",
        method: "GET",
      },
    ])
  })

  it("throws when ingress/session command rejects", async () => {
    const send = async <T,>(_msg: WsMsg): Promise<T> => {
      throw { code: "unauthorized", message: "nope" }
    }
    await expect(
      resolveAddonIngressUrl("terminus_copilot", send)
    ).rejects.toThrow(/ingress\/session failed: unauthorized: nope/)
  })

  it("throws when info result lacks ingress_url", async () => {
    const send = async <T,>(_msg: WsMsg): Promise<T> => ({} as T)
    await expect(
      resolveAddonIngressUrl("terminus_copilot", send)
    ).rejects.toThrow(/no ingress_url/)
  })
})
