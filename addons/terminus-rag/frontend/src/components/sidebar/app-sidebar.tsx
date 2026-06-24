import { Boxes } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Health, ToolDef } from '@/lib/api';

type Props = {
  tools: ToolDef[];
  selected: string | null;
  onSelect: (name: string) => void;
  health: Health | null;
};

/**
 * The playground sidebar: a brand header, the MCP tool list as the primary
 * navigation, and an index-status footer. Mirrors the Terminus add-on's
 * app-sidebar (logo header / menu / footer) adapted for the tool console. The
 * component is presentational — `App` owns the tool + health state.
 */
export function AppSidebar({ tools, selected, onSelect, health }: Props) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <div className="flex items-center gap-2 px-2">
          <Boxes className="text-primary h-5 w-5" />
          <span className="font-heading text-sm font-semibold">Terminus RAG</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="min-h-0 flex-1">
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarMenu>
            {tools.map((tool) => (
              <SidebarMenuItem key={tool.name}>
                <SidebarMenuButton
                  isActive={selected === tool.name}
                  onClick={() => onSelect(tool.name)}
                  tooltip={tool.description}
                  className="font-mono"
                >
                  <span>{tool.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {health && (
        <SidebarFooter>
          <div className="text-muted-foreground px-2 py-1 font-mono text-[10px] leading-tight">
            {health.status} · {health.indexed} indexed · {health.model}
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
