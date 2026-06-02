import { tool } from "@langchain/core/tools"
import { z } from "zod"

function haFetch(path: string, init?: RequestInit) {
  const server = process.env.HASS_SERVER
  const token = process.env.HASS_TOKEN
  if (!server || !token) throw new Error("HASS_SERVER or HASS_TOKEN not set")
  return fetch(`${server}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
}

const listEntities = tool(
  async ({ domain }) => {
    const res = await haFetch("/api/states")
    if (!res.ok) throw new Error(`HA API error: ${res.status}`)
    const states = (await res.json()) as Array<{ entity_id: string; state: string; attributes: Record<string, unknown> }>
    const filtered = domain ? states.filter((s) => s.entity_id.startsWith(`${domain}.`)) : states
    return JSON.stringify(
      filtered.map((s) => ({ entity_id: s.entity_id, state: s.state, attributes: s.attributes })),
      null,
      2,
    )
  },
  {
    name: "ha_list_entities",
    description:
      "List Home Assistant entity states. Optionally filter by domain (e.g. 'light', 'switch', 'automation'). Returns entity_id, state, and attributes.",
    schema: z.object({ domain: z.string().optional().describe("HA domain to filter by") }),
  },
)

const getEntity = tool(
  async ({ entity_id }) => {
    const res = await haFetch(`/api/states/${entity_id}`)
    if (!res.ok) throw new Error(`HA API error: ${res.status} for ${entity_id}`)
    return JSON.stringify(await res.json(), null, 2)
  },
  {
    name: "ha_get_entity",
    description: "Get the current state and attributes of a specific Home Assistant entity.",
    schema: z.object({ entity_id: z.string().describe("Full entity ID e.g. light.lr_lamp") }),
  },
)

const callService = tool(
  async ({ domain, service, data }) => {
    const res = await haFetch(`/api/services/${domain}/${service}`, {
      method: "POST",
      body: JSON.stringify(data ?? {}),
    })
    if (!res.ok) throw new Error(`HA service call failed: ${res.status}`)
    const result = await res.json()
    return JSON.stringify(result, null, 2)
  },
  {
    name: "ha_call_service",
    description: "Call a Home Assistant service. E.g. domain=light, service=turn_on, data={entity_id, brightness_pct}.",
    schema: z.object({
      domain: z.string().describe("Service domain e.g. 'light'"),
      service: z.string().describe("Service name e.g. 'turn_on'"),
      data: z.record(z.unknown()).optional().describe("Service call data payload"),
    }),
  },
)

const renderTemplate = tool(
  async ({ template }) => {
    const res = await haFetch("/api/template", {
      method: "POST",
      body: JSON.stringify({ template }),
    })
    if (!res.ok) throw new Error(`Template render failed: ${res.status}`)
    return await res.text()
  },
  {
    name: "ha_render_template",
    description: "Render a Jinja2 template against live HA state. Useful for testing template conditions.",
    schema: z.object({ template: z.string().describe("Jinja2 template string") }),
  },
)

export const haApiTools = [listEntities, getEntity, callService, renderTemplate]
