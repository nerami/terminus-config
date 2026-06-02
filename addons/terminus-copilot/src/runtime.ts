import { BuiltInAgent, CopilotSseRuntime } from "@copilotkit/runtime/v2"
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express"
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph"
import type { Router } from "express"

export type RuntimeOptions = {
  apiKey: string
}

export function buildRuntime({ apiKey }: RuntimeOptions): Router {
  if (!apiKey) throw new Error("buildRuntime: anthropic api key is required")

  const agentUrl = process.env.TERMINUS_AGENT_URL

  const defaultAgent = agentUrl
    ? new LangGraphHttpAgent({ url: agentUrl })
    : new BuiltInAgent({
        model: "anthropic/claude-haiku-4-5",
        apiKey,
        providerOptions: {
          anthropic: { cacheControl: { type: "ephemeral" } },
        },
      })

  if (agentUrl) {
    console.log(`terminus-copilot: routing to external agent at ${agentUrl}`)
  }

  const runtime = new CopilotSseRuntime({ agents: { default: defaultAgent } })

  // single-route: CopilotKit client POSTs a JSON envelope {method,...} to
  // the base URL. Default multi-route mode expects per-operation paths
  // (GET /info, POST /agent/<id>/run, etc); the v2 react client speaks
  // single-route only — multi-route here means every call 404s.
  return createCopilotExpressHandler({
    runtime,
    basePath: "/",
    mode: "single-route",
  })
}
