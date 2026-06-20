import { useEffect, useState } from 'react';

import { Thread } from '@langchain/langgraph-sdk';
import { Archive, MoreHorizontal, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { RenameThreadDialog } from '@/components/thread/rename-thread-dialog';
import { getContentString } from '@/components/thread/utils';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/components/ui/menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton } from '@/components/ui/sidebar';
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
          <Menu>
            <MenuTrigger
              aria-label="Conversation options"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-md opacity-0 transition-opacity group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[popup-open]:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </MenuTrigger>
            <MenuContent>
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setRenameTarget({ id: t.thread_id, title: threadLabel(t) });
                }}
              >
                <Pencil />
                Rename
              </MenuItem>
              <MenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(t.thread_id);
                }}
              >
                <Archive />
                Archive
              </MenuItem>
            </MenuContent>
          </Menu>
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
