// Restore the iframe location from the parent (HA) URL hash BEFORE the router is
// imported/evaluated. Must stay the first import.
import "./lib/parent-url-restore"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { NuqsAdapter } from "nuqs/adapters/react"
import { Provider as JotaiProvider } from "jotai"
import { ThemeProvider } from "next-themes"

import { router } from "./router"
import "@fontsource-variable/inter"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <JotaiProvider>
        <NuqsAdapter>
          <RouterProvider router={router} />
        </NuqsAdapter>
      </JotaiProvider>
    </ThemeProvider>
  </StrictMode>,
)
