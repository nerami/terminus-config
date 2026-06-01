import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEntityState } from "@/lib/liveState"
import {
  useRegistryEntry,
  useRegistryStatus,
  useRegistryError,
  useRegistryRefresh,
} from "@/lib/registry"
import type { GraphNode } from "@/types/manifest"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: GraphNode | null
}

function configHref(node: GraphNode): string {
  const origin = window.location.origin
  const objectId = node.id.split(".")[1] ?? node.id
  switch (node.kind) {
    case "script":
      return `${origin}/config/script/edit/${objectId}`
    case "scene":
      return `${origin}/config/scene/edit/${objectId}`
    case "entity":
    case "template":
    default:
      return `${origin}/config/entities/entity/${node.id}`
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  )
}

export function NodeDetailSheet({ open, onOpenChange, node }: Props) {
  const status = useRegistryStatus()
  const error = useRegistryError()
  const refresh = useRegistryRefresh()
  const lookupId =
    node && (node.kind === "entity" || node.kind === "template" || node.kind === "scene" || node.kind === "script")
      ? node.id
      : undefined
  const entry = useRegistryEntry(lookupId)
  const liveState = useEntityState(node?.id)

  if (!node) return null

  const labels = entry?.labels ?? []
  const exposure = entry?.exposure ?? {}
  const exposureKeys = Object.keys(exposure)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono text-sm">{node.id}</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <Badge variant="outline">{node.kind}</Badge>
            {liveState && (
              <Badge variant="secondary" className="font-mono text-[10px]">
                {liveState}
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        {status === "error" && (
          <div className="my-3 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs">
            <div>Registry unavailable.</div>
            {error && <div className="font-mono opacity-70">{error}</div>}
            <Button size="sm" variant="outline" className="mt-1" onClick={refresh}>
              Retry
            </Button>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <Section title="Area">{entry?.areaName ?? "—"}</Section>

          <Section title="Status">
            <div className="flex flex-wrap gap-2">
              <Badge variant={entry?.enabled ? "default" : "destructive"}>
                {entry?.enabled ? "Enabled" : "Disabled"}
              </Badge>
              <Badge variant={entry?.visible ? "default" : "secondary"}>
                {entry?.visible ? "Visible" : "Hidden"}
              </Badge>
            </div>
          </Section>

          <Section title="Labels">
            {labels.length === 0 ? (
              "—"
            ) : (
              <div className="flex flex-wrap gap-1">
                {labels.map((l) => (
                  <Badge key={l} variant="outline">
                    {l}
                  </Badge>
                ))}
              </div>
            )}
          </Section>

          <Section title="Voice exposure">
            {exposureKeys.length === 0 ? (
              "No voice assistant exposure."
            ) : (
              <ul className="space-y-0.5">
                {exposureKeys.map((k) => (
                  <li key={k} className="flex justify-between font-mono text-xs">
                    <span>{k}</span>
                    <span>{exposure[k] ? "exposed" : "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Source">
            <span className="font-mono text-xs">
              {node.source.file}:{node.source.line}
            </span>
          </Section>

          <a
            href={configHref(node)}
            target="_top"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open in Home Assistant
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
