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
