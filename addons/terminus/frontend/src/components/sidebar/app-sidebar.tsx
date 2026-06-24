import { useSetAtom } from 'jotai';
import { Network, Sparkles, SquarePen } from 'lucide-react';

import { SettingsMenu } from './settings-menu';
import { SidebarSessionList } from './sidebar-session-list';

import TerminusLogo from '@/components/brand/terminus-logo/terminus-logo.svg?react';
import { useArtifactOpen } from '@/components/thread/artifact';
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
import { whatsNewOpenAtom } from '@/components/whats-new/whats-new-dialog';
import { useChangelog } from '@/hooks/use-changelog';
import { useHaStatus } from '@/hooks/use-ha-status';
import { useNewThread } from '@/hooks/use-new-thread';
import { usePanelLayout } from '@/lib/ha-graph/use-panel-layout';

/**
 * The application sidebar: Terminus logo, primary actions (new session, the
 * topology toggle), the recent-sessions list plus a "What's new" button, and a
 * footer holding the Settings menu. On mobile it renders as a drawer.
 */
export function AppSidebar() {
  const newThread = useNewThread();
  const { closeTopology, enterFullscreen, layout } = usePanelLayout();
  const [, closeArtifact] = useArtifactOpen();
  const { isMobile, setOpenMobile } = useSidebar();
  const { terminus_version: terminusVersion } = useHaStatus();
  const { data: changelog } = useChangelog();
  const openWhatsNew = useSetAtom(whatsNewOpenAtom);

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const startNewSession = () => {
    newThread();
    closeOnMobile();
  };

  // Opening the diagram shows it full screen (and closes the artifact, since
  // they share the right column); closing returns to the chat.
  const toggleGraphPanel = () => {
    if (layout === 'chat') {
      closeArtifact();
      enterFullscreen();
    } else {
      closeTopology();
    }
    closeOnMobile();
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <div className="flex w-fit items-baseline gap-1.5 px-2">
          <button
            aria-label="New chat"
            onClick={startNewSession}
            className="flex cursor-pointer items-center py-1"
          >
            <TerminusLogo className="text-primary h-6" />
          </button>
          {terminusVersion && (
            <span className="text-muted-foreground font-mono text-[10px] leading-none">
              v{terminusVersion}
            </span>
          )}
        </div>
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
              <SidebarMenuButton isActive={layout !== 'chat'} onClick={toggleGraphPanel}>
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

        {changelog && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" onClick={() => openWhatsNew(true)}>
                  <Sparkles />
                  <span>What's new</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SettingsMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
