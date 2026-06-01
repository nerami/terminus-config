import { dump as yamlDump } from "js-yaml"

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function hash6(input: string): string {
  // FNV-1a 32-bit → base36, padded
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36).padStart(6, "0").slice(-6)
}

export function generateAutomationId(alias: string): string {
  const slug = slugify(alias) || "automation"
  return `${slug}_${hash6(alias)}`
}

export type AutomationProposal = {
  alias: string
  description?: string
  mode: "single" | "restart" | "queued" | "parallel"
  triggers: unknown[]
  conditions: unknown[]
  actions: unknown[]
}

export type ValidateError =
  | { kind: "missing_field"; detail: string }
  | { kind: "unknown_entity"; detail: string }
  | { kind: "yaml_parse"; detail: string }
  | { kind: "id_conflict"; detail: string }
  | { kind: "ha_rest"; detail: string }

export type ValidateResult =
  | { ok: true }
  | { ok: false; error: ValidateError }

const ENTITY_ID_RE = /\b([a-z_]+)\.[a-z0-9_]+\b/g
const ENTITY_ID_KEYS = new Set(["entity_id", "entity_ids"])

function collectEntityIds(node: unknown, out: Set<string>, inEntityIdKey = false): void {
  if (typeof node === "string") {
    if (inEntityIdKey) {
      for (const match of node.matchAll(ENTITY_ID_RE)) out.add(match[0])
    }
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) collectEntityIds(item, out, inEntityIdKey)
    return
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      collectEntityIds(value, out, ENTITY_ID_KEYS.has(key))
    }
  }
}

export function validateAutomation(
  proposal: AutomationProposal,
  knownEntityIds: Set<string>
): ValidateResult {
  if (!proposal.alias?.trim()) {
    return { ok: false, error: { kind: "missing_field", detail: "alias" } }
  }
  const refs = new Set<string>()
  collectEntityIds(proposal.triggers, refs)
  collectEntityIds(proposal.conditions, refs)
  collectEntityIds(proposal.actions, refs)
  for (const ref of refs) {
    if (!knownEntityIds.has(ref)) {
      return { ok: false, error: { kind: "unknown_entity", detail: ref } }
    }
  }
  return { ok: true }
}

export type CommitOptions = {
  fetch: typeof fetch
  token: string
  baseUrl?: string
}

export type CommitResult =
  | { ok: true; id: string }
  | { ok: false; error: ValidateError }

export async function commitAutomation(
  proposal: AutomationProposal,
  knownEntityIds: Set<string>,
  { fetch, token, baseUrl = "" }: CommitOptions
): Promise<CommitResult> {
  const validated = validateAutomation(proposal, knownEntityIds)
  if (!validated.ok) return validated

  const id = generateAutomationId(proposal.alias)
  const configPath = `${baseUrl}/api/config/automation/config/${id}`
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const existing = await fetch(configPath, { method: "GET", headers })
  if (existing.status === 200) {
    return { ok: false, error: { kind: "id_conflict", detail: id } }
  }

  let body: string
  try {
    const yamlObj = {
      id,
      alias: proposal.alias,
      description: proposal.description ?? "",
      mode: proposal.mode,
      triggers: proposal.triggers,
      conditions: proposal.conditions,
      actions: proposal.actions,
    }
    body = JSON.stringify(yamlObj)
  } catch (e) {
    return {
      ok: false,
      error: { kind: "yaml_parse", detail: e instanceof Error ? e.message : String(e) },
    }
  }

  const write = await fetch(configPath, { method: "POST", headers, body })
  if (write.status >= 300) {
    return {
      ok: false,
      error: { kind: "ha_rest", detail: `POST automation/config: ${write.status}` },
    }
  }

  const reload = await fetch(`${baseUrl}/api/services/automation/reload`, {
    method: "POST",
    headers,
    body: "{}",
  })
  if (reload.status >= 300) {
    return {
      ok: false,
      error: { kind: "ha_rest", detail: `POST automation/reload: ${reload.status}` },
    }
  }

  return { ok: true, id }
}

export function serializeYamlPreview(proposal: AutomationProposal): string {
  const obj = {
    id: generateAutomationId(proposal.alias),
    alias: proposal.alias,
    description: proposal.description ?? "",
    mode: proposal.mode,
    triggers: proposal.triggers,
    conditions: proposal.conditions,
    actions: proposal.actions,
  }
  return yamlDump(obj, { lineWidth: 100, noRefs: true })
}
