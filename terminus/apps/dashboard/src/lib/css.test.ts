import { describe, expect, it } from "vitest"

import { splitGlobalCss } from "./css"

describe("splitGlobalCss", () => {
  it("moves @font-face rules into globalCss and out of scopedCss", () => {
    const css = `@font-face{font-family:"X";src:url(data:font/woff2;base64,AAAA)}.a{color:red}`
    const { globalCss, scopedCss } = splitGlobalCss(css)
    expect(globalCss).toContain("@font-face")
    expect(globalCss).toContain("base64,AAAA")
    expect(scopedCss).not.toContain("@font-face")
    expect(scopedCss).toContain(".a{color:red}")
  })

  it("moves @property rules into globalCss and out of scopedCss", () => {
    const css = `@property --tw-ring{syntax:"*";inherits:false;initial-value:0}.b{top:0}`
    const { globalCss, scopedCss } = splitGlobalCss(css)
    expect(globalCss).toContain("@property --tw-ring")
    expect(scopedCss).not.toContain("@property")
    expect(scopedCss).toContain(".b{top:0}")
  })

  it("keeps :root/:host and class rules in scopedCss only", () => {
    const css = `:root,:host{--c:1}.react-flow{height:100%}`
    const { globalCss, scopedCss } = splitGlobalCss(css)
    expect(globalCss).not.toContain(":root")
    expect(globalCss).not.toContain(".react-flow")
    expect(scopedCss).toContain(":root,:host{--c:1}")
    expect(scopedCss).toContain(".react-flow{height:100%}")
  })

  it("extracts multiple adjacent minified global rules", () => {
    const css = `@font-face{src:url(a)}@property --x{syntax:"*"}@font-face{src:url(b)}.z{x:1}`
    const { globalCss, scopedCss } = splitGlobalCss(css)
    expect(globalCss.match(/@font-face/g)).toHaveLength(2)
    expect(globalCss).toContain("@property --x")
    expect(scopedCss).toBe(".z{x:1}")
  })
})
