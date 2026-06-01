import type { AutomationProposal } from "@/lib/automationWriter"

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
