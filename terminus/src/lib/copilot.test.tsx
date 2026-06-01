import { describe, expect, it } from "vitest"
import { resolveRuntimeUrl } from "./copilot"

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
