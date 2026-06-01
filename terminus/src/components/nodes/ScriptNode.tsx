import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { ScrollText } from "lucide-react"
import type { AreaId } from "@/types/manifest"

export type ScriptNodeData = Node<{ label: string; area: AreaId }, "script">

export function ScriptNode({ data }: NodeProps<ScriptNodeData>) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed bg-card px-3 py-2 text-sm">
      <Handle type="target" position={Position.Left} />
      <ScrollText className="size-4" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
