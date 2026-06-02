import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { HassEntities } from "home-assistant-js-websocket"
import { connectHA, watchEntities } from "@/lib/ha"

type LiveState = {
  status: "connecting" | "connected" | "error"
  error: string | null
  entities: HassEntities
}

const Ctx = createContext<LiveState | null>(null)

export function LiveStateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LiveState["status"]>("connecting")
  const [error, setError] = useState<string | null>(null)
  const [entities, setEntities] = useState<HassEntities>({})

  useEffect(() => {
    let cancelled = false
    let unsubscribe: (() => void) | undefined
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

  const value = useMemo(() => ({ status, error, entities }), [status, error, entities])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLiveState(): LiveState {
  const v = useContext(Ctx)
  if (!v) throw new Error("useLiveState must be used inside <LiveStateProvider>")
  return v
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEntityState(entityId: string | undefined): string | undefined {
  const { entities } = useLiveState()
  if (!entityId) return undefined
  return entities[entityId]?.state
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAutomationEnabled(autoId: string): boolean {
  const state = useEntityState(`automation.${autoId}`)
  return state === "on"
}
