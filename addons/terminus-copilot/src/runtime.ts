import { BuiltInAgent, CopilotSseRuntime } from "@copilotkit/runtime/v2"
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express"
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph"
import { catchError, tap, throwError } from "rxjs"
import type { Router } from "express"

export type RuntimeOptions = {
  apiKey: string
}

export class SafeHttpAgent extends LangGraphHttpAgent {
  fallback: BuiltInAgent

  constructor(opts: { url: string }, fallback: BuiltInAgent) {
    super(opts)
    this.fallback = fallback
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override run(input: any): any {
    let runStarted = false
    return super.run(input).pipe(
      tap((event: any) => {
        if (event?.type === "RUN_STARTED") runStarted = true
      }),
      catchError((err: Error) => {
        if (runStarted) {
          // Primary already opened a run — switching agents would cause a
          // protocol violation (double RUN_STARTED). Let the error propagate.
          return throwError(() => err)
        }
        console.error("terminus-agent unreachable, falling back to built-in:", err.message)
        return this.fallback.run(input)
      }),
    )
  }

  // AbstractAgent.clone() uses Object.create(proto) — copies prototype but not own
  // properties. fallback is an own property so we must copy it explicitly.
  override clone(): this {
    const cloned = super.clone() as SafeHttpAgent
    cloned.fallback = this.fallback
    return cloned as this
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
