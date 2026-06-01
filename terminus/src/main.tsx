import { StrictMode } from "react"
import { createRoot, type Root } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

function render(host: HTMLElement) {
  const root = createRoot(host)
  root.render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  )
  return root
}

// HA panel_custom instantiates a <terminus-panel> element and sets `hass` on
// it. Define the custom element so HA can mount it. The built bundle emits CSS
// as a sibling style.css — inject a <link> on connect so styles load with JS.
class TerminusPanel extends HTMLElement {
  private root?: Root

  connectedCallback() {
    if (!document.head.querySelector('link[data-terminus-css]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "/local/terminus/style.css"
      link.dataset.terminusCss = "true"
      document.head.appendChild(link)
    }
    this.root = render(this)
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
