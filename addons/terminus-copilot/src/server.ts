import express, { type Express } from "express"
import { readFileSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { buildRuntime } from "./runtime.js"

export type ServerOptions = {
  apiKey: string
}

export function createApp({ apiKey }: ServerOptions): Express {
  if (!apiKey) throw new Error("createApp: anthropic api key is required")

  const app = express()
  app.use(express.json({ limit: "1mb" }))

  app.get("/health", async (_req, res) => {
    const agentUrl = process.env.TERMINUS_AGENT_URL
    if (!agentUrl) {
      res.json({ status: "ok", agent: "builtin" })
      return
    }
    try {
      await fetch(`${agentUrl}/health`, { signal: AbortSignal.timeout(2000) })
      res.json({ status: "ok", agent: "external" })
    } catch {
      res.json({ status: "degraded", agent: "offline" })
    }
  })

  app.use("/api/copilotkit", buildRuntime({ apiKey }))

  return app
}

type AddonOptions = {
  anthropic_api_key?: string
  terminus_agent_url?: string
}

function readAddonOptions(): AddonOptions {
  try {
    const raw = readFileSync("/data/options.json", "utf-8")
    return JSON.parse(raw) as AddonOptions
  } catch {
    return {}
  }
}

const isMainEntry =
  import.meta.url === pathToFileURL(process.argv[1] ?? "").href

if (isMainEntry) {
  const opts = readAddonOptions()
  const apiKey = process.env.ANTHROPIC_API_KEY || opts.anthropic_api_key || ""
  if (!apiKey) {
    console.error("Missing ANTHROPIC_API_KEY (env or /data/options.json).")
    process.exit(1)
  }

  const agentUrl = process.env.TERMINUS_AGENT_URL || opts.terminus_agent_url || ""
  if (agentUrl) process.env.TERMINUS_AGENT_URL = agentUrl

  const port = Number(process.env.PORT ?? 3000)
  createApp({ apiKey }).listen(port, () => {
    console.log(`terminus-copilot listening on :${port}`)
  })
}
