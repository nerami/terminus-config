import type { AreaId } from "./types.js"

const AREA_PREFIXES: ReadonlyArray<[string, AreaId]> = [
  ["mb_", "mb"],
  ["lr_", "lr"],
  ["abi_", "abi"],
]

export function inferArea(idOrSlug: string): AreaId {
  const slug = idOrSlug.includes(".") ? idOrSlug.slice(idOrSlug.indexOf(".") + 1) : idOrSlug
  for (const [prefix, area] of AREA_PREFIXES) {
    if (slug.startsWith(prefix)) return area
  }
  return "common"
}
