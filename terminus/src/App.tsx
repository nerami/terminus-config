import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { LiveStateProvider, useLiveState } from "@/lib/liveState"
import { loadManifest } from "@/lib/graph"
import { useRoute } from "@/lib/router"
import { SystemMap } from "@/routes/SystemMap"
import { AutomationView } from "@/routes/AutomationView"
import { EmptyState } from "@/components/EmptyState"
import type { Manifest } from "@/types/manifest"

const STALE_DAYS = 7

function StatusBadge() {
  const { status } = useLiveState()
  const label =
    status === "connecting" ? "Connecting…" : status === "connected" ? "Connected" : "Error"
  const variant =
    status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"
  return <Badge variant={variant}>{label}</Badge>
}

function StalenessBanner({ generatedAt }: { generatedAt: string }) {
  const days = Math.floor((Date.now() - Date.parse(generatedAt)) / (1000 * 60 * 60 * 24))
  if (days < STALE_DAYS) return null
  return (
    <div className="border-b bg-amber-100 px-4 py-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      Manifest is {days} days old — run <code>bin/deploy-ssh.sh</code> to refresh.
    </div>
  )
}

function Shell() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const route = useRoute()

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
    <div className="flex h-svh flex-col">
      <StalenessBanner generatedAt={manifest.generatedAt} />
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-base font-semibold">Terminus</h1>
        <StatusBadge />
      </header>
      <main className="flex-1">
        {route.name === "map" ? (
          <SystemMap manifest={manifest} />
        ) : (
          <AutomationView manifest={manifest} autoId={route.id} />
        )}
      </main>
    </div>
  )
}

export function App() {
  return (
    <LiveStateProvider>
      <Shell />
    </LiveStateProvider>
  )
}

export default App
