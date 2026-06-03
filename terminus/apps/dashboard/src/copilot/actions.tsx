import { commitAutomation, type CommitResult } from "@/lib/automation-writer"
import type { AutomationProposal } from "@/lib/automation-writer"
import { useFrontendTool } from "@copilotkit/react-core/v2"
import { useLiveState } from "@/lib/live-state"
import { useMemo } from "react"
import { z } from "zod"

export type LiveStateSnapshot = {
  state: string
  attributes: Record<string, unknown>
}

export type GetEntityStateDeps = {
  liveStates: Map<string, LiveStateSnapshot>
}

export type GetEntityStateResult =
  | { state: string; attributes: Record<string, unknown> }
  | { error: "not_found" }

export function runGetEntityStateHandler(
  args: { entity_id: string },
  deps: GetEntityStateDeps
): GetEntityStateResult {
  const snap = deps.liveStates.get(args.entity_id)
  if (!snap) return { error: "not_found" }
  return { state: snap.state, attributes: snap.attributes }
}

export type ProposeResult =
  | { approved: true }
  | { approved: false; feedback?: string }

export type ProposeAutomationController = {
  handler: (proposal: AutomationProposal) => Promise<ProposeResult>
  approve: () => void
  reject: (feedback?: string) => void
  pending: AutomationProposal | null
}

export function createProposeAutomationController(): ProposeAutomationController {
  let resolver: ((r: ProposeResult) => void) | null = null
  const ctl: ProposeAutomationController = {
    pending: null,
    handler(proposal) {
      ctl.pending = proposal
      return new Promise<ProposeResult>((resolve) => {
        resolver = resolve
      })
    },
    approve() {
      if (!resolver) return
      resolver({ approved: true })
      resolver = null
      ctl.pending = null
    },
    reject(feedback) {
      if (!resolver) return
      resolver({ approved: false, feedback })
      resolver = null
      ctl.pending = null
    },
  }
  return ctl
}

export type CommitDeps = {
  known: Set<string>
  token: string
  fetch: typeof fetch
  commitImpl?: typeof commitAutomation
}

export function runCommitAutomationHandler(
  proposal: AutomationProposal,
  deps: CommitDeps
): Promise<CommitResult> {
  const impl = deps.commitImpl ?? commitAutomation
  return impl(proposal, deps.known, { fetch: deps.fetch, token: deps.token })
}

const proposalSchema = z.object({
  alias: z.string(),
  description: z.string().optional(),
  mode: z.enum(["single", "restart", "queued", "parallel"]),
  triggers: z.array(z.record(z.string(), z.unknown())),
  conditions: z.array(z.record(z.string(), z.unknown())),
  actions: z.array(z.record(z.string(), z.unknown())),
})

const entityStateSchema = z.object({
  entity_id: z.string(),
})

export function CopilotActions({
  controller,
  knownEntityIds,
  token,
}: {
  controller: ProposeAutomationController
  knownEntityIds: Set<string>
  token: string
}) {
  const { entities } = useLiveState()
  const liveMap = useMemo(() => {
    const m = new Map<string, LiveStateSnapshot>()
    for (const [id, e] of Object.entries(entities)) {
      m.set(id, { state: e.state, attributes: e.attributes ?? {} })
    }
    return m
  }, [entities])

  useFrontendTool({
    name: "get_entity_state",
    description: "Read current state and attributes of a Home Assistant entity.",
    parameters: entityStateSchema,
    handler: async ({ entity_id }) =>
      runGetEntityStateHandler({ entity_id }, { liveStates: liveMap }),
  })

  useFrontendTool({
    name: "propose_automation",
    description:
      "Propose a new automation. The user sees a YAML preview and approves or rejects. " +
      "Always call this before commit_automation.",
    parameters: proposalSchema,
    handler: async (proposal) => controller.handler(proposal as AutomationProposal),
  })

  useFrontendTool({
    name: "commit_automation",
    description:
      "Write the approved automation to Home Assistant. Only call after propose_automation " +
      "returned {approved:true}.",
    parameters: proposalSchema,
    handler: async (proposal) =>
      runCommitAutomationHandler(proposal as AutomationProposal, {
        known: knownEntityIds,
        token,
        fetch: window.fetch.bind(window),
      }),
  })

  return null
}
