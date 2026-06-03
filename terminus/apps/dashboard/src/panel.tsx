import type { Root } from "react-dom/client"

import { renderApp } from "./render"
import { splitGlobalCss } from "@/lib/css"

// This is the artifact Home Assistant loads: `panel_custom` instantiates
// <terminus-panel> in the same document as HA's own UI. An open shadow root
// keeps Tailwind preflight + our @layer base from cascading into HA's chrome
// (font, body bg, button reset, *box-sizing).

const ASSET_BASE = "/local/terminus-dashboard/"
const GLOBAL_STYLE_ID = "terminus-global-styles"

// `@font-face` and `@property` must live in the document — declared inside a
// shadow root they are silently ignored (font never registers; Tailwind's typed
// `--tw-*` vars lose their initial-value). Both are non-cascading registrations,
// so injecting them into <head> does not leak visual styles into HA's chrome.
// Guarded by id so multiple panel instances share one registration.
//
// `scopedCss` (preflight, utilities, :host tokens) stays inside the shadow root.
//
// Prod links the two emitted files (split by `panelCssPlugin`); dev mirrors the
// same DOM via a `?inline` split, since dev has no build step. This makes
// shadow-only regressions (fonts, @property vars, :host tokens) reproducible
// locally before deploy.
function injectStyles(shadow: ShadowRoot) {
  const hasScoped = shadow.querySelector("[data-terminus-css]")
  const hasGlobal = document.getElementById(GLOBAL_STYLE_ID)

  if (import.meta.env.DEV) {
    void import("./index.css?inline").then(({ default: rawCss }) => {
      const { globalCss, scopedCss } = splitGlobalCss(rawCss)
      if (!hasGlobal) {
        const style = document.createElement("style")
        style.id = GLOBAL_STYLE_ID
        style.textContent = globalCss
        document.head.appendChild(style)
      }
      if (!hasScoped) {
        const style = document.createElement("style")
        style.dataset.terminusCss = "true"
        style.textContent = scopedCss
        shadow.appendChild(style)
      }
    })
    return
  }

  if (!hasGlobal) {
    const link = document.createElement("link")
    link.id = GLOBAL_STYLE_ID
    link.rel = "stylesheet"
    link.href = `${ASSET_BASE}style.global.css`
    document.head.appendChild(link)
  }
  if (!hasScoped) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `${ASSET_BASE}style.css`
    link.dataset.terminusCss = "true"
    shadow.appendChild(link)
  }
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
