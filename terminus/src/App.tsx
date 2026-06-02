import { useEffect, useMemo, useRef, useState } from "react"
import { CopilotSidebar } from "@copilotkit/react-core/v2"
import "@copilotkit/react-ui/v2/styles.css"
import { Badge } from "@/components/ui/badge"
import { LiveStateProvider, useLiveState } from "@/lib/liveState"
import { RegistryProvider, useRegistryEntities } from "@/lib/registry"
import { CopilotProvider } from "@/lib/copilot"
import { CopilotCatalog } from "@/copilot/readable"
import { CopilotActions, createProposeAutomationController } from "@/copilot/actions"
import { PreviewCard } from "@/copilot/PreviewCard"
import { loadManifest } from "@/lib/graph"
import { useRoute } from "@/lib/router"
import { getAuthToken } from "@/lib/ha"
import { SystemMap } from "@/routes/SystemMap"
import { AutomationView } from "@/routes/AutomationView"
import { EmptyState } from "@/components/EmptyState"
import { NodeDetailSheet } from "@/components/NodeDetailSheet"
import type { AutomationProposal } from "@/lib/automationWriter"
import type { GraphNode, Manifest } from "@/types/manifest"

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
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const route = useRoute()

  return (
    <div className="flex h-svh flex-col">
      <StalenessBanner generatedAt={manifest.generatedAt} />
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-base font-semibold">Terminus</h1>
        <StatusBadge />
      </header>
      <main className="flex-1">
        {route.name === "map" ? (
          <SystemMap
            manifest={manifest}
            onSelect={(node) => {
              setSelected(node)
              setSheetOpen(true)
            }}
          />
        ) : (
          <AutomationView manifest={manifest} autoId={route.id} />
        )}
      </main>
      <NodeDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} node={selected} />
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
    <CopilotProvider>
      <LiveStateProvider>
        <RegistryProvider>
          <Shell manifest={manifest} />
          <CopilotWiring manifest={manifest} />
          <CopilotSidebar
            defaultOpen
            labels={{
              modalHeaderTitle: "Terminus Copilot",
              welcomeMessageText:
                "Describe an automation. I'll propose YAML, you approve or reject.",
            }}
          />
        </RegistryProvider>
      </LiveStateProvider>
    </CopilotProvider>
  )
}

export default App
