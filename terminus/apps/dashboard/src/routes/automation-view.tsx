import { useCallback, useMemo, useState } from "react"
import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { ReactFlow, Background, Controls, type Edge, type Node } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { nodeTypes } from "@/components/nodes"
import { EmptyState } from "@/components/empty-state"
import { useTheme } from "@/components/theme-provider"
import { NodeDetailSheet } from "@/components/node-detail-sheet"
import type { GraphNode } from "@/types/manifest"

const Route = getRouteApi("/auto/$autoId")

export function AutomationView() {
  const { manifest } = Route.useRouteContext()
  const { autoId } = Route.useParams()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const detail = manifest.automations[autoId]
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [anchor, setAnchor] = useState<Element | null>(null)

  const byId = useMemo(() => {
    const m = new Map<string, GraphNode>()
    for (const n of detail?.flowNodes ?? []) m.set(n.id, n)
    return m
  }, [detail])

  const handleNodeClick = useCallback(
    (e: React.MouseEvent, n: Node) => {
      const graphNode = byId.get(n.id)
      if (!graphNode) return
      if (graphNode.kind === "automation") return
      setAnchor(e.currentTarget as Element)
      setSelected(graphNode)
      setPopoverOpen(true)
    },
    [byId]
  )

  const nodes = useMemo<Node[]>(() => {
    if (!detail) return []
    return detail.flowNodes.map((n) => ({
      id: n.id,
      type: n.kind === "automation" ? "automation" : n.kind === "template" ? "template" : "entity",
      position: n.position,
      data:
        n.kind === "automation"
          ? { autoId, label: n.label, area: n.area, mode: detail.mode, direction: "TB" as const }
          : { entityId: n.label, label: n.label, area: n.area, direction: "TB" as const },
    }))
  }, [detail, autoId])

  const edges = useMemo<Edge[]>(
    () =>
      detail?.flowEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })) ?? [],
    [detail]
  )

  if (!detail) {
    return (
      <EmptyState
        title={`Unknown automation: ${autoId}`}
        body="The manifest does not include this automation. Rebuild the panel and re-deploy."
      />
    )
  }

  return (
    <div className="flex h-[calc(100svh-4rem)] w-full">
      <div className="flex-1">
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
      <aside className="flex w-96 flex-col border-l">
        <div className="flex items-center justify-between border-b p-3">
          <div>
            <div className="text-sm font-medium">{detail.alias}</div>
            <div className="text-xs text-muted-foreground">mode: {detail.mode}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
            Back
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <Card className="m-3">
            <CardHeader>
              <CardTitle className="text-sm">Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(detail.triggers, null, 2)}
              </pre>
            </CardContent>
          </Card>
          <Card className="m-3">
            <CardHeader>
              <CardTitle className="text-sm">Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(detail.conditions, null, 2)}
              </pre>
            </CardContent>
          </Card>
          <Card className="m-3">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(detail.actions, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </ScrollArea>
      </aside>
    <NodeDetailSheet open={popoverOpen} onOpenChange={setPopoverOpen} node={selected} anchor={anchor} />
    </div>
  )
}
