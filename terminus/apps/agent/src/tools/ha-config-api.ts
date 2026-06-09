import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { join } from "node:path"
import { buildManifest } from "@terminus/manifest"
import { haFetch } from "../lib/ha-client.js"

const DOMAINS = ["automation", "scene", "script"] as const
const domainSchema = z.enum(DOMAINS)
type Domain = (typeof DOMAINS)[number]

function repoRoot(): string {
  return process.env.REPO_ROOT ?? join(process.cwd(), "..")
}

type HaState = { entity_id: string; state: string; attributes: Record<string, unknown> }

async function packageAutomationIds(): Promise<Set<string>> {
  try {
    const manifest = await buildManifest(repoRoot())
    return new Set(Object.values(manifest.automations).map((a) => String(a.id)))
  } catch {
    return new Set()
  }
}

const list = tool(
  async ({ domain }: { domain: Domain }) => {
    const res = await haFetch("/api/states")
    if (!res.ok) return JSON.stringify({ error: res.error, status: res.status })

    const states = res.data as HaState[]
    const prefix = `${domain}.`
    // packages_managed is reliable only for automations (manifest covers automation ids).
    // For scene/script it is best-effort false; a get/delete 404 is the authoritative signal.
    const pkgIds = domain === "automation" ? await packageAutomationIds() : new Set<string>()

    const rows = states
      .filter((s) => s.entity_id.startsWith(prefix))
      .map((s) => {
        const objectId = s.entity_id.slice(prefix.length)
        const id = domain === "script" ? objectId : (s.attributes.id as string | undefined) ?? null
        return {
          entity_id: s.entity_id,
          friendly_name: (s.attributes.friendly_name as string | undefined) ?? null,
          id,
          state: s.state,
          packages_managed: id != null && pkgIds.has(String(id)),
        }
      })

    return JSON.stringify(rows, null, 2)
  },
  {
    name: "ha_config_list",
    description:
      "List automations, scenes, or scripts currently in Home Assistant. Returns entity_id, friendly_name, id, state, and packages_managed (true = hand-authored in the repo and NOT editable via these tools). For scripts, id is the object_id (slug after 'script.'). Call this to resolve an id before get/upsert/delete.",
    schema: z.object({ domain: domainSchema }),
  },
)

export const haConfigTools = [list]
