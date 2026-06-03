import { useCallback, useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { ReactFlow, Background, Controls, type Edge, type Node } from "@xyflow/react"
import type { GraphNode } from "@/types/manifest"
import { nodeTypes } from "@/components/nodes"
import { useTheme } from "@/components/theme-provider"
import { NodeDetailSheet } from "@/components/node-detail-sheet"

const Route = getRouteApi("/")

const EDGE_STYLE: Record<string, { stroke: string; strokeDasharray?: string }> = {
  trigger: { stroke: "var(--color-emerald-500)" },
  condition: { stroke: "var(--color-amber-500)", strokeDasharray: "4 4" },
  action: { stroke: "var(--color-sky-500)" },
  script_call: { stroke: "var(--color-fuchsia-500)" },
  scene_call: { stroke: "var(--color-pink-500)" },
  template: { stroke: "var(--color-zinc-500)", strokeDasharray: "2 2" },
}

export function SystemMap() {
  const { manifest } = Route.useRouteContext()
  const { theme } = useTheme()
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const nodes: Node[] = useMemo(
    () =>
      manifest.nodes.map((n) => {
        const data =
          n.kind === "automation"
            ? {
                autoId: n.id.replace(/^auto:/, ""),
                label: n.label,
                area: n.area,
                mode: manifest.automations[n.id.replace(/^auto:/, "")]?.mode ?? "single",
              }
            : n.kind === "entity" || n.kind === "template"
              ? { entityId: n.id, label: n.label, area: n.area }
              : { label: n.label, area: n.area }
        return {
          id: n.id,
          type: n.kind,
          position: n.position,
          data,
        }
      }),
    [manifest]
  )

  const edges: Edge[] = useMemo(
    () =>
      manifest.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        style: EDGE_STYLE[e.kind],
        animated: false,
      })),
    [manifest]
  )

  const byId = useMemo(() => {
    const m = new Map<string, GraphNode>()
    for (const n of manifest.nodes) m.set(n.id, n)
    return m
  }, [manifest])

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, n: Node) => {
      const graphNode = byId.get(n.id)
      if (!graphNode) return
      if (graphNode.kind === "automation") return // drill-in handled by AutomationNode itself
      setSelected(graphNode)
      setSheetOpen(true)
    },
    [byId]
  )

  return (
    <>
      <div className="h-[calc(100svh-4rem)] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          colorMode={theme}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <NodeDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} node={selected} />
    </>
  )
}
