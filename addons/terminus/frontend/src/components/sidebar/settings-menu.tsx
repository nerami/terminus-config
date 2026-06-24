import { useAtom } from 'jotai';
import { Minus, Plus, Settings } from 'lucide-react';

import { HaStatusIndicator } from '@/components/thread/ha-status-indicator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { useViewTools } from '@/hooks/use-view-tools';
import { MAX_FONT_SIZE, MIN_FONT_SIZE, clampFontSize, fontSizeAtom, topology3dAtom } from '@/lib/settings';

/**
 * The sidebar footer's Settings menu: a full-width {@link SidebarMenuButton}
 * that opens a dropdown of preferences (tool-call visibility, base font size,
 * 3D topology). The Home Assistant status dot rides on the trailing edge of the
 * trigger. All preferences persist to localStorage.
 */
export function SettingsMenu() {
  const [viewTools, setViewTools] = useViewTools();
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [topology3d, setTopology3d] = useAtom(topology3dAtom);
  const size = clampFontSize(fontSize);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                aria-label="Settings"
                className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
              >
                <Settings />
                <span>Settings</span>
                <span className="ml-auto flex items-center">
                  <HaStatusIndicator />
                </span>
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent side="right" align="end" sideOffset={4} className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Chatbot</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={viewTools} closeOnClick={false} onCheckedChange={setViewTools}>
                Show tool calls
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <div className="flex items-center justify-between gap-6 px-1.5 py-1 text-sm">
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
              <div
                className="flex items-center justify-between gap-6 px-1.5 py-1 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex items-center gap-2">
                  3D topology
                  <Badge variant="secondary">Beta</Badge>
                </span>
                <Switch checked={topology3d} onCheckedChange={setTopology3d} aria-label="3D topology" />
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
