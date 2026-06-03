import type { NodeTypes } from "@xyflow/react"
import { AutomationNode } from "./automation-node"
import { EntityNode } from "./entity-node"
import { ScriptNode } from "./script-node"
import { SceneNode } from "./scene-node"

export const nodeTypes: NodeTypes = {
  automation: AutomationNode,
  entity: EntityNode,
  script: ScriptNode,
  scene: SceneNode,
  // template uses the entity renderer (it's just a placeholder pill).
  template: EntityNode,
}
