import path from "node:path"
import { readFile } from "node:fs/promises"
import fg from "fast-glob"
import { parseDocument, type Document } from "yaml"

import type { AutomationDetail, GraphEdge, GraphNode, Manifest } from "./src/types/manifest"
import { inferArea } from "./src/lib/area"

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

export async function buildManifest(repoRoot: string): Promise<Manifest> {
  const parsed = await discoverAndParse(repoRoot)

  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

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

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
    automations: {},
  }
}
