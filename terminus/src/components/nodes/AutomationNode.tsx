import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { useAutomationEnabled } from "@/lib/liveState"
import { navigate } from "@/lib/router"
import type { AreaId } from "@/types/manifest"

const AREA_BORDER: Record<AreaId, string> = {
  mb: "border-l-teal-500",
  lr: "border-l-amber-500",
  abi: "border-l-violet-500",
  common: "border-l-slate-500",
  system: "border-l-slate-500",
}

export type AutomationNodeData = {
  autoId: string
  label: string
  area: AreaId
  mode: "single" | "restart" | "queued" | "parallel"
}

export function AutomationNode({ data }: NodeProps<AutomationNodeData>) {
  const enabled = useAutomationEnabled(data.autoId)
  const border = AREA_BORDER[data.area]

  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-card-foreground shadow-sm border-l-4 ${border} cursor-pointer hover:bg-accent`}
      onClick={() => navigate({ name: "auto", id: data.autoId })}
    >
      <Handle type="target" position={Position.Left} />
      <span className="text-sm font-medium">{data.label}</span>
      <Badge variant={enabled ? "default" : "secondary"} className="text-[10px]">
        {enabled ? "on" : "off"}
      </Badge>
      {data.mode !== "single" && (
        <Badge variant="outline" className="text-[10px]">
          {data.mode}
        </Badge>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
