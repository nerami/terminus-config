import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { ScrollText } from "lucide-react"
import type { AreaId } from "@/types/manifest"

export type ScriptNodeData = Node<{ label: string; area: AreaId; direction?: "LR" | "TB" }, "script">

export function ScriptNode({ data }: NodeProps<ScriptNodeData>) {
  const vertical = data.direction === "TB"
  const targetPos = vertical ? Position.Top : Position.Left
  const sourcePos = vertical ? Position.Bottom : Position.Right
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed bg-card px-3 py-2 text-sm">
      <Handle type="target" position={targetPos} />
      <ScrollText className="size-4" />
      <span>{data.label}</span>
      <Handle type="source" position={sourcePos} />
    </div>
  )
}
