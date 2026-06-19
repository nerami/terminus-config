// Resolves the backend endpoints at runtime from the page location, so the SPA
// works under the dynamic HA ingress prefix (/api/hassio_ingress/<token>/) as
// well as the Vite dev server (/). This replaces agent-chat-ui's build-time
// NEXT_PUBLIC_* env vars and the Next.js API passthrough route.

export type Endpoints = {
  /** LangGraph API base, proxied by FastAPI to the local langgraph server. */
  apiUrl: string
  /** Home Assistant websocket connection status endpoint. */
  haStatusUrl: string
  /** Home Assistant topology snapshot (areas/entities/scenes/automations). */
  haTopologyUrl: string
  /** Builds the URL for a single automation's config + referenced ids. */
  haAutomationUrl: (numericId: string, entityId?: string) => string
  /** Builds the URL for a single entity's current state + attributes. */
  haEntityUrl: (entityId: string) => string
  /** LangGraph graph id (from langgraph.json). */
  assistantId: string
}

export const ASSISTANT_ID = "agent"

// HA serves the SPA under a fixed-shape prefix: /api/hassio_ingress/<token>/.
// Match it so we can recover the served directory even when a session id
// (or any deeper path-routed segment) is appended after the prefix.
const INGRESS_RE = /^.*?\/api\/hassio_ingress\/[^/]+\//

// Returns the served directory (always ending in "/") for the router basepath
// and for resolving backend endpoints. When behind HA ingress this is the fixed
// /api/hassio_ingress/<token>/ prefix regardless of any trailing <threadId>
// session segment; otherwise (vite dev / direct serve at root) it is "/".
export function resolveBasePath(loc: { pathname: string }): string {
  const m = loc.pathname.match(INGRESS_RE)
  if (m) return m[0] // e.g. "/api/hassio_ingress/<token>/"
  return "/" // non-ingress: vite dev / direct serve at root
}

export function resolveEndpoints(loc: {
  origin: string
  pathname: string
}): Endpoints {
  // Directory the SPA is served from, always with a trailing slash. Derived
  // from the ingress prefix so deep session paths (…/<threadId>) don't skew it.
  const dir = resolveBasePath(loc)
  const base = loc.origin + dir
  return {
    apiUrl: new URL("api", base).toString(),
    haStatusUrl: new URL("ha/status", base).toString(),
    haTopologyUrl: new URL("ha/topology", base).toString(),
    haAutomationUrl: (numericId: string, entityId?: string) => {
      const url = new URL(
        `ha/automation/${encodeURIComponent(numericId)}`,
        base,
      )
      if (entityId) url.searchParams.set("entity_id", entityId)
      return url.toString()
    },
    haEntityUrl: (entityId: string) =>
      new URL(`ha/entity/${encodeURIComponent(entityId)}`, base).toString(),
    assistantId: ASSISTANT_ID,
  }
}

export function endpoints(): Endpoints {
  return resolveEndpoints(window.location)
}
