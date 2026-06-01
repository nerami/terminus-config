import path from "node:path"
import { readFile } from "node:fs/promises"
import fg from "fast-glob"
import { parseDocument, type Document } from "yaml"
// @ts-expect-error — @dagrejs/dagre ships types but they may not resolve in all setups
import dagre from "@dagrejs/dagre"

import type { AutomationDetail, GraphEdge, GraphNode, Manifest } from "./src/types/manifest"
import { inferArea } from "./src/lib/area"

function layout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  opts: { rankdir: "LR" | "TB"; nodeWidth: number; nodeHeight: number }
): GraphNode[] {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: opts.rankdir, nodesep: 40, ranksep: 80, marginx: 20, marginy: 20 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const n of nodes) {
    g.setNode(n.id, { width: opts.nodeWidth, height: opts.nodeHeight })
  }
  for (const e of edges) {
    g.setEdge(e.source, e.target)
  }
  dagre.layout(g)

  return nodes.map((n) => {
    const out = g.node(n.id)
    return { ...n, position: { x: out.x - opts.nodeWidth / 2, y: out.y - opts.nodeHeight / 2 } }
  })
}

type RawAutomation = {
  id: string
  alias?: string
  mode?: AutomationDetail["mode"]
  trigger?: unknown
  condition?: unknown
  action?: unknown
  __sourceFile: string
  __sourceLine: number
}

type RawScript = {
  slug: string
  alias?: string
  sequence?: unknown
  __sourceFile: string
  __sourceLine: number
}

type RawScene = {
  id: string
  name?: string
  entities?: Record<string, unknown>
  __sourceFile: string
  __sourceLine: number
}

type Parsed = {
  automations: RawAutomation[]
  scripts: RawScript[]
  scenes: RawScene[]
}

async function readYaml(file: string): Promise<Document> {
  const text = await readFile(file, "utf8")
  return parseDocument(text, { keepSourceTokens: true })
}

function lineOf(doc: Document, nodePath: ReadonlyArray<string | number>): number {
  const node = doc.getIn(nodePath, true)
  if (node && typeof node === "object" && "range" in node && Array.isArray((node as { range?: unknown }).range)) {
    const range = (node as { range: [number, number, number] }).range
    const src = doc.toString()
    const offset = range[0]
    return src.slice(0, offset).split("\n").length
  }
  return 1
}

async function collectFromFile(file: string, rel: string): Promise<Parsed> {
  const doc = await readYaml(file)
  const root = doc.toJSON()
  const out: Parsed = { automations: [], scripts: [], scenes: [] }

  if (Array.isArray(root) && rel.endsWith("automations.yaml")) {
    root.forEach((a: RawAutomation, i: number) => {
      if (a && typeof a === "object" && a.id) {
        out.automations.push({ ...a, __sourceFile: rel, __sourceLine: lineOf(doc, [i]) })
      }
    })
  } else if (Array.isArray(root) && rel.endsWith("scenes.yaml")) {
    root.forEach((s: RawScene, i: number) => {
      if (s && typeof s === "object" && s.id) {
        out.scenes.push({ ...s, __sourceFile: rel, __sourceLine: lineOf(doc, [i]) })
      }
    })
  } else if (root && typeof root === "object" && rel.endsWith("scripts.yaml")) {
    Object.entries(root as Record<string, RawScript>).forEach(([slug, body]) => {
      out.scripts.push({
        ...(body as RawScript),
        slug,
        __sourceFile: rel,
        __sourceLine: lineOf(doc, [slug]),
      })
    })
  } else if (root && typeof root === "object") {
    const r = root as { automation?: RawAutomation[]; script?: Record<string, RawScript>; scene?: RawScene[] }
    if (Array.isArray(r.automation)) {
      r.automation.forEach((a, i) => {
        if (a && a.id) {
          out.automations.push({ ...a, __sourceFile: rel, __sourceLine: lineOf(doc, ["automation", i]) })
        }
      })
    }
    if (r.script && typeof r.script === "object") {
      Object.entries(r.script).forEach(([slug, body]) => {
        out.scripts.push({
          ...(body as RawScript),
          slug,
          __sourceFile: rel,
          __sourceLine: lineOf(doc, ["script", slug]),
        })
      })
    }
    if (Array.isArray(r.scene)) {
      r.scene.forEach((s, i) => {
        if (s && s.id) {
          out.scenes.push({ ...s, __sourceFile: rel, __sourceLine: lineOf(doc, ["scene", i]) })
        }
      })
    }
  }

  return out
}

async function discoverAndParse(repoRoot: string): Promise<Parsed> {
  const files = await fg(
    ["packages/*.yaml", "automations.yaml", "scripts.yaml", "scenes.yaml"],
    { cwd: repoRoot, absolute: true }
  )

  const merged: Parsed = { automations: [], scripts: [], scenes: [] }
  for (const file of files) {
    const rel = path.relative(repoRoot, file)
    try {
      const p = await collectFromFile(file, rel)
      merged.automations.push(...p.automations)
      merged.scripts.push(...p.scripts)
      merged.scenes.push(...p.scenes)
    } catch (err) {
      console.error(`[graph plugin] failed to parse ${rel}:`, err)
      throw err
    }
  }
  return merged
}

