import { BuiltInAgent, CopilotSseRuntime } from "@copilotkit/runtime/v2"
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express"
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph"
import { catchError } from "rxjs"
import type { Router } from "express"

export type RuntimeOptions = {
  apiKey: string
}

export class SafeHttpAgent extends LangGraphHttpAgent {
  constructor(
    opts: { url: string },
    private fallback: BuiltInAgent,
  ) {
    super(opts)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override run(input: any): any {
    return super.run(input).pipe(
      catchError((err: Error) => {
        console.error("terminus-agent unreachable, falling back to built-in:", err.message)
        return this.fallback.run(input)
      }),
    )
  }
}

export function buildRuntime({ apiKey }: RuntimeOptions): Router {
  if (!apiKey) throw new Error("buildRuntime: anthropic api key is required")

  const agentUrl = process.env.TERMINUS_AGENT_URL

  const builtIn = new BuiltInAgent({
    model: "anthropic/claude-haiku-4-5",
    apiKey,
    providerOptions: {
      anthropic: { cacheControl: { type: "ephemeral" } },
    },
  })

  const defaultAgent = agentUrl
    ? new SafeHttpAgent({ url: agentUrl }, builtIn)
    : builtIn

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
