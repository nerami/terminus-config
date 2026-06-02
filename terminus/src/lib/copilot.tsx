import { CopilotKit } from "@copilotkit/react-core/v2"
import { useEffect, useState, type ReactNode } from "react"
import { getAuthToken } from "@/lib/ha"

const DEFAULT_DEV_URL = "http://localhost:3000/api/copilotkit"
const INGRESS_RE = /^(\/api\/hassio_ingress\/[^/]+)\//
const ADDON_SLUG = "terminus_copilot"

type ResolveOpts = { pathname: string; fallback?: string }

export function resolveRuntimeUrl({
  pathname,
  fallback = DEFAULT_DEV_URL,
}: ResolveOpts): string {
  const match = pathname.match(INGRESS_RE)
  if (!match) return fallback
  return `${match[1]}/api/copilotkit`
}

export type RuntimeUrlState =
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "error"; error: string }

export async function resolveAddonIngressUrl(
  slug: string,
  token: string,
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const sessionRes = await fetchImpl("/api/hassio/ingress/session", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!sessionRes.ok) {
    throw new Error(`hassio/ingress/session ${sessionRes.status}`)
  }
  const infoRes = await fetchImpl(`/api/hassio/addons/${slug}/info`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!infoRes.ok) {
    throw new Error(`hassio/addons/${slug}/info ${infoRes.status}`)
  }
  const json = (await infoRes.json()) as { data?: { ingress_url?: string } }
  const ingress = json.data?.ingress_url
  if (!ingress) {
    throw new Error(`add-on ${slug} has no ingress_url (started?)`)
  }
  return ingress.replace(/\/$/, "") + "/api/copilotkit"
}

function syncRuntimeUrl(): string | null {
  const sync = resolveRuntimeUrl({
    pathname: window.location.pathname,
    fallback: "",
  })
  if (sync) return sync
  const dev = import.meta.env.VITE_COPILOT_RUNTIME_URL
  return dev || null
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCopilotRuntimeUrl(): RuntimeUrlState {
  const [state, setState] = useState<RuntimeUrlState>(() => {
    const sync = syncRuntimeUrl()
    return sync ? { status: "ready", url: sync } : { status: "loading" }
  })

  useEffect(() => {
    if (state.status !== "loading") return
    let cancelled = false
    void (async () => {
      try {
        console.info("[terminus] resolving copilot runtime url…")
        const token = await getAuthToken()
        console.info("[terminus] got HA auth token, length=", token.length)
        const url = await resolveAddonIngressUrl(ADDON_SLUG, token)
        console.info("[terminus] copilot runtime url =", url)
        if (!cancelled) setState({ status: "ready", url })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error("[terminus] copilot runtime url resolution failed:", msg)
        if (!cancelled) setState({ status: "error", error: msg })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [state.status])

  return state
}

export function CopilotProvider({
  url,
  children,
}: {
  url: string
  children: ReactNode
}) {
  return <CopilotKit runtimeUrl={url}>{children}</CopilotKit>
}
