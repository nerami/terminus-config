import { CopilotKit } from "@copilotkit/react-core/v2"
import { useEffect, useState, type ReactNode } from "react"
import { connectHA } from "@/lib/ha"

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

type AddonInfo = { ingress_url?: string | null }

// The HTTP proxy at /api/hassio/* whitelists only admin-utility paths
// (backups/logs/icon/etc) — ingress/session and addons/<slug>/info are
// not in PATHS_ADMIN and return 401 regardless of bearer token. HA's own
// frontend uses the `supervisor/api` websocket command, which has its
// own non-admin allowlist (WS_NO_ADMIN_ENDPOINTS) covering exactly the
// endpoints we need.
type SupervisorCaller = <T>(message: {
  type: "supervisor/api"
  endpoint: string
  method: "GET" | "POST"
}) => Promise<T>

export async function resolveAddonIngressUrl(
  slug: string,
  sendSupervisor: SupervisorCaller
): Promise<string> {
  try {
    await sendSupervisor({
      type: "supervisor/api",
      endpoint: "/ingress/session",
      method: "POST",
    })
  } catch (e) {
    throw new Error(`ingress/session failed: ${describeWsError(e)}`, { cause: e })
  }

  let info: AddonInfo
  try {
    info = await sendSupervisor<AddonInfo>({
      type: "supervisor/api",
      endpoint: `/addons/${slug}/info`,
      method: "GET",
    })
  } catch (e) {
    throw new Error(`addons/${slug}/info failed: ${describeWsError(e)}`, { cause: e })
  }

  const ingress = info?.ingress_url
  if (!ingress) {
    throw new Error(`add-on ${slug} has no ingress_url (started?)`)
  }
  return ingress.replace(/\/$/, "") + "/api/copilotkit"
}

function describeWsError(e: unknown): string {
  if (e && typeof e === "object" && "code" in e) {
    const { code, message } = e as { code?: string; message?: string }
    return `${code ?? "unknown"}${message ? `: ${message}` : ""}`
  }
  return e instanceof Error ? e.message : String(e)
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
        const conn = await connectHA()
        const url = await resolveAddonIngressUrl(ADDON_SLUG, (msg) =>
          conn.sendMessagePromise(msg)
        )
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
