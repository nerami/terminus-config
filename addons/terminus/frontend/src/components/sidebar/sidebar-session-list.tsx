import { useEffect, useState } from 'react';

import { Thread } from '@langchain/langgraph-sdk';
import { Archive, MoreHorizontal, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { RenameThreadDialog } from '@/components/thread/rename-thread-dialog';
import { getContentString } from '@/components/thread/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useThreadId } from '@/hooks/use-thread-id';
import { storedThreadTitle } from '@/lib/thread-title';
import { useThreads } from '@/providers/thread';

function threadLabel(t: Thread): string {
  const stored = storedThreadTitle(t);
  if (stored) return stored;
  if (
    typeof t.values === 'object' &&
    t.values &&
    'messages' in t.values &&
    Array.isArray(t.values.messages) &&
    t.values.messages?.length > 0
  ) {
    return getContentString(t.values.messages[0].content);
  }
  return t.thread_id;
}

/**
 * The Recent Sessions list shown in the sidebar. Loads the user's threads, lets
 * them switch session, and archive a conversation from a per-row menu.
 * `onSelect` fires after a thread is chosen (used to close the mobile drawer).
 */
export function SidebarSessionList({ onSelect }: { onSelect?: () => void }) {
  const { archiveThread, getThreads, setThreads, setThreadsLoading, threads, threadsLoading } = useThreads();
  const [currentThreadId, setThreadId] = useThreadId();
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const { isMobile } = useSidebar();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleArchive = (id: string) => {
    archiveThread(id)
      .then(() => toast.success('Conversation archived'))
      .catch((err) => {
        console.error(err);
        toast.error("Couldn't archive conversation");
      });
  };

  if (threadsLoading) {
    return (
      <SidebarMenu>
        {Array.from({ length: 8 }).map((_, i) => (
          <SidebarMenuItem key={`skeleton-${i}`}>
            <SidebarMenuSkeleton />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (threads.length === 0) {
    return <p className="text-sidebar-foreground/70 px-2 py-1.5 text-xs">No conversations yet.</p>;
  }

  return (
    <SidebarMenu>
      {threads.map((t) => (
        <SidebarMenuItem key={t.thread_id}>
          <SidebarMenuButton
            isActive={t.thread_id === currentThreadId}
            onClick={() => {
              if (t.thread_id !== currentThreadId) setThreadId(t.thread_id);
              onSelect?.();
            }}
          >
            <span>{threadLabel(t)}</span>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuAction showOnHover aria-label="Conversation options">
                  <MoreHorizontal />
                </SidebarMenuAction>
              }
            />
            <DropdownMenuContent
              side={isMobile ? 'bottom' : 'right'}
              align={isMobile ? 'end' : 'start'}
              className="w-48"
            >
              <DropdownMenuItem onClick={() => setRenameTarget({ id: t.thread_id, title: threadLabel(t) })}>
                <Pencil />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => handleArchive(t.thread_id)}>
                <Archive />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
      <RenameThreadDialog
        open={renameTarget !== null}
        onOpenChange={(o) => !o && setRenameTarget(null)}
        threadId={renameTarget?.id ?? null}
        initialTitle={renameTarget?.title ?? ''}
      />
    </SidebarMenu>
  );
}
