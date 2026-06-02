import { describe, expect, it, vi, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { resolveAddonIngressUrl, resolveRuntimeUrl, useCopilotHealth } from "./copilot"

// ── resolveRuntimeUrl ────────────────────────────────────────────────────────

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

// ── resolveAddonIngressUrl ───────────────────────────────────────────────────

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

// ── useCopilotHealth ─────────────────────────────────────────────────────────

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

describe("useCopilotHealth", () => {
  afterEach(() => {
    mockFetch.mockReset()
  })

  it("starts in checking state", () => {
    mockFetch.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    expect(result.current).toEqual({ status: "checking" })
  })

  it("transitions to ok/builtin when health returns { status: ok, agent: builtin }", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "ok", agent: "builtin" }),
    })
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("ok"))
    expect(result.current).toEqual({ status: "ok", agent: "builtin" })
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/health",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it("transitions to degraded/offline when health returns { status: degraded, agent: offline }", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "degraded", agent: "offline" }),
    })
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("degraded"))
    expect(result.current).toEqual({ status: "degraded", agent: "offline" })
  })

  it("transitions to error state when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"))
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("error"))
  })

  it("transitions to error state when health endpoint returns non-ok status", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })
    const { result } = renderHook(() => useCopilotHealth("http://localhost:3000/api/copilotkit"))
    await waitFor(() => expect(result.current.status).toBe("error"))
  })

  it("derives health URL by replacing /api/copilotkit with /health", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "ok", agent: "external" }),
    })
    renderHook(() => useCopilotHealth("/api/hassio_ingress/TOKEN123/api/copilotkit"))
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/hassio_ingress/TOKEN123/health",
      expect.any(Object),
    )
  })
})
