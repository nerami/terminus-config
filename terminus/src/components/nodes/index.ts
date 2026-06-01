import type { NodeTypes } from "@xyflow/react"
import { AutomationNode } from "./AutomationNode"
import { EntityNode } from "./EntityNode"
import { ScriptNode } from "./ScriptNode"
import { SceneNode } from "./SceneNode"

export const nodeTypes: NodeTypes = {
  automation: AutomationNode,
  entity: EntityNode,
  script: ScriptNode,
  scene: SceneNode,
  // template uses the entity renderer (it's just a placeholder pill).
  template: EntityNode,
}
