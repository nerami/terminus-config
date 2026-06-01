import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Connection } from "home-assistant-js-websocket"
import { connectHA } from "@/lib/ha"

type EntityRegistryEntry = {
  entity_id: string
  area_id: string | null
  device_id: string | null
  disabled_by: string | null
  hidden_by: string | null
  labels: string[]
  platform: string | null
  config_entry_id: string | null
}

type AreaEntry = { area_id: string; name: string }
type LabelEntry = { label_id: string; name: string }
type ExposureMap = Record<string, Record<string, boolean>>
type ExposureReply = { exposed_entities: ExposureMap }

export type RegistryStatus = "loading" | "ready" | "error"

export type RegistryEntry = {
  entityId: string
  areaName: string | null
  enabled: boolean
  visible: boolean
  labels: string[]
  exposure: Record<string, boolean>
  platform: string | null
  inRegistry: boolean
}

type RegistryState = {
  status: RegistryStatus
  error: string | null
  entities: Map<string, EntityRegistryEntry>
  areas: Map<string, AreaEntry>
  labels: Map<string, LabelEntry>
  exposure: ExposureMap
  refresh: () => void
}

const Ctx = createContext<RegistryState | null>(null)

async function fetchRegistries(conn: Connection) {
  const [entities, areas, labels] = await Promise.all([
    conn.sendMessagePromise<EntityRegistryEntry[]>({
      type: "config/entity_registry/list",
    }),
    conn.sendMessagePromise<AreaEntry[]>({ type: "config/area_registry/list" }),
    conn.sendMessagePromise<LabelEntry[]>({ type: "config/label_registry/list" }),
  ])

  let exposure: ExposureMap
  try {
    const reply = await conn.sendMessagePromise<ExposureReply>({
      type: "homeassistant/expose_entity/list",
    })
    exposure = reply?.exposed_entities ?? {}
  } catch {
    // Older HA cores lack this WS command. Treat as no exposure info.
    exposure = {}
  }

  return { entities, areas, labels, exposure }
}

export function RegistryProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<RegistryStatus>("loading")
  const [error, setError] = useState<string | null>(null)
  const [entities, setEntities] = useState<Map<string, EntityRegistryEntry>>(new Map())
  const [areas, setAreas] = useState<Map<string, AreaEntry>>(new Map())
  const [labels, setLabels] = useState<Map<string, LabelEntry>>(new Map())
  const [exposure, setExposure] = useState<ExposureMap>({})
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    connectHA()
      .then(async (conn) => {
        const data = await fetchRegistries(conn)
        if (cancelled) return
        setEntities(new Map(data.entities.map((e) => [e.entity_id, e])))
        setAreas(new Map(data.areas.map((a) => [a.area_id, a])))
        setLabels(new Map(data.labels.map((l) => [l.label_id, l])))
        setExposure(data.exposure)
        setStatus("ready")
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const value = useMemo<RegistryState>(
    () => ({ status, error, entities, areas, labels, exposure, refresh }),
    [status, error, entities, areas, labels, exposure, refresh]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function useRegistry(): RegistryState {
  const v = useContext(Ctx)
  if (!v) throw new Error("useRegistry must be used inside <RegistryProvider>")
  return v
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryStatus(): RegistryStatus {
  return useRegistry().status
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryError(): string | null {
  return useRegistry().error
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryRefresh(): () => void {
  return useRegistry().refresh
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryEntities(): Set<string> {
  const { entities } = useRegistry()
  return useMemo(() => new Set(entities.keys()), [entities])
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistryEntry(entityId: string | undefined): RegistryEntry | null {
  const { entities, areas, labels, exposure } = useRegistry()
  if (!entityId) return null
  const raw = entities.get(entityId)
  if (!raw) {
    return {
      entityId,
      areaName: null,
      enabled: true,
      visible: true,
      labels: [],
      exposure: exposure[entityId] ?? {},
      platform: null,
      inRegistry: false,
    }
  }
  const areaName = raw.area_id ? (areas.get(raw.area_id)?.name ?? null) : null
  const resolvedLabels = raw.labels
    .map((id) => labels.get(id)?.name)
    .filter((n): n is string => Boolean(n))
  return {
    entityId,
    areaName,
    enabled: raw.disabled_by === null,
    visible: raw.hidden_by === null,
    labels: resolvedLabels,
    exposure: exposure[entityId] ?? {},
    platform: raw.platform,
    inRegistry: true,
  }
}
