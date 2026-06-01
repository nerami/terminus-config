import { commitAutomation, type CommitResult } from "@/lib/automationWriter"
import type { AutomationProposal } from "@/lib/automationWriter"
import { useCopilotAction } from "@copilotkit/react-core"
import { useLiveState } from "@/lib/liveState"
import { useMemo } from "react"

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

  useCopilotAction({
    name: "get_entity_state",
    description: "Read current state and attributes of a Home Assistant entity.",
    parameters: [
      { name: "entity_id", type: "string", required: true },
    ],
    handler: async ({ entity_id }: { entity_id: string }) =>
      runGetEntityStateHandler({ entity_id }, { liveStates: liveMap }),
  })

  useCopilotAction({
    name: "propose_automation",
    description:
      "Propose a new automation. The user sees a YAML preview and approves or rejects. " +
      "Always call this before commit_automation.",
    parameters: [
      { name: "alias", type: "string", required: true },
      { name: "description", type: "string", required: false },
      {
        name: "mode",
        type: "string",
        enum: ["single", "restart", "queued", "parallel"],
        required: true,
      },
      { name: "triggers", type: "object[]", required: true },
      { name: "conditions", type: "object[]", required: true },
      { name: "actions", type: "object[]", required: true },
    ],
    handler: (proposal: AutomationProposal) => controller.handler(proposal),
  })

  useCopilotAction({
    name: "commit_automation",
    description:
      "Write the approved automation to Home Assistant. Only call after propose_automation " +
      "returned {approved:true}.",
    parameters: [
      { name: "alias", type: "string", required: true },
      { name: "description", type: "string", required: false },
      {
        name: "mode",
        type: "string",
        enum: ["single", "restart", "queued", "parallel"],
        required: true,
      },
      { name: "triggers", type: "object[]", required: true },
      { name: "conditions", type: "object[]", required: true },
      { name: "actions", type: "object[]", required: true },
    ],
    handler: (proposal: AutomationProposal) =>
      runCommitAutomationHandler(proposal, {
        known: knownEntityIds,
        token,
        fetch: window.fetch.bind(window),
      }),
  })

  return null
}
