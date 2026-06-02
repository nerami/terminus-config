import { BuiltInAgent, CopilotSseRuntime } from "@copilotkit/runtime/v2"
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express"
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph"
import { catchError, of } from "rxjs"
import type { Router } from "express"

export type RuntimeOptions = {
  apiKey: string
}

const EventType = {
  RUN_STARTED: "RUN_STARTED",
  RUN_FINISHED: "RUN_FINISHED",
  TEXT_MESSAGE_START: "TEXT_MESSAGE_START",
  TEXT_MESSAGE_CONTENT: "TEXT_MESSAGE_CONTENT",
  TEXT_MESSAGE_END: "TEXT_MESSAGE_END",
} as const

class SafeHttpAgent extends LangGraphHttpAgent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override run(input: any): any {
    const msgId = crypto.randomUUID()
    const { threadId, runId } = input
    return super.run(input).pipe(
      catchError((err: Error) => {
        console.error("terminus-agent unreachable:", err.message)
        return of(
          { type: EventType.RUN_STARTED, threadId, runId },
          { type: EventType.TEXT_MESSAGE_START, messageId: msgId, role: "assistant" },
          {
            type: EventType.TEXT_MESSAGE_CONTENT,
            messageId: msgId,
            delta: `⚠️ Terminus Agent is offline (${err.message}). Run \`pnpm dev\` in terminus-agent/.`,
          },
          { type: EventType.TEXT_MESSAGE_END, messageId: msgId },
          { type: EventType.RUN_FINISHED, threadId, runId },
        )
      }),
    )
  }
}

export function buildRuntime({ apiKey }: RuntimeOptions): Router {
  if (!apiKey) throw new Error("buildRuntime: anthropic api key is required")

  const agentUrl = process.env.TERMINUS_AGENT_URL

  const defaultAgent = agentUrl
    ? new SafeHttpAgent({ url: agentUrl })
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
