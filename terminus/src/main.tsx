import { StrictMode } from "react"
import { createRoot, type Root } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { PortalContainerProvider } from "@/lib/portalContainer"

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

    if (!shadow.querySelector('link[data-terminus-css]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "/local/terminus/style.css"
      link.dataset.terminusCss = "true"
      shadow.appendChild(link)
    }

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

// Dev fallback: mount into #root from index.html when running `pnpm dev`.
const devRoot = document.getElementById("root")
if (devRoot) render(devRoot)
