import type { Plugin } from "vite"

import { splitGlobalCss } from "./src/lib/css"

// The panel mounts inside a shadow root. `@font-face` and `@property` rules are
// document-global: declared inside a shadow root they are silently dropped (the
// font never registers; Tailwind's typed `--tw-*` custom properties lose their
// initial-value). So we split the one emitted stylesheet in two:
//
//   style.css         → scoped rules, linked into the shadow root
//   style.global.css  → @font-face + @property, linked into document <head>
//
// Splitting the *emitted* CSS (rather than importing `?inline`) is deliberate:
// in library mode Vite hoists most @font-face into the CSS asset, so `?inline`
// returns an incomplete stylesheet. The emitted asset is always complete.
export function panelCssPlugin(): Plugin {
  return {
    name: "terminus-panel-css",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== "asset" || !fileName.endsWith(".css")) continue

        const css =
          typeof asset.source === "string"
            ? asset.source
            : Buffer.from(asset.source).toString("utf8")

        const { globalCss, scopedCss } = splitGlobalCss(css)
        if (!globalCss) continue

        asset.source = scopedCss
        this.emitFile({
          type: "asset",
          fileName: "style.global.css",
          source: globalCss,
        })
      }
    },
  }
}
