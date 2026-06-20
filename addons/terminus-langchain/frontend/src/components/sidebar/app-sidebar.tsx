import { useAtom } from 'jotai';
import { Network, SquarePen } from 'lucide-react';

import { SettingsMenu } from './settings-menu';
import { SidebarSessionList } from './sidebar-session-list';

import { TerminusLogoSVG } from '@/components/icons/terminus/terminus-logo';
import { useArtifactOpen } from '@/components/thread/artifact';
import { HaStatusIndicator } from '@/components/thread/ha-status-indicator';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { useNewThread } from '@/hooks/use-new-thread';
import { graphFullscreenAtom, graphPanelOpenAtom } from '@/lib/ha-graph/atoms';

/**
 * The application sidebar: Terminus logo, primary actions (new session, the
 * topology toggle), the recent-sessions list, and a footer with the Home
 * Assistant status dot and the Settings menu. On mobile it renders as a drawer.
 */
export function AppSidebar() {
  const newThread = useNewThread();
  const [graphPanelOpen, setGraphPanelOpen] = useAtom(graphPanelOpenAtom);
  const [, setGraphFullscreen] = useAtom(graphFullscreenAtom);
  const [, closeArtifact] = useArtifactOpen();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const startNewSession = () => {
    newThread();
    closeOnMobile();
  };

  // Opening the diagram shows it full screen (and closes the artifact panel,
  // since they share the right column); the panel's own "Open chat" / close
  // controls take it from there. Closing always exits full screen.
  const toggleGraphPanel = () => {
    setGraphPanelOpen((prev) => {
      const next = !prev;
      if (next) {
        closeArtifact();
        setGraphFullscreen(true);
      } else {
        setGraphFullscreen(false);
      }
      return next;
    });
    closeOnMobile();
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <button
          aria-label="New chat"
          onClick={startNewSession}
          className="flex w-fit cursor-pointer items-center px-2 py-1"
        >
          <TerminusLogoSVG className="text-primary h-6" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={startNewSession}>
                <SquarePen />
                <span>New session</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={graphPanelOpen} onClick={toggleGraphPanel}>
                <Network />
                <span>Topology</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="min-h-0 flex-1">
          <SidebarGroupLabel>Recent sessions</SidebarGroupLabel>
          <SidebarSessionList onSelect={closeOnMobile} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-1">
          <SettingsMenu />
          <HaStatusIndicator />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
