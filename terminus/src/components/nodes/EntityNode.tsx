import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { useEntityState } from "@/lib/liveState"
import type { AreaId } from "@/types/manifest"

const AREA_BORDER: Record<AreaId, string> = {
  mb: "border-l-teal-500",
  lr: "border-l-amber-500",
  abi: "border-l-violet-500",
  common: "border-l-slate-500",
  system: "border-l-slate-500",
}

export type EntityNodeData = {
  entityId: string
  label: string
  area: AreaId
}

export function EntityNode({ data }: NodeProps<EntityNodeData>) {
  const state = useEntityState(data.entityId)
  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs border-l-4 ${AREA_BORDER[data.area]}`}
    >
      <Handle type="target" position={Position.Left} />
      <span className="font-mono">{data.entityId}</span>
      {state && (
        <Badge variant="secondary" className="font-mono text-[10px]">
          {state}
        </Badge>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
