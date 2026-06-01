import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { Sparkles } from "lucide-react"
import type { AreaId } from "@/types/manifest"

export type SceneNodeData = Node<{ label: string; area: AreaId }, "scene">

export function SceneNode({ data }: NodeProps<SceneNodeData>) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
      <Handle type="target" position={Position.Left} />
      <Sparkles className="size-4" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
