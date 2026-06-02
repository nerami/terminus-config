import { ChatAnthropic } from "@langchain/anthropic"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { haApiTools } from "./tools/ha-api.js"
import { haConfigTools } from "./tools/ha-config.js"
import { haGitTools } from "./tools/ha-git.js"

const SYSTEM_PROMPT = `You are Terminus, a Home Assistant configuration expert and smart home automation agent.

You have access to:
- Live HA entity state (read/write via REST API)
- HA configuration files (packages/ YAML — read, create, update, delete)
- Config validation (docker-based check_config)
- Git operations (status, diff, commit changes)

HA config conventions:
- All automation/scene/script/template work goes in packages/<area>.yaml
- Use 2-space YAML indent, snake_case entity IDs with area prefix (lr_*, mb_*, abi_*)
- Every automation needs a stable id: field
- Never touch automations.yaml / scripts.yaml / scenes.yaml directly
- Validate after any config change before committing

When modifying config:
1. Read the relevant package file first
2. Make minimal targeted changes
3. Validate the config
4. Commit with a descriptive conventional commit message

Be concise and precise. Show diffs or key changes, not full file contents unless asked.`

export function createGraph(apiKey: string) {
  const llm = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    apiKey,
    streaming: true,
    topP: null as unknown as number,
  })

  const tools = [...haApiTools, ...haConfigTools, ...haGitTools]

  return createReactAgent({
    llm,
    tools,
    stateModifier: SYSTEM_PROMPT,
  })
}
