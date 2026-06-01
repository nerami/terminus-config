import { useEffect, useMemo, useState } from "react"
import type { HassEntities } from "home-assistant-js-websocket"
import { connectHA, watchEntities, type ConnectionStatus } from "@/lib/ha"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function App() {
  const [status, setStatus] = useState<ConnectionStatus>("connecting")
  const [error, setError] = useState<string | null>(null)
  const [entities, setEntities] = useState<HassEntities>({})

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    connectHA()
      .then((conn) => {
        if (cancelled) {
          conn.close()
          return
        }
        setStatus("connected")
        unsubscribe = watchEntities(conn, (next) => setEntities({ ...next }))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setStatus("error")
        setError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const sorted = useMemo(
    () => Object.values(entities).sort((a, b) => a.entity_id.localeCompare(b.entity_id)),
    [entities]
  )

  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Home Assistant Dashboard</h1>
        <StatusBadge status={status} />
      </header>

      {status === "error" ? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Connection failed</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {error ?? "Unknown error connecting to Home Assistant."}
          </CardContent>
        </Card>
      ) : (
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardHeader>
            <CardTitle>
              Entities{" "}
              <span className="text-sm font-normal text-muted-foreground">
                ({sorted.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1">
            <ScrollArea className="h-[60vh] pr-4">
              <ul className="divide-y divide-border">
                {sorted.map((e) => (
                  <li
                    key={e.entity_id}
                    className="flex items-center justify-between gap-4 py-2 text-sm"
                  >
                    <span className="truncate font-mono">{e.entity_id}</span>
                    <Badge variant="secondary" className="shrink-0 font-mono">
                      {e.state}
                    </Badge>
                  </li>
                ))}
                {sorted.length === 0 && status === "connected" && (
                  <li className="py-4 text-sm text-muted-foreground">
                    No entities yet.
                  </li>
                )}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const label =
    status === "connecting" ? "Connecting…" : status === "connected" ? "Connected" : "Error"
  const variant =
    status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"
  return <Badge variant={variant}>{label}</Badge>
}

export default App
