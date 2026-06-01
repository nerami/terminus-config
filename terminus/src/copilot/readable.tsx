import { useCopilotReadable } from "@copilotkit/react-core"
import type { Manifest, GraphNode } from "@/types/manifest"

export type Catalog = {
  entities: string[]
  scenes: string[]
  scripts: string[]
  areas: Record<string, string>
  current_time: string
  user_location: string
}

const AREAS: Record<string, string> = {
  mb: "Master Bedroom",
  lr: "Living Room",
  abi: "Abi's room",
}
const USER_LOCATION = "Costa Rica, UTC-6, ~10°N (stable sun events; no DST)"

function isEntity(n: GraphNode): boolean { return n.kind === "entity" }
function isScene(n: GraphNode): boolean { return n.kind === "scene" }
function isScript(n: GraphNode): boolean { return n.kind === "script" }

function toLocalIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const tzMin = -d.getTimezoneOffset()
  const sign = tzMin >= 0 ? "+" : "-"
  const tzh = pad(Math.floor(Math.abs(tzMin) / 60))
  const tzm = pad(Math.abs(tzMin) % 60)
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `.${String(d.getMilliseconds()).padStart(3, "0")}${sign}${tzh}:${tzm}`
  )
}

export function buildCatalog({
  manifest,
  now,
}: {
  manifest: Manifest
  now: Date
}): Catalog {
  const nodes = manifest.nodes ?? []
  return {
    entities: nodes.filter(isEntity).map((n) => n.id),
    scenes: nodes.filter(isScene).map((n) => n.id),
    scripts: nodes.filter(isScript).map((n) => n.id),
    areas: { ...AREAS },
    current_time: toLocalIso(now),
    user_location: USER_LOCATION,
  }
}

export function CopilotCatalog({ manifest }: { manifest: Manifest }) {
  const catalog = buildCatalog({ manifest, now: new Date() })
  useCopilotReadable({
    description:
      "Home Assistant entity catalog. Use the exact entity_id strings here. " +
      "Areas map short prefixes (mb/lr/abi) to friendly names.",
    value: catalog,
  })
  return null
}
