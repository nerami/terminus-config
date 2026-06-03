import type { Root } from "react-dom/client"

import { renderApp } from "./render"

// This is the artifact Home Assistant loads: `panel_custom` instantiates
// <terminus-panel> in the same document as HA's own UI. An open shadow root
// keeps Tailwind preflight + our @layer base from cascading into HA's chrome
// (font, body bg, button reset, *box-sizing).

const ASSET_BASE = "/local/terminus-dashboard/"
const GLOBAL_STYLE_ID = "terminus-global-styles"

// `@font-face` and `@property` must live in the document — inside a shadow root
// they are silently ignored (font never registers; Tailwind's typed `--tw-*`
// vars lose their initial-value). Both are non-cascading, so putting them in
// <head> doesn't leak visual styles into HA's chrome.
function injectStyles(shadow: ShadowRoot) {
  if (shadow.querySelector("[data-terminus-css]")) return

  if (import.meta.env.DEV) {
    // Dev has no build step. The side-effect `import "./index.css"` already made
    // Vite inject the full sheet (incl. @font-face + @property) into <head>, so
    // the shadow just needs the same rules; the document-global at-rules are
    // inert here but harmless. (Splitting only matters for the prod files.)
    void import("./index.css?inline").then(({ default: css }) => {
      const style = document.createElement("style")
      style.dataset.terminusCss = "true"
      style.textContent = css
      shadow.appendChild(style)
    })
    return
  }

  // Prod: `panelCssPlugin` split the emitted sheet — globals to <head>, scoped
  // rules to the shadow root. The <head> link is id-guarded so multiple panel
  // instances share one registration.
  if (!document.getElementById(GLOBAL_STYLE_ID)) {
    const globals = document.createElement("link")
    globals.id = GLOBAL_STYLE_ID
    globals.rel = "stylesheet"
    globals.href = `${ASSET_BASE}style.global.css`
    document.head.appendChild(globals)
  }
  const scoped = document.createElement("link")
  scoped.rel = "stylesheet"
  scoped.href = `${ASSET_BASE}style.css`
  scoped.dataset.terminusCss = "true"
  shadow.appendChild(scoped)
}

class TerminusPanel extends HTMLElement {
  private root?: Root

  connectedCallback() {
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" })

    injectStyles(shadow)

    let mount = shadow.querySelector<HTMLDivElement>("div[data-terminus-mount]")
    if (!mount) {
      mount = document.createElement("div")
      mount.dataset.terminusMount = "true"
      mount.style.height = "100%"
      mount.style.width = "100%"
      shadow.appendChild(mount)
    }

    // Sibling node for Base UI portals (Sheet, Dialog, etc.). Portals must
    // mount inside the shadow root so Tailwind class rules from style.css
    // resolve — anything appended to document.body escapes the encapsulation
    // and renders unstyled. Kept outside the React mount so React's tree
    // never reconciles against portal-owned DOM.
    let portalHost = shadow.querySelector<HTMLDivElement>("div[data-terminus-portals]")
    if (!portalHost) {
      portalHost = document.createElement("div")
      portalHost.dataset.terminusPortals = "true"
      shadow.appendChild(portalHost)
    }

    // Host needs to fill its slot in HA's panel container.
    this.style.display = "block"
    this.style.height = "100%"
    this.style.width = "100%"

    this.root = renderApp(mount, portalHost)
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = undefined
  }
}

// Idempotent: custom elements can only be defined once per name.
export function registerTerminusPanel() {
  if (!customElements.get("terminus-panel")) {
    customElements.define("terminus-panel", TerminusPanel)
  }
}
