import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { buildManifest } from "@terminus/manifest"
import { join } from "node:path"

function repoRoot(): string {
  return process.env.REPO_ROOT ?? join(process.cwd(), "..")
}

const readManifest = tool(
  async () => {
    const manifest = await buildManifest(repoRoot())
    const summary = {
      automations: Object.values(manifest.automations).map((a) => ({
        id: a.id,
        alias: a.alias,
        mode: a.mode,
        source: manifest.nodes.find((n) => n.id === `auto:${a.id}`)?.source,
        triggers: a.triggers,
        conditions: a.conditions,
        actions: a.actions,
      })),
      scenes: manifest.nodes
        .filter((n) => n.kind === "scene")
        .map((n) => ({ id: n.id, label: n.label, area: n.area, source: n.source })),
      entities: manifest.nodes
        .filter((n) => n.kind === "entity")
        .map((n) => ({ id: n.id, label: n.label, area: n.area })),
    }
    return JSON.stringify(summary, null, 2)
  },
  {
    name: "ha_read_manifest",
    description:
      "Read the HA config manifest: all automations (with full triggers/conditions/actions YAML), scenes, and referenced entities. Use this before editing config to understand what exists and how it's structured. Includes source file + line for each automation so you know exactly where to edit.",
    schema: z.object({}),
  },
)

export const haManifestTools = [readManifest]
