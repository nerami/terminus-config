import { Boxes, Check, MapPin } from 'lucide-react';

import type { ContextItem } from '@/lib/chat-context';

import { Badge } from '@/components/ui/badge';

/**
 * Toggleable chips shown in the chat input that attach Home-topology context
 * (the selected node and the current page) to the next message. An active chip
 * is included in the message; toggling it off removes it from context.
 */
export function ContextChips({
  activeIds,
  items,
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
        const Icon = item.kind === 'node' ? Boxes : MapPin;
        return (
          <Badge
            key={item.id}
            variant={active ? 'default' : 'outline'}
            className="cursor-pointer gap-1.5"
            render={
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(item.id)}
                title={active ? 'Remove from message context' : 'Add to message context'}
              />
            }
          >
            {active ? <Check /> : <Icon />}
            <span className="max-w-[160px] truncate">{item.label}</span>
          </Badge>
        );
      })}
    </div>
  );
}
