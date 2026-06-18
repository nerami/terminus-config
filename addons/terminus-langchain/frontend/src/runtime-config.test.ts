import { describe, expect, it } from "vitest"

import { resolveEndpoints } from "./runtime-config"

describe("resolveEndpoints", () => {
  it("derives api and status urls under an ingress prefix", () => {
    const ep = resolveEndpoints({
      origin: "http://homeassistant.local:8123",
      pathname: "/api/hassio_ingress/abc123token/",
    })
    expect(ep.apiUrl).toBe(
      "http://homeassistant.local:8123/api/hassio_ingress/abc123token/api",
    )
    expect(ep.haStatusUrl).toBe(
      "http://homeassistant.local:8123/api/hassio_ingress/abc123token/ha/status",
    )
    expect(ep.assistantId).toBe("agent")
  })

  it("works at the dev server root", () => {
    const ep = resolveEndpoints({
      origin: "http://localhost:5173",
      pathname: "/",
    })
    expect(ep.apiUrl).toBe("http://localhost:5173/api")
    expect(ep.haStatusUrl).toBe("http://localhost:5173/ha/status")
  })

  it("strips a trailing file segment when present", () => {
    const ep = resolveEndpoints({
      origin: "http://h",
      pathname: "/api/hassio_ingress/tok/index.html",
    })
    expect(ep.apiUrl).toBe("http://h/api/hassio_ingress/tok/api")
  })
})
