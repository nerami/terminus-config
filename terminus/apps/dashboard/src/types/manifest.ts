export type AreaId = "mb" | "lr" | "abi" | "common" | "system"

export type NodeKind = "automation" | "script" | "scene" | "entity" | "template"

export type EdgeKind =
  | "trigger"
  | "condition"
  | "action"
  | "script_call"
  | "scene_call"
  | "template"

export type GraphNode = {
  id: string
  kind: NodeKind
  label: string
  area: AreaId
  source: { file: string; line: number }
  position: { x: number; y: number }
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  kind: EdgeKind
}

export type AutomationDetail = {
  id: string
  alias: string
  mode: "single" | "restart" | "queued" | "parallel"
  triggers: unknown[]
  conditions: unknown[]
  actions: unknown[]
  flowNodes: GraphNode[]
  flowEdges: GraphEdge[]
}

export type Manifest = {
  version: 1
  generatedAt: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  automations: Record<string, AutomationDetail>
}
