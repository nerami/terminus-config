import { ChatAnthropic } from "@langchain/anthropic"
import { createAgent } from "langchain"
import { haManifestTools } from "./tools/ha-manifest.js"

const SYSTEM_PROMPT = `You are Terminus, a Home Assistant configuration expert and smart home automation agent.

You have access to:
- Config manifest (ha_read_manifest) — all automations with full YAML, scenes, entities, source file+line

Use ha_read_manifest to understand what exists and how it's structured before answering questions or proposing changes.

Be concise and precise.`

export function createGraph(apiKey: string) {
  const model = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    apiKey,
    streaming: true,
  })

  const tools = [...haManifestTools]

  return createAgent({
    model,
    tools,
    systemPrompt: SYSTEM_PROMPT,
  })
}
