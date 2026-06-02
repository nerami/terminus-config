import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  type Auth,
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

type HassObj = {
  auth?: {
    accessToken?: string
    data?: { access_token?: string }
  }
  callApi?: <T>(method: string, path: string, body?: unknown) => Promise<T>
}

type HassEl = { hass?: HassObj }

export function getHassObject(): HassObj | null {
  const el = document.querySelector("home-assistant") as HassEl | null
  return el?.hass ?? null
}

function readTokenFromHomeAssistantEl(): string | null {
  const a = getHassObject()?.auth
  if (!a) return null
  if (typeof a.accessToken === "string" && a.accessToken) return a.accessToken
  if (typeof a.data?.access_token === "string" && a.data.access_token) {
    return a.data.access_token
  }
  return null
}

export async function getAuthToken(): Promise<string> {
  // 1. Try window.hassConnection (panel_custom context).
  if (window.hassConnection) {
    try {
      const { conn } = await window.hassConnection
      const auth = (conn as unknown as { auth?: Auth & { data?: { access_token?: string } } }).auth
      console.info("[terminus] hassConnection.auth keys:", auth ? Object.keys(auth) : null)
      if (auth) {
        if (typeof auth.accessToken === "string" && auth.accessToken) return auth.accessToken
        if (typeof auth.data?.access_token === "string" && auth.data.access_token) {
          return auth.data.access_token
        }
      }
    } catch (e) {
      console.warn("[terminus] hassConnection token read failed:", e)
    }
  } else {
    console.info("[terminus] window.hassConnection is undefined")
  }

  // 2. Try the <home-assistant> root element (HA frontend convention).
  const elToken = readTokenFromHomeAssistantEl()
  if (elToken) return elToken
  console.info("[terminus] <home-assistant>.hass.auth.accessToken unavailable")

  // 3. Dev fallback.
  const token = import.meta.env.VITE_HA_TOKEN
  if (!token) {
    throw new Error("No HA auth token — set VITE_HA_TOKEN in .env or run inside HA.")
  }
  return token
}
