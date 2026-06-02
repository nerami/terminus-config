import path from "node:path"
import { writeFile, mkdir } from "node:fs/promises"
import type { Plugin } from "vite"

import { buildManifest } from "@terminus/manifest"

export { buildManifest }

export function graphManifestPlugin(opts?: { repoRoot?: string }): Plugin {
  const repoRoot = opts?.repoRoot ?? path.resolve(process.cwd(), "../../..")
  const publicDir = path.resolve(process.cwd(), "public")
  const target = path.join(publicDir, "graph.json")

  async function rebuild() {
    const manifest = await buildManifest(repoRoot)
    await mkdir(publicDir, { recursive: true })
    await writeFile(target, JSON.stringify(manifest, null, 2))
    return manifest
  }

  return {
    name: "terminus-graph-manifest",
    async buildStart() {
      const m = await rebuild()
      this.info(
        `graph.json: ${m.nodes.length} nodes, ${m.edges.length} edges, ${
          Object.keys(m.automations).length
        } automations`
      )
    },
    configureServer(server) {
      const watched = [
        path.join(repoRoot, "packages"),
        path.join(repoRoot, "automations.yaml"),
        path.join(repoRoot, "scripts.yaml"),
        path.join(repoRoot, "scenes.yaml"),
      ]
      for (const w of watched) server.watcher.add(w)
      server.watcher.on("change", async (file) => {
        if (!watched.some((w) => file === w || file.startsWith(w + path.sep))) return
        try {
          await rebuild()
          server.ws.send({ type: "full-reload" })
        } catch (err) {
          server.config.logger.error(`[graph plugin] rebuild failed: ${(err as Error).message}`)
        }
      })
    },
  }
}