// ---------------------------------------------------------------------------
// Ref walker helpers
// ---------------------------------------------------------------------------

const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/
const JINJA_RE = /\{\{[\s\S]*?\}\}/

type Ref = { kind: "entity"; id: string } | { kind: "template" }

function refsFromValue(v: unknown): Ref[] {
  if (v == null) return []
  if (typeof v === "string") {
    if (JINJA_RE.test(v)) return [{ kind: "template" }]
    if (ENTITY_ID_RE.test(v)) return [{ kind: "entity", id: v }]
    return []
  }
  if (Array.isArray(v)) return v.flatMap(refsFromValue)
  return []
}

// Services whose target.entity_id is handled as a special edge kind (scene_call, script_call)
// and should NOT be collected as plain entity action refs.
function isSpecialServiceCall(obj: Record<string, unknown>): boolean {
  const svc = typeof obj.service === "string" ? obj.service : undefined
  if (!svc) return false
  return svc === "scene.turn_on" || svc.startsWith("script.")
}

function collectEntityRefs(node: unknown, keys: ReadonlySet<string>): Ref[] {
  const out: Ref[] = []
  function walk(n: unknown) {
    if (n == null || typeof n !== "object") return
    if (Array.isArray(n)) {
      n.forEach(walk)
      return
    }
    const obj = n as Record<string, unknown>
    // If this action object is a special service call, skip its target.entity_id
    // (it will be handled as scene_call/script_call instead)
    const skipTarget = isSpecialServiceCall(obj)
    for (const [k, v] of Object.entries(obj)) {
      if (keys.has(k)) {
        out.push(...refsFromValue(v))
      } else if (k === "target" && v && typeof v === "object" && !Array.isArray(v)) {
        // handle target: { entity_id: "..." } — collect here and skip recursing into target
        // to avoid double-counting entity_id found inside target
        if (!skipTarget) {
          const t = v as Record<string, unknown>
          out.push(...refsFromValue(t.entity_id))
        }
        // intentionally NOT calling walk(v) here to avoid double-counting
        continue
      } else {
        walk(v)
      }
    }
  }
  walk(node)
  return out
}

const TRIGGER_KEYS = new Set(["entity_id"])
const CONDITION_KEYS = new Set(["entity_id"])
const ACTION_KEYS = new Set(["entity_id"])

type ServiceCall = { kind: "script_call" | "scene_call"; targetId: string }

function serviceCallsFromAction(action: unknown): ServiceCall[] {
  const out: ServiceCall[] = []
  function walk(a: unknown) {
    if (a == null || typeof a !== "object") return
    if (Array.isArray(a)) {
      a.forEach(walk)
      return
    }
    const obj = a as Record<string, unknown>
    const svc = typeof obj.service === "string" ? obj.service : undefined
    if (svc && svc.startsWith("script.")) {
      out.push({ kind: "script_call", targetId: `script:${svc.slice("script.".length)}` })
    }
    if (svc === "scene.turn_on") {
      const tgt = (obj.target as { entity_id?: unknown } | undefined)?.entity_id
      const ids = Array.isArray(tgt) ? tgt : tgt ? [tgt] : []
      for (const id of ids) {
        if (typeof id === "string" && id.startsWith("scene.")) {
          out.push({ kind: "scene_call", targetId: `scene:${id}` })
        }
      }
    }
    for (const v of Object.values(obj)) walk(v)
  }
  walk(action)
  return out
}

