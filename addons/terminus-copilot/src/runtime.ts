import { BuiltInAgent, CopilotSseRuntime } from "@copilotkit/runtime/v2"
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express"
import type { Router } from "express"

export type RuntimeOptions = {
  apiKey: string
}

export function buildRuntime({ apiKey }: RuntimeOptions): Router {
  if (!apiKey) throw new Error("buildRuntime: anthropic api key is required")

  const runtime = new CopilotSseRuntime({
    agents: {
      default: new BuiltInAgent({
        model: "anthropic/claude-haiku-4-5",
        apiKey,
      }),
    },
  })

  return createCopilotExpressHandler({ runtime, basePath: "/" })
}
