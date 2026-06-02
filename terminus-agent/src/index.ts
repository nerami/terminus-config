import express from "express"
import { handleAgentRequest } from "./agent.js"
import { createGraph } from "./graph.js"

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required env var: ${name}`)
  return val
}

const apiKey = requireEnv("ANTHROPIC_API_KEY")
const graph = createGraph(apiKey)

const app = express()
app.use(express.json({ limit: "2mb" }))

app.get("/health", (_req, res) => {
  res.json({ ok: true })
})

app.post("/", (req, res) => {
  const msg = (req.body?.messages as Array<{ role: string; content?: string }>)?.findLast(
    (m) => m.role === "user",
  )
  console.log(`[${new Date().toISOString()}] user: ${msg?.content?.slice(0, 120) ?? "(no message)"}`)
  handleAgentRequest(graph, req, res)
})

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  console.log(`terminus-agent listening on :${port}`)
})
