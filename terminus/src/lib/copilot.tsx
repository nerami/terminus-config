import { CopilotKit } from "@copilotkit/react-core"
import type { ReactNode } from "react"

const DEFAULT_DEV_URL = "http://localhost:3000/api/copilotkit"
const INGRESS_RE = /^(\/api\/hassio_ingress\/[^/]+)\//

type ResolveOpts = { pathname: string; fallback?: string }

export function resolveRuntimeUrl({
  pathname,
  fallback = DEFAULT_DEV_URL,
}: ResolveOpts): string {
  const match = pathname.match(INGRESS_RE)
  if (!match) return fallback
  return `${match[1]}/api/copilotkit`
}

export function CopilotProvider({ children }: { children: ReactNode }) {
  const fallback =
    import.meta.env.VITE_COPILOT_RUNTIME_URL ?? DEFAULT_DEV_URL
  const runtimeUrl = resolveRuntimeUrl({
    pathname: window.location.pathname,
    fallback,
  })
  return <CopilotKit runtimeUrl={runtimeUrl}>{children}</CopilotKit>
}
