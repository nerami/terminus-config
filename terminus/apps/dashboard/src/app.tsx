import { useEffect, useMemo, useRef, useState } from "react"
import { RouterProvider } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import {
  CopilotSidebar,
  CopilotChatConfigurationProvider,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2"

import { Badge } from "@/components/ui/badge"
import { LiveStateProvider, useLiveState } from "@/lib/live-state"
import { RegistryProvider, useRegistryEntities } from "@/lib/registry"
import { CopilotProvider, useCopilotRuntimeUrl, useCopilotHealth } from "@/lib/copilot"
import { CopilotCatalog } from "@/copilot/readable"
import { CopilotActions, createProposeAutomationController } from "@/copilot/actions"
import { PreviewCard } from "@/copilot/preview-card"
import { loadManifest } from "@/lib/graph"
import { router } from "@/router"
import { getAuthToken } from "@/lib/ha"
import { EmptyState } from "@/components/empty-state"
import type { AutomationProposal } from "@/lib/automation-writer"
import type { Manifest } from "@/types/manifest"

const STALE_DAYS = 7
const NOW_MS = Date.now()

function StatusBadge() {
  const { status } = useLiveState()
  const label =
    status === "connecting" ? "Connecting…" : status === "connected" ? "Connected" : "Error"
  const variant =
    status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"
  return <Badge variant={variant}>{label}</Badge>
}

function StalenessBanner({ generatedAt }: { generatedAt: string }) {
  const days = Math.floor((NOW_MS - Date.parse(generatedAt)) / (1000 * 60 * 60 * 24))
  if (days < STALE_DAYS) return null
  return (
    <div className="border-b bg-amber-100 px-4 py-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      Manifest is {days} days old — run <code>bin/deploy-ssh.sh</code> to refresh.
    </div>
  )
}

function Shell({ manifest }: { manifest: Manifest }) {
  return (
    <div className="flex h-svh flex-col">
      <StalenessBanner generatedAt={manifest.generatedAt} />
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-base font-semibold">Terminus</h1>
        <StatusBadge />
      </header>
      <main className="flex-1 overflow-hidden">
        <RouterProvider router={router} context={{ manifest }} />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools router={router} />}
    </div>
  )
}

function CopilotWiring({ manifest }: { manifest: Manifest }) {
  const controller = useMemo(() => createProposeAutomationController(), [])
  const [, force] = useState(0)
  const [token, setToken] = useState<string>("")
  const knownIds = useRegistryEntities()
  const forceRef = useRef(force)
  forceRef.current = force

  useEffect(() => {
    getAuthToken().then(setToken).catch(() => setToken(""))
  }, [])

  useEffect(() => {
    const original = controller.handler
    controller.handler = async (proposal: AutomationProposal) => {
      const result = original(proposal)
      forceRef.current((n) => n + 1)
      return result
    }
    return () => {
      controller.handler = original
    }
  }, [controller])

  return (
    <>
      <CopilotCatalog manifest={manifest} />
      <CopilotActions controller={controller} knownEntityIds={knownIds} token={token} />
      {controller.pending && (
        <PreviewCard
          proposal={controller.pending}
          onApprove={() => {
            controller.approve()
            forceRef.current((n) => n + 1)
          }}
          onReject={(fb) => {
            controller.reject(fb)
            forceRef.current((n) => n + 1)
          }}
        />
      )}
    </>
  )
}

function CopilotStatusBadge({ children }: { children: string }) {
  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-md border bg-amber-100 px-3 py-2 text-xs text-amber-900 shadow-md dark:bg-amber-950 dark:text-amber-200">
      Copilot: {children}
    </div>
  )
}

function CopilotAgentStatus({ runtimeUrl }: { runtimeUrl: string }) {
  const health = useCopilotHealth(runtimeUrl)
  if (health.status !== "degraded") return null
  return (
    <CopilotStatusBadge>Terminus Agent offline — using fallback model</CopilotStatusBadge>
  )
}

const COPILOT_OPEN_KEY = "copilot-open"

function CopilotOpenSync() {
  const config = useCopilotChatConfiguration()
  useEffect(() => {
    if (!config) return
    sessionStorage.setItem(COPILOT_OPEN_KEY, String(config.isModalOpen))
  }, [config?.isModalOpen])
  return null
}

function CopilotIsland({ manifest }: { manifest: Manifest }) {
  const runtime = useCopilotRuntimeUrl()
  if (runtime.status === "loading") {
    return <CopilotStatusBadge>resolving runtime URL…</CopilotStatusBadge>
  }
  if (runtime.status === "error") {
    return <CopilotStatusBadge>{`error — ${runtime.error}`}</CopilotStatusBadge>
  }
  const defaultOpen = sessionStorage.getItem(COPILOT_OPEN_KEY) === "true"
  return (
    <CopilotProvider url={runtime.url}>
      <CopilotChatConfigurationProvider isModalDefaultOpen={defaultOpen}>
        <CopilotAgentStatus runtimeUrl={runtime.url} />
        <CopilotWiring manifest={manifest} />
        <CopilotOpenSync />
        <CopilotSidebar
          labels={{
            modalHeaderTitle: "Terminus Copilot",
            welcomeMessageText:
              "Describe an automation. I'll propose YAML, you approve or reject.",
          }}
        />
      </CopilotChatConfigurationProvider>
    </CopilotProvider>
  )
}

export function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  if (error) {
    return (
      <EmptyState
        title="Graph manifest missing"
        body="Run `pnpm build` in terminus/ to generate `www/terminus/graph.json`."
      />
    )
  }
  if (!manifest) return null

  return (
    <LiveStateProvider>
      <RegistryProvider>
        <Shell manifest={manifest} />
        <CopilotIsland manifest={manifest} />
      </RegistryProvider>
    </LiveStateProvider>
  )
}

export default App
