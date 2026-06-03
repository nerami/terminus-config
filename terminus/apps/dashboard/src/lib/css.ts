// `@font-face` and `@property` are document-global constructs: declared inside a
// shadow root they are silently ignored (font never registers, typed custom
// properties lose their initial-value). Split them out so the panel can inject
// them into the document head while keeping everything else scoped to the shadow
// root. Both at-rules have flat bodies (no nested braces), so a single regex is
// safe.
const GLOBAL_RULE = /@(?:font-face|property)\b[^{]*\{[^{}]*\}/g

export function splitGlobalCss(css: string): {
  globalCss: string
  scopedCss: string
} {
  const globals = css.match(GLOBAL_RULE) ?? []
  const scopedCss = css.replace(GLOBAL_RULE, "")
  return { globalCss: globals.join(""), scopedCss }
}
