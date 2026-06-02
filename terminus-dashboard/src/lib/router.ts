import { useSyncExternalStore } from "react"

export type Route = { name: "map" } | { name: "auto"; id: string }

export function parseRoute(hash: string): Route {
  const stripped = hash.replace(/^#\/?/, "")
  if (stripped === "") return { name: "map" }
  const [head, ...rest] = stripped.split("/")
  if (head === "auto" && rest.length === 1 && rest[0] !== "") {
    return { name: "auto", id: decodeURIComponent(rest[0]) }
  }
  return { name: "map" }
}

export function formatRoute(r: Route): string {
  if (r.name === "map") return "#/"
  return `#/auto/${encodeURIComponent(r.id)}`
}

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener)
  return () => window.removeEventListener("hashchange", listener)
}
function getSnapshot() {
  return window.location.hash
}
function getServerSnapshot() {
  return ""
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return parseRoute(hash)
}

export function navigate(r: Route): void {
  const target = formatRoute(r)
  if (window.location.hash !== target.replace(/^#/, "#")) {
    window.location.hash = target
  }
}
