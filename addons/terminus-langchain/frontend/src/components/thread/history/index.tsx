import { useEffect } from 'react';

import { Thread } from '@langchain/langgraph-sdk';
import { Archive, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

import { getContentString } from '../utils';

import { Button } from '@/components/ui/button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/components/ui/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useThreadId } from '@/hooks/use-thread-id';
import { cn } from '@/lib/utils';
import { useThreads } from '@/providers/Thread';

const SCROLLBAR =
  'overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent';

function threadLabel(t: Thread): string {
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

function ThreadList({
  onArchive,
  onThreadClick,
  threads,
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
  onArchive?: (threadId: string) => void;
}) {
  const [threadId, setThreadId] = useThreadId();

  if (threads.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full w-full items-center justify-center p-6 text-sm">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className={cn('flex h-full w-full flex-col items-start justify-start gap-1', SCROLLBAR)}>
      {threads.map((t) => (
        <div key={t.thread_id} className="group/thread relative flex w-full items-center px-1">
          <Button
            variant="ghost"
            className={cn(
              'w-full items-start justify-start pr-9 text-left font-normal',
              t.thread_id === threadId && 'bg-muted',
            )}
            onClick={(e) => {
              e.preventDefault();
              onThreadClick?.(t.thread_id);
              if (t.thread_id === threadId) return;
              setThreadId(t.thread_id);
            }}
          >
            <p className="truncate text-ellipsis">{threadLabel(t)}</p>
          </Button>
          {onArchive && (
            <Menu>
              <MenuTrigger
                aria-label="Conversation options"
                className="hover:bg-muted text-muted-foreground absolute right-2 flex size-8 cursor-pointer items-center justify-center rounded-md opacity-0 transition-opacity group-hover/thread:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="size-4" />
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(t.thread_id);
                  }}
                >
                  <Archive />
                  Archive
                </MenuItem>
              </MenuContent>
            </Menu>
          )}
        </div>
      ))}
    </div>
  );
}

function ThreadHistoryLoading() {
  return (
    <div className={cn('flex h-full w-full flex-col items-start justify-start gap-2', SCROLLBAR)}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={`skeleton-${i}`} className="h-10 w-full" />
      ))}
    </div>
  );
}

export default function ThreadHistory({ onThreadSelect }: { onThreadSelect?: (threadId: string) => void }) {
  const { archiveThread, getThreads, setThreads, setThreadsLoading, threads, threadsLoading } = useThreads();

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

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
      {threadsLoading ? (
        <ThreadHistoryLoading />
      ) : (
        <ThreadList threads={threads} onThreadClick={onThreadSelect} onArchive={handleArchive} />
      )}
    </div>
  );
}
