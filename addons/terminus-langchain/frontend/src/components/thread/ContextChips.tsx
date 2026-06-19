import { MapPin, Boxes, Check } from "lucide-react";

import type { ContextItem } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

/**
 * Toggleable chips shown in the chat input that attach Home-topology context
 * (the selected node and the current page) to the next message. An active chip
 * is included in the message; toggling it off removes it from context.
 */
export function ContextChips({
  items,
  activeIds,
  onToggle,
}: {
  items: ContextItem[];
  activeIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3.5 pb-0">
      {items.map((item) => {
        const active = activeIds.has(item.id);
        const Icon = item.kind === "node" ? Boxes : MapPin;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(item.id)}
            title={
              active
                ? "Remove from message context"
                : "Add to message context"
            }
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
              active
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {active ? (
              <Check className="size-3.5" />
            ) : (
              <Icon className="size-3.5" />
            )}
            <span className="max-w-[160px] truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
