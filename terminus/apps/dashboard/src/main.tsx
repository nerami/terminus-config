import { StrictMode } from "react"
import { createRoot, type Root } from "react-dom/client"

// Side-effect import: makes the production build emit the compiled stylesheet as
// an asset, which `panelCssPlugin` then splits into style.css (scoped) +
// style.global.css (document globals). In dev it lets Vite serve the CSS.
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { PortalContainerProvider } from "@/lib/portalContainer"
import { splitGlobalCss } from "@/lib/css"

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
// Prod and dev produce the identical DOM (globals in <head>, scoped in the
// shadow); only the source differs — emitted files in prod, a `?inline` split in
// dev — because dev has no build step. This makes shadow-only regressions
// (fonts, @property vars, :host tokens) reproducible locally before deploy.
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

function render(host: HTMLElement, portalContainer: HTMLElement | null = host) {
  const root = createRoot(host)
  root.render(
    <StrictMode>
      <ThemeProvider>
        <PortalContainerProvider container={portalContainer}>
          <App />
        </PortalContainerProvider>
      </ThemeProvider>
    </StrictMode>
  )
  return root
}

// HA panel_custom instantiates a <terminus-panel> in the same document as HA's
// own UI. Tailwind preflight + our @layer base would otherwise cascade into
// HA's chrome (font, body bg, button reset, *box-sizing). Encapsulate via an
// open shadow root so all panel styles stay scoped to the panel.
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

    this.root = render(mount, portalHost)
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = undefined
  }
}

if (!customElements.get("terminus-panel")) {
  customElements.define("terminus-panel", TerminusPanel)
}

// Dev (`pnpm dev`): mount the real <terminus-panel> so the dev environment
// exercises the same shadow root + CSS split as the HA panel. This is what makes
// shadow-DOM-only regressions (fonts, @property vars, :host tokens) catchable
// locally before deploy.
const devRoot = document.getElementById("root")
if (devRoot && !devRoot.querySelector("terminus-panel")) {
  devRoot.appendChild(document.createElement("terminus-panel"))
}
