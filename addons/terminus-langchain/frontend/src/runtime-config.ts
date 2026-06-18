// Resolves the backend endpoints at runtime from the page location, so the SPA
// works under the dynamic HA ingress prefix (/api/hassio_ingress/<token>/) as
// well as the Vite dev server (/). This replaces agent-chat-ui's build-time
// NEXT_PUBLIC_* env vars and the Next.js API passthrough route.

export type Endpoints = {
  /** LangGraph API base, proxied by FastAPI to the local langgraph server. */
  apiUrl: string
  /** Home Assistant websocket connection status endpoint. */
  haStatusUrl: string
  /** LangGraph graph id (from langgraph.json). */
  assistantId: string
}

export const ASSISTANT_ID = "agent"

export function resolveEndpoints(loc: {
  origin: string
  pathname: string
}): Endpoints {
  // Directory the SPA is served from, always with a trailing slash.
  const dir = loc.pathname.endsWith("/")
    ? loc.pathname
    : loc.pathname.replace(/[^/]*$/, "")
  const base = loc.origin + dir
  return {
    apiUrl: new URL("api", base).toString(),
    haStatusUrl: new URL("ha/status", base).toString(),
    assistantId: ASSISTANT_ID,
  }
}

export function endpoints(): Endpoints {
  return resolveEndpoints(window.location)
}
