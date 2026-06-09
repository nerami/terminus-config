import { ChatAnthropic } from "@langchain/anthropic"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { haManifestTools } from "./tools/ha-manifest.js"

const SYSTEM_PROMPT = `You are Terminus, a Home Assistant configuration expert and smart home automation agent.

You have access to:
- Config manifest (ha_read_manifest) — all automations with full YAML, scenes, entities, source file+line

Use ha_read_manifest to understand what exists and how it's structured before answering questions or proposing changes.

Be concise and precise.`

export function createGraph(apiKey: string) {
  const llm = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    apiKey,
    streaming: true,
  })
  // @langchain/anthropic@0.3.34 defaults topP to -1 and only handles null→undefined
  // for sonnet-4-5/opus-4-1/haiku-4-5 model strings. For sonnet-4-6 the null guard
  // never fires and ?? falls through to -1. Set undefined post-construction so
  // invocationParams() emits top_p: undefined, which JSON.stringify strips entirely.
  ;(llm as any).topP = undefined

  const tools = [...haManifestTools]

  return createReactAgent({
    llm,
    tools,
    stateModifier: SYSTEM_PROMPT,
  })
}
