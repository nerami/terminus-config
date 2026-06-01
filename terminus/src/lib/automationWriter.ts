function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function hash6(input: string): string {
  // FNV-1a 32-bit → base36, padded
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36).padStart(6, "0").slice(-6)
}

export function generateAutomationId(alias: string): string {
  const slug = slugify(alias) || "automation"
  return `${slug}_${hash6(alias)}`
}
