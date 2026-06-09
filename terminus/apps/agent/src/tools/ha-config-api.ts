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

const get = tool(
  async ({ domain, id }: { domain: Domain; id: string }) => {
    const res = await haFetch(`/api/config/${domain}/config/${encodeURIComponent(id)}`)
    if (!res.ok) {
      if (res.status === 404) {
        return JSON.stringify({
          error: "not editable / not found — likely packages-managed; check ha_read_manifest",
          status: 404,
        })
      }
      return JSON.stringify({ error: res.error, status: res.status })
    }
    return JSON.stringify(res.data, null, 2)
  },
  {
    name: "ha_config_get",
    description:
      "Read the editable config of one automation, scene, or script by id (for scripts, id is the object_id). Returns the full config object. A 404 means the entity is not editable via these tools (hand-authored in the repo) — do not retry; treat it as packages-managed.",
    schema: z.object({ domain: domainSchema, id: z.string() }),
  },
)

const upsert = tool(
  async ({ domain, id, config }: { domain: Domain; id?: string; config: Record<string, unknown> }) => {
    const finalId = id ?? String(Date.now())
    const res = await haFetch(`/api/config/${domain}/config/${encodeURIComponent(finalId)}`, {
      method: "POST",
      body: JSON.stringify(config),
    })
    if (!res.ok) {
      return JSON.stringify({
        error: res.error,
        status: res.status,
        ...(res.status === 400 ? { hint: "Home Assistant rejected the config — fix it and retry." } : {}),
      })
    }
    return JSON.stringify({ result: "ok", id: finalId, domain })
  },
  {
    name: "ha_config_upsert",
    description:
      "Create or overwrite an automation, scene, or script. Omit id to create (a fresh id is generated and returned); pass an existing id to overwrite. For scripts, id is the object_id (a slug). config is the full Home Assistant config object for that domain (e.g. an automation's alias/trigger/condition/action/mode). Home Assistant validates it; a 400 returns the validation error to fix. The change auto-reloads. NEVER overwrite an entity whose packages_managed is true. Before overwriting an existing entity, show the user the config and get confirmation.",
    schema: z.object({
      domain: domainSchema,
      id: z.string().optional(),
      config: z.record(z.any()),
    }),
  },
)

export const haConfigTools = [list, get, upsert]