function toArr(v: unknown): unknown[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

// Deduplicate refs by their string key to avoid emitting duplicate edges
function dedupeRefs(refs: Ref[]): Ref[] {
  const seen = new Set<string>()
  return refs.filter((r) => {
    const key = r.kind === "entity" ? `entity:${r.id}` : `template`
    if (seen.has(key)) return false
    // For templates, allow multiple (each gets a unique node); for entities, dedupe
    if (r.kind === "entity") seen.add(key)
    return true
  })
}

// ---------------------------------------------------------------------------

export async function buildManifest(repoRoot: string): Promise<Manifest> {
  const parsed = await discoverAndParse(repoRoot)

  const nodes: GraphNode[] = []

  for (const a of parsed.automations) {
    nodes.push({
      id: `auto:${a.id}`,
      kind: "automation",
      label: a.alias ?? a.id,
      area: inferArea(a.id),
      source: { file: a.__sourceFile, line: a.__sourceLine },
      position: { x: 0, y: 0 },
    })
  }
  for (const s of parsed.scripts) {
    nodes.push({
      id: `script:${s.slug}`,
      kind: "script",
      label: s.alias ?? s.slug,
      area: inferArea(s.slug),
      source: { file: s.__sourceFile, line: s.__sourceLine },
      position: { x: 0, y: 0 },
    })
  }
  for (const sc of parsed.scenes) {
    nodes.push({
      id: `scene:${sc.id}`,
      kind: "scene",
      label: sc.name ?? sc.id,
      area: inferArea(sc.id),
      source: { file: sc.__sourceFile, line: sc.__sourceLine },
      position: { x: 0, y: 0 },
    })
  }

  const edges: GraphEdge[] = []
  const automations: Record<string, AutomationDetail> = {}
  const entityNodeIds = new Set<string>()
  let templateCounter = 0

  function ensureEntityNode(id: string, file: string, line: number) {
    if (entityNodeIds.has(id)) return
    entityNodeIds.add(id)
    nodes.push({
      id,
      kind: "entity",
      label: id.split(".").slice(-1)[0],
      area: inferArea(id),
      source: { file, line },
      position: { x: 0, y: 0 },
    })
  }

  function ensureTemplateNode(file: string, line: number): string {
    const id = `template:${++templateCounter}`
    nodes.push({
      id,
      kind: "template",
      label: "templated",
      area: "common",
      source: { file, line },
      position: { x: 0, y: 0 },
    })
    return id
  }

  for (const a of parsed.automations) {
    const autoId = `auto:${a.id}`

    const triggerRefs = dedupeRefs(collectEntityRefs(a.trigger, TRIGGER_KEYS))
    for (const r of triggerRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::t::${r.id}`, source: r.id, target: autoId, kind: "trigger" })
      } else {
        const tid = ensureTemplateNode(a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::t::${tid}`, source: tid, target: autoId, kind: "template" })
      }
    }

    const conditionRefs = dedupeRefs(collectEntityRefs(a.condition, CONDITION_KEYS))
    for (const r of conditionRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::c::${r.id}`, source: r.id, target: autoId, kind: "condition" })
      } else {
        const tid = ensureTemplateNode(a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::c::${tid}`, source: tid, target: autoId, kind: "template" })
      }
    }

    const actionRefs = dedupeRefs(collectEntityRefs(a.action, ACTION_KEYS))
    for (const r of actionRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::a::${r.id}`, source: autoId, target: r.id, kind: "action" })
      } else {
        const tid = ensureTemplateNode(a.__sourceFile, a.__sourceLine)
        edges.push({ id: `${autoId}::a::${tid}`, source: autoId, target: tid, kind: "template" })
      }
    }

    for (const sc of serviceCallsFromAction(a.action)) {
      edges.push({
        id: `${autoId}::${sc.kind}::${sc.targetId}`,
        source: autoId,
        target: sc.targetId,
        kind: sc.kind,
      })
    }

    const flowNodes: GraphNode[] = []
    const flowEdges: GraphEdge[] = []
    const rootId = `${autoId}::root`
    flowNodes.push({
      id: rootId,
      kind: "automation",
      label: a.alias ?? a.id,
      area: inferArea(a.id),
      source: { file: a.__sourceFile, line: a.__sourceLine },
      position: { x: 0, y: 0 },
    })

    function addFlow(kind: "trigger" | "condition" | "action", ref: Ref, idx: number) {
      const nid =
        ref.kind === "entity"
          ? `${rootId}::${kind}::${ref.id}::${idx}`
          : `${rootId}::${kind}::tmpl::${idx}`
      const label = ref.kind === "entity" ? ref.id : "templated"
      flowNodes.push({
        id: nid,
        kind: ref.kind === "template" ? "template" : "entity",
        label,
        area: ref.kind === "entity" ? inferArea(ref.id) : "common",
        source: { file: a.__sourceFile, line: a.__sourceLine },
        position: { x: 0, y: 0 },
      })
      if (kind === "action") {
        flowEdges.push({ id: `${nid}::edge`, source: rootId, target: nid, kind })
      } else {
        flowEdges.push({ id: `${nid}::edge`, source: nid, target: rootId, kind })
      }
    }

    triggerRefs.forEach((r, i) => addFlow("trigger", r, i))
    conditionRefs.forEach((r, i) => addFlow("condition", r, i))
    actionRefs.forEach((r, i) => addFlow("action", r, i))

    const laidFlow = layout(flowNodes, flowEdges, { rankdir: "TB", nodeWidth: 200, nodeHeight: 56 })

    automations[a.id] = {
      id: a.id,
      alias: a.alias ?? a.id,
      mode: a.mode ?? "single",
      triggers: toArr(a.trigger),
      conditions: toArr(a.condition),
      actions: toArr(a.action),
      flowNodes: laidFlow,
      flowEdges,
    }
  }

  for (const s of parsed.scripts) {
    const scriptId = `script:${s.slug}`
    const actionRefs = dedupeRefs(collectEntityRefs(s.sequence, ACTION_KEYS))
    for (const r of actionRefs) {
      if (r.kind === "entity") {
        ensureEntityNode(r.id, s.__sourceFile, s.__sourceLine)
        edges.push({
          id: `${scriptId}::a::${r.id}`,
          source: scriptId,
          target: r.id,
          kind: "action",
        })
      }
    }
  }

  const laid = layout(nodes, edges, { rankdir: "LR", nodeWidth: 220, nodeHeight: 56 })
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    nodes: laid,
    edges,
    automations,
  }
}
