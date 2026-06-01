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

  app.get("/health", (_req, res) => {
    res.json({ ok: true })
  })

  app.use("/api/copilotkit", buildRuntime({ apiKey }))

  return app
}

function readOptionsApiKey(): string {
  try {
    const raw = readFileSync("/data/options.json", "utf-8")
    const opts = JSON.parse(raw) as { anthropic_api_key?: string }
    return opts.anthropic_api_key ?? ""
  } catch {
    return ""
  }
}

const isMainEntry =
  import.meta.url === pathToFileURL(process.argv[1] ?? "").href

if (isMainEntry) {
  const apiKey = process.env.ANTHROPIC_API_KEY || readOptionsApiKey()
  if (!apiKey) {
    console.error("Missing ANTHROPIC_API_KEY (env or /data/options.json).")
    process.exit(1)
  }
  const port = Number(process.env.PORT ?? 3000)
  createApp({ apiKey }).listen(port, () => {
    console.log(`terminus-copilot listening on :${port}`)
  })
}
