import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { useEntityState } from "@/lib/live-state"
import type { AreaId } from "@/types/manifest"

const AREA_BORDER: Record<AreaId, string> = {
  mb: "border-l-teal-500",
  lr: "border-l-amber-500",
  abi: "border-l-violet-500",
  common: "border-l-slate-500",
  system: "border-l-slate-500",
}

export type EntityNodeData = Node<
  {
    entityId: string
    label: string
    area: AreaId
    direction?: "LR" | "TB"
  },
  "entity"
>

export function EntityNode({ data }: NodeProps<EntityNodeData>) {
  const state = useEntityState(data.entityId)
  const vertical = data.direction === "TB"
  const targetPos = vertical ? Position.Top : Position.Left
  const sourcePos = vertical ? Position.Bottom : Position.Right
  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs border-l-4 ${AREA_BORDER[data.area]}`}
    >
      <Handle type="target" position={targetPos} />
      <span className="font-mono">{data.entityId}</span>
      {state && (
        <Badge variant="secondary" className="font-mono text-[10px]">
          {state}
        </Badge>
      )}
      <Handle type="source" position={sourcePos} />
    </div>
  )
}
