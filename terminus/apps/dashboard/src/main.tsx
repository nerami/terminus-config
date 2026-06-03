// Entry point. Side-effect import makes the build emit the compiled stylesheet
// as an asset (which `panelCssPlugin` splits into style.css + style.global.css)
// and lets Vite serve the CSS in dev.
import "./index.css"
import { registerTerminusPanel } from "./panel"
import { renderApp } from "./render"

// Build-time render mode, chosen by VITE_PANEL_MODE in vite.config:
//   "shadow" (default) — the <terminus-panel> web component Home Assistant loads.
//   "light"            — render straight into the light DOM, for easier local
//                        debugging (real devtools, no shadow boundary, normal
//                        CSS HMR). Dev only; prod targets must use "shadow".
// A literal lets the bundler drop the unused branch.
declare const __PANEL_MODE__: "shadow" | "light"

if (__PANEL_MODE__ === "light") {
  // Light DOM: CSS comes from Vite's automatic <head> injection in dev; tokens
  // resolve via `:root` and `.dark` without a shadow host.
  const root = document.getElementById("root")
  if (root) renderApp(root)
} else {
  registerTerminusPanel()
  // Dev (`pnpm dev`): mount the real element so the shadow path + CSS split run
  // locally, making shadow-only regressions reproducible before deploy. HA
  // instantiates <terminus-panel> itself via panel_custom, so this is dev-only.
  const devRoot = document.getElementById("root")
  if (
    import.meta.env.DEV &&
    devRoot &&
    !devRoot.querySelector("terminus-panel")
  ) {
    devRoot.appendChild(document.createElement("terminus-panel"))
  }
}
