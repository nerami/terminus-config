import { describe, expect, it } from "vitest"
import { parseRoute, formatRoute } from "./router"

describe("router", () => {
  it("parses empty hash as map", () => {
    expect(parseRoute("")).toEqual({ name: "map" })
    expect(parseRoute("#")).toEqual({ name: "map" })
    expect(parseRoute("#/")).toEqual({ name: "map" })
  })

  it("parses /auto/<id>", () => {
    expect(parseRoute("#/auto/mb_lamp_on_dark")).toEqual({
      name: "auto",
      id: "mb_lamp_on_dark",
    })
  })

  it("decodes URL-encoded ids", () => {
    expect(parseRoute("#/auto/foo%2Fbar")).toEqual({ name: "auto", id: "foo/bar" })
  })

  it("falls back to map for unknown routes", () => {
    expect(parseRoute("#/nope")).toEqual({ name: "map" })
  })

  it("formats route to hash", () => {
    expect(formatRoute({ name: "map" })).toBe("#/")
    expect(formatRoute({ name: "auto", id: "mb_lamp_on_dark" })).toBe("#/auto/mb_lamp_on_dark")
    expect(formatRoute({ name: "auto", id: "foo/bar" })).toBe("#/auto/foo%2Fbar")
  })
})
