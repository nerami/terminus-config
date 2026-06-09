export type HaFetchResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; error: string }

const TIMEOUT_MS = 10_000

export async function haFetch(path: string, init: RequestInit = {}): Promise<HaFetchResult> {
  const server = process.env.HASS_SERVER
  const token = process.env.HASS_TOKEN
  if (!server || !token) {
    return { ok: false, status: 0, error: "HASS_SERVER/HASS_TOKEN not set" }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${server}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    })

    const text = await res.text()
    let data: unknown = text || null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      // non-JSON body — keep raw text
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: typeof data === "string" ? data : JSON.stringify(data),
      }
    }
    return { ok: true, status: res.status, data }
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError"
    const msg = aborted
      ? "HA unreachable (timeout)"
      : err instanceof Error
        ? `HA unreachable: ${err.message}`
        : "HA unreachable"
    return { ok: false, status: 0, error: msg }
  } finally {
    clearTimeout(timer)
  }
}
