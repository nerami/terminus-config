import { useAtom } from 'jotai';
import { ChevronsUpDown, Cog, Minus, Plus } from 'lucide-react';

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
import { useHaStatus } from '@/hooks/use-ha-status';
import { useViewTools } from '@/hooks/use-view-tools';
import { MAX_FONT_SIZE, MIN_FONT_SIZE, clampFontSize, fontSizeAtom, topology3dAtom } from '@/lib/settings';

/**
 * The sidebar footer's Settings menu: a cog + label {@link SidebarMenuButton}
 * opening a dropdown that leads with the Home Assistant connection block (label,
 * version, status dot), then preferences (tool-call visibility, base font size,
 * 3D topology), all persisted to localStorage.
 */
export function SettingsMenu() {
  const [viewTools, setViewTools] = useViewTools();
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [topology3d, setTopology3d] = useAtom(topology3dAtom);
  const { ha_version: haVersion } = useHaStatus();
  const size = clampFontSize(fontSize);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                aria-label="Settings"
                className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
              >
                <Cog />
                <span className="flex-1 truncate text-left font-medium">Settings</span>
                <ChevronsUpDown className="size-4 opacity-60" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent side="right" align="end" sideOffset={4} className="w-60">
            <div className="flex items-center gap-2 px-1.5 py-1 text-sm">
              <div className="grid flex-1 leading-tight">
                <span className="truncate font-medium">Home Assistant</span>
                {haVersion && <span className="text-muted-foreground truncate text-xs">v{haVersion}</span>}
              </div>
              <HaStatusIndicator />
            </div>

            <DropdownMenuSeparator />

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
