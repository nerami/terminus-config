import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { useNavigate } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { useAutomationEnabled } from "@/lib/live-state"
import type { AreaId } from "@/types/manifest"

const AREA_BORDER: Record<AreaId, string> = {
  mb: "border-l-teal-500",
  lr: "border-l-amber-500",
  abi: "border-l-violet-500",
  common: "border-l-slate-500",
  system: "border-l-slate-500",
}

export type AutomationNodeData = Node<
  {
    autoId: string
    label: string
    area: AreaId
    mode: "single" | "restart" | "queued" | "parallel"
    direction?: "LR" | "TB"
  },
  "automation"
>

export function AutomationNode({ data }: NodeProps<AutomationNodeData>) {
  const enabled = useAutomationEnabled(data.autoId)
  const border = AREA_BORDER[data.area]
  const vertical = data.direction === "TB"
  const targetPos = vertical ? Position.Top : Position.Left
  const sourcePos = vertical ? Position.Bottom : Position.Right
  const navigate = useNavigate()

  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-card-foreground shadow-sm border-l-4 ${border} cursor-pointer hover:bg-accent`}
      onClick={() => navigate({ to: "/auto/$autoId", params: { autoId: data.autoId } })}
    >
      <Handle type="target" position={targetPos} />
      <span className="text-sm font-medium">{data.label}</span>
      <Badge variant={enabled ? "default" : "secondary"} className="text-[10px]">
        {enabled ? "on" : "off"}
      </Badge>
      {data.mode !== "single" && (
        <Badge variant="outline" className="text-[10px]">
          {data.mode}
        </Badge>
      )}
      <Handle type="source" position={sourcePos} />
    </div>
  )
}
