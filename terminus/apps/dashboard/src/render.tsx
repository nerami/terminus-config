import { StrictMode } from "react"
import { createRoot, type Root } from "react-dom/client"

import App from "./app.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { PortalContainerProvider } from "@/lib/portal-container"

// Mounts the React tree into `host`. `portalContainer` is where Base UI portals
// (Sheet, Dialog) render — defaults to the host, so shadow-root callers keep
// portals inside the encapsulation. Shared by both render modes (shadow panel +
// light-DOM dev). See `panel.tsx` and `main.tsx`.
export function renderApp(
  host: HTMLElement,
  portalContainer: HTMLElement | null = host
): Root {
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
