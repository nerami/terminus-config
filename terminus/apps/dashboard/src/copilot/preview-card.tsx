import { Button } from "@/components/ui/button"
import { serializeYamlPreview, type AutomationProposal } from "@/lib/automation-writer"

export function PreviewCard({
  proposal,
  onApprove,
  onReject,
}: {
  proposal: AutomationProposal
  onApprove: () => void
  onReject: (feedback?: string) => void
}) {
  const yaml = serializeYamlPreview(proposal)
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="text-sm font-medium">Proposed automation</div>
      <pre className="overflow-auto rounded bg-muted p-2 text-xs leading-snug">
        {yaml}
      </pre>
      <div className="flex gap-2">
        <Button size="sm" onClick={onApprove}>
          Approve
        </Button>
        <Button size="sm" variant="outline" onClick={() => onReject()}>
          Reject
        </Button>
      </div>
    </div>
  )
}
