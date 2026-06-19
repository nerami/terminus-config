// Mirrors the iframe SPA's location into the parent (Home Assistant) window's URL
// hash, and restores it on load. The add-on runs inside an ingress <iframe>;
// navigating the iframe never changes HA's address bar, and a full-page refresh
// makes HA rebuild the iframe at the ingress base URL — losing our state. Writing
// a token into the parent *hash* survives a reload, needs no HA-side routing, and
// doesn't reload HA. Only works when the iframe is same-origin with the parent
// (true for HA ingress); otherwise every entry point no-ops gracefully.

import { resolveBasePath } from "@/runtime-config"

const HASH_KEY = "app="

/**
 * The iframe location relative to the served base directory, as `path[?search]`.
 * The base case (pathname === basepath) normalises to "/".
 * e.g. ("/api/hassio_ingress/tok/c/abc", "?topology=1", "/api/hassio_ingress/tok/")
 *   -> "/c/abc?topology=1"
 */
export function relativeLocation(
  loc: { pathname: string; search: string },
  basepath: string,
): string {
  let rel = loc.pathname
  if (rel.startsWith(basepath)) rel = "/" + rel.slice(basepath.length)
  if (!rel.startsWith("/")) rel = "/" + rel
  rel = rel.replace(/^\/+/, "/")
  return rel + (loc.search || "")
}

/** Encode a relative location into the parent hash value (without the leading #). */
export function encodeParentHash(rel: string): string {
  return HASH_KEY + rel
}

/** Parse a parent hash back into a relative location, or null if it isn't ours. */
export function parseParentHash(hash: string): string | null {
  const h = hash.startsWith("#") ? hash.slice(1) : hash
  if (!h.startsWith(HASH_KEY)) return null
  return h.slice(HASH_KEY.length)
}

/**
 * The top window if we're framed and same-origin with it, else null. Returns
 * null when not framed (nothing to mirror — the iframe URL is already the address
 * bar) or when cross-origin access throws.
 */
export function getParentWindow(): Window | null {
  try {
    if (window.self === window.top) return null
    const top = window.top
    if (!top) return null
    void top.location.href // throws if cross-origin
    return top
  } catch {
    return null
  }
}

/**
 * Reflect the iframe's relative location into the parent hash. Uses replaceState
 * so no HA history entry is added and no popstate/reload fires on the parent.
 */
export function mirrorToParent(rel: string): void {
  const p = getParentWindow()
  if (!p) return
  try {
    const url = p.location.pathname + p.location.search + "#" + encodeParentHash(rel)
    p.history.replaceState(p.history.state, "", url)
  } catch {
    // Parent became unreachable; ignore.
  }
}

/**
 * On boot, if the parent hash carries a location that differs from the iframe's
 * current one, replaceState the iframe to it so the router and nuqs initialise at
 * the restored location. Must run before the router module evaluates.
 */
export function restoreFromParentHash(): void {
  const p = getParentWindow()
  if (!p) return
  let rel: string | null = null
  try {
    rel = parseParentHash(p.location.hash)
  } catch {
    return
  }
  if (!rel) return
  const basepath = resolveBasePath(window.location)
  if (rel === relativeLocation(window.location, basepath)) return
  // basepath ends with "/"; rel starts with "/" — join without doubling it.
  const childUrl = basepath.replace(/\/$/, "") + rel
  window.history.replaceState({}, "", childUrl)
}
