import { useAtom } from 'jotai';
import { Check, Minus, Plus, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/components/ui/menu';
import { Separator } from '@/components/ui/separator';
import { useViewTools } from '@/hooks/use-view-tools';
import { MAX_FONT_SIZE, MIN_FONT_SIZE, clampFontSize, fontSizeAtom } from '@/lib/settings';
import { cn } from '@/lib/utils';

/**
 * The sidebar Settings dropdown. Exposes a toggle for showing tool-call messages
 * and a stepper for the base font size. Both persist to localStorage.
 */
export function SettingsMenu() {
  const [viewTools, setViewTools] = useViewTools();
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const size = clampFontSize(fontSize);

  return (
    <Menu>
      <MenuTrigger
        aria-label="Settings"
        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors"
      >
        <Settings className="size-4" />
      </MenuTrigger>
      <MenuContent align="start" className="w-60">
        <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">Chatbot</div>
        <MenuItem closeOnClick={false} className="justify-between gap-6" onClick={() => setViewTools(!viewTools)}>
          Show tool calls
          <Check className={cn('size-4 shrink-0', viewTools ? 'opacity-100' : 'opacity-0')} />
        </MenuItem>

        <Separator className="my-1" />

        <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">Appearance</div>
        <div className="flex items-center justify-between gap-6 px-2 py-1.5 text-sm">
          <span>Font size</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Decrease font size"
              disabled={size <= MIN_FONT_SIZE}
              onClick={(e) => {
                e.stopPropagation();
                setFontSize(clampFontSize(size - 1));
              }}
            >
              <Minus />
            </Button>
            <span className="w-9 text-center tabular-nums">{size}px</span>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Increase font size"
              disabled={size >= MAX_FONT_SIZE}
              onClick={(e) => {
                e.stopPropagation();
                setFontSize(clampFontSize(size + 1));
              }}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </MenuContent>
    </Menu>
  );
}
