import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  type Connection,
  type HassEntities,
} from "home-assistant-js-websocket"

declare global {
  interface Window {
    // HA panel_custom exposes a Promise<Connection> on the parent window.
    hassConnection?: Promise<{ conn: Connection }>
  }
}

export type ConnectionStatus = "connecting" | "connected" | "error"

// Prefer the live HA-provided connection (panel_custom context). Fall back to
// token auth from .env when running `pnpm dev` outside HA.
export async function connectHA(): Promise<Connection> {
  if (window.hassConnection) {
    const { conn } = await window.hassConnection
    return conn
  }

  const url = import.meta.env.VITE_HA_URL
  const token = import.meta.env.VITE_HA_TOKEN
  if (!url || !token) {
    throw new Error(
      "Not running inside HA and VITE_HA_URL / VITE_HA_TOKEN are unset. " +
        "Copy .env.example to .env and add a long-lived access token."
    )
  }

  const hassUrl = url.replace(/^wss?:\/\//, "https://").replace(/\/api\/websocket$/, "")
  const auth = createLongLivedTokenAuth(hassUrl, token)
  return createConnection({ auth })
}

export function watchEntities(
  conn: Connection,
  onUpdate: (entities: HassEntities) => void
) {
  return subscribeEntities(conn, onUpdate)
}
