import type { Manifest } from "@/types/manifest"

let cached: Promise<Manifest> | null = null

export function loadManifest(): Promise<Manifest> {
  if (cached) return cached
  const url = "/local/terminus/graph.json" + (import.meta.env.DEV ? `?t=${Date.now()}` : "")
  cached = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`graph.json: HTTP ${r.status}`)
    return r.json() as Promise<Manifest>
  })
  return cached
}

// Test-only reset hook.
export function __resetManifestCache() {
  cached = null
}
