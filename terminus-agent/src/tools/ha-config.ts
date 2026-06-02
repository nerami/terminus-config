import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function repoRoot(): string {
  return process.env.REPO_ROOT ?? join(process.cwd(), "..")
}

function packagesDir(): string {
  return join(repoRoot(), "packages")
}

function safeRelPath(rel: string, base: string): string {
  const resolved = join(base, rel)
  if (!resolved.startsWith(base)) throw new Error(`Path traversal blocked: ${rel}`)
  return resolved
}

const listPackages = tool(
  async () => {
    const dir = packagesDir()
    const files = readdirSync(dir).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    return files.join("\n")
  },
  {
    name: "ha_list_packages",
    description: "List all YAML package files in the packages/ directory.",
    schema: z.object({}),
  },
)

const readPackage = tool(
  async ({ filename }) => {
    const path = safeRelPath(filename, packagesDir())
    if (!existsSync(path)) return `File not found: ${filename}`
    return readFileSync(path, "utf-8")
  },
  {
    name: "ha_read_package",
    description: "Read the contents of a package YAML file (e.g. 'light_sensing.yaml').",
    schema: z.object({ filename: z.string().describe("Filename inside packages/ e.g. 'living_room.yaml'") }),
  },
)

const writePackage = tool(
  async ({ filename, content }) => {
    const path = safeRelPath(filename, packagesDir())
    writeFileSync(path, content, "utf-8")
    return `Written: ${filename}`
  },
  {
    name: "ha_write_package",
    description:
      "Write (create or overwrite) a package YAML file. Always validate config after writing. Content must be complete valid YAML.",
    schema: z.object({
      filename: z.string().describe("Filename inside packages/ e.g. 'living_room.yaml'"),
      content: z.string().describe("Full YAML content for the file"),
    }),
  },
)

const readConfig = tool(
  async ({ path: relPath }) => {
    const root = repoRoot()
    const absPath = safeRelPath(relPath, root)
    if (!existsSync(absPath)) return `File not found: ${relPath}`
    return readFileSync(absPath, "utf-8")
  },
  {
    name: "ha_read_config",
    description: "Read any HA config file relative to the repo root (e.g. 'configuration.yaml', 'automations.yaml').",
    schema: z.object({ path: z.string().describe("Path relative to repo root") }),
  },
)

const validateConfig = tool(
  async () => {
    const root = repoRoot()
    const result = spawnSync(
      "docker",
      [
        "run", "--rm",
        "-v", `${root}:/config`,
        "ghcr.io/home-assistant/home-assistant:stable",
        "python", "-m", "homeassistant",
        "--script", "check_config",
        "-c", "/config",
      ],
      { timeout: 60_000, encoding: "utf-8" },
    )
    const out = [result.stdout, result.stderr].filter(Boolean).join("\n")
    return out || (result.error ? String(result.error) : "No output")
  },
  {
    name: "ha_validate_config",
    description:
      "Run Home Assistant config validation via Docker. Always run this after writing any YAML changes before committing.",
    schema: z.object({}),
  },
)

export const haConfigTools = [listPackages, readPackage, writePackage, readConfig, validateConfig]
