import { describe, expect, it, vi } from "vitest"
import { render, within, fireEvent } from "@testing-library/react"
import { PreviewCard } from "./PreviewCard"
import type { AutomationProposal } from "@/lib/automationWriter"

const proposal: AutomationProposal = {
  alias: "LR lamp off at 22:00",
  description: "",
  mode: "single",
  triggers: [{ platform: "time", at: "22:00:00" }],
  conditions: [],
  actions: [{ service: "switch.turn_off", target: { entity_id: "switch.lr_lamp" } }],
}

describe("PreviewCard", () => {
  it("renders the serialized YAML preview", () => {
    const { container } = render(<PreviewCard proposal={proposal} onApprove={() => {}} onReject={() => {}} />)
    expect(container.textContent?.includes("alias: LR lamp off at 22:00")).toBe(true)
    expect(container.textContent?.includes("entity_id: switch.lr_lamp")).toBe(true)
  })

  it("fires onApprove when Approve is clicked", () => {
    const onApprove = vi.fn()
    const { container } = render(<PreviewCard proposal={proposal} onApprove={onApprove} onReject={() => {}} />)
    fireEvent.click(within(container).getByRole("button", { name: /approve/i }))
    expect(onApprove).toHaveBeenCalledOnce()
  })

  it("fires onReject when Reject is clicked", () => {
    const onReject = vi.fn()
    const { container } = render(<PreviewCard proposal={proposal} onApprove={() => {}} onReject={onReject} />)
    fireEvent.click(within(container).getByRole("button", { name: /reject/i }))
    expect(onReject).toHaveBeenCalledOnce()
  })
})
