import type { ComponentProps } from 'react';

import { Group, Panel, Separator } from 'react-resizable-panels';

import { cn } from '@/lib/utils';

/** Pass-through aliases — styling for these lives on the elements in thread.tsx. */
export const ResizableGroup = Group;
export const ResizablePanel = Panel;

/**
 * A thin vertical divider. The library enlarges the hit target beyond the 1px
 * line, so the visual stays slim; it brightens on hover and while dragging.
 */
export function ResizableSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        'bg-border relative w-px shrink-0 transition-colors',
        'hover:bg-primary/50 data-[separator]:data-[resizing]:bg-primary/60',
        className,
      )}
      {...props}
    />
  );
}
