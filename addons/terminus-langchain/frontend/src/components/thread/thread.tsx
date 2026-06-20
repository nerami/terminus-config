import { ReactNode, useEffect, useRef } from 'react';
import { useState, FormEvent } from 'react';

import { Checkpoint, Message } from '@langchain/langgraph-sdk';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Archive,
  ArrowDown,
  LoaderCircle,
  MoreVertical,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  XIcon,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { v4 as uuidv4 } from 'uuid';

import { GraphPanel } from '../graph/graph-panel';
import { TopologyUrlSync } from '../graph/topology-url-sync';
import { ParentUrlSync } from '../parent-url-sync';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

import { useArtifactOpen, ArtifactContent, ArtifactTitle, useArtifactContext } from './artifact';
import { ContentBlocksPreview } from './content-blocks-preview';
import { ContextChips } from './context-chips';
import { AssistantMessage, AssistantMessageLoading } from './messages/ai';
import { HumanMessage } from './messages/human';
import { RenameThreadDialog } from './rename-thread-dialog';
import { TooltipIconButton } from './tooltip-icon-button';
import { chatTitleFromMessages, getContentString } from './utils';

import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/components/ui/menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThreadId } from '@/hooks/use-thread-id';
import { contextItems, formatContextBlock } from '@/lib/chat-context';
import { DO_NOT_RENDER_ID_PREFIX, ensureToolCallsHaveResponses } from '@/lib/ensure-tool-responses';
import {
  graphFullscreenAtom,
  graphPanelOpenAtom,
  graphViewAtom,
  selectedNodeAtom,
  topologyAtom,
} from '@/lib/ha-graph/atoms';
import { storedThreadTitle } from '@/lib/thread-title';
import { cn } from '@/lib/utils';
import { useStreamContext } from '@/providers/stream';
import { useThreads } from '@/providers/thread';

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const context = useStickToBottomContext();
  return (
    <div ref={context.scrollRef} style={{ width: '100%', height: '100%' }} className={props.className}>
      <div ref={context.contentRef} className={props.contentClassName}>
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button variant="outline" className={props.className} onClick={() => scrollToBottom()}>
      <ArrowDown className="size-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

export function Thread() {
  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();
  // The topology toggle lives in the sidebar now; here we only read the open
  // state to size the right column. The diagram and the artifact panel share
  // that column, so either one opening drives the layout.
  const graphPanelOpen = useAtomValue(graphPanelOpenAtom);
  const graphFullscreen = useAtomValue(graphFullscreenAtom);
  const setGraphFullscreen = useSetAtom(graphFullscreenAtom);
  const setGraphPanelOpen = useSetAtom(graphPanelOpenAtom);
  const isMobile = useIsMobile();
  const { isMobile: isSidebarMobile, open: sidebarOpen, openMobile: sidebarOpenMobile, toggleSidebar } = useSidebar();
  const sidebarVisible = isSidebarMobile ? sidebarOpenMobile : sidebarOpen;
  const rightPanelOpen = artifactOpen || graphPanelOpen;

  // Open the topology as a side panel (split view) — the sidebar opens it full
  // screen instead. The diagram and the artifact share the right column, so
  // opening one closes the other.
  const openTopology = () => {
    closeArtifact();
    setGraphFullscreen(false);
    setGraphPanelOpen(true);
  };

  const [threadId, _setThreadId] = useThreadId();
  const { archiveThread, generateThreadTitle, threads } = useThreads();
  const [renameOpen, setRenameOpen] = useState(false);
  const [input, setInput] = useState('');
  const {
    contentBlocks,
    dragOver,
    dropRef,
    handleFileUpload,
    handlePaste,
    removeBlock,
    resetBlocks: _resetBlocks,
    setContentBlocks,
  } = useFileUpload();
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  // Home-topology context the user can attach to a message via chips.
  const graphView = useAtomValue(graphViewAtom);
  const selectedNode = useAtomValue(selectedNodeAtom);
  const topology = useAtomValue(topologyAtom);
  const [inactiveContextIds, setInactiveContextIds] = useState<Set<string>>(new Set());
  const availableContext = contextItems(graphView, selectedNode, topology);
  const activeContextIds = new Set(availableContext.filter((i) => !inactiveContextIds.has(i.id)).map((i) => i.id));
  const toggleContext = (id: string) =>
    setInactiveContextIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

  const lastError = useRef<string | undefined>(undefined);

  const setThreadId = (id: string | null) => {
    _setThreadId(id);

    // close artifact and reset artifact context
    closeArtifact();
    setArtifactContext({});
  };

  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error('An error occurred. Please try again.', {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream.error]);

  // TODO: this should be part of the useStream hook
  const prevMessageLength = useRef(0);
  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages?.length &&
      messages[messages.length - 1].type === 'ai'
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim().length === 0 && contentBlocks.length === 0) || isLoading) return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: 'human',
      content: [
        ...(input.trim().length > 0 ? [{ type: 'text', text: input }] : []),
        ...contentBlocks,
      ] as Message['content'],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    const context = Object.keys(artifactContext).length > 0 ? artifactContext : undefined;

    // Active topology chips are sent as the run's runtime context (not in the
    // message), so the agent reads them for this turn while the stored message
    // stays exactly what the user typed.
    const topologyContext = formatContextBlock(availableContext.filter((i) => activeContextIds.has(i.id)));

    stream.submit(
      { messages: [...toolMessages, newHumanMessage], context },
      {
        streamMode: ['values'],
        streamSubgraphs: true,
        streamResumable: true,
        ...(topologyContext ? { context: { topology_context: topologyContext } } : {}),
        optimisticValues: (prev) => ({
          ...prev,
          context,
          messages: [...(prev.messages ?? []), ...toolMessages, newHumanMessage],
        }),
      },
    );

    setInput('');
    setContentBlocks([]);
  };

  const handleRegenerate = (parentCheckpoint: Checkpoint | null | undefined) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    setFirstTokenReceived(false);
    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ['values'],
      streamSubgraphs: true,
      streamResumable: true,
    });
  };

  const chatStarted = !!threadId || !!messages.length;
  const currentThread = threads.find((t) => t.thread_id === threadId);
  const chatTitle = (currentThread ? storedThreadTitle(currentThread) : undefined) ?? chatTitleFromMessages(messages);
  const hasNoAIOrToolMessages = !messages.find((m) => m.type === 'ai' || m.type === 'tool');

  const handleArchiveCurrent = () => {
    if (!threadId) return;
    archiveThread(threadId)
      .then(() => {
        toast.success('Conversation archived');
        setThreadId(null);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Couldn't archive conversation");
      });
  };

  // Once the first exchange completes, ask the backend to generate a concise
  // title for a thread that doesn't have one yet (best-effort, once per thread).
  const titledThreads = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!threadId || isLoading || titledThreads.current.has(threadId)) return;
    const firstHuman = messages.find((m) => m.type === 'human');
    const hasAi = messages.some((m) => m.type === 'ai');
    if (!firstHuman || !hasAi) return;
    titledThreads.current.add(threadId);
    if (currentThread && storedThreadTitle(currentThread)) return;
    void generateThreadTitle(threadId, getContentString(firstHuman.content));
  }, [threadId, isLoading, messages, currentThread, generateThreadTitle]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <TopologyUrlSync />
      <ParentUrlSync />
      <RenameThreadDialog open={renameOpen} onOpenChange={setRenameOpen} threadId={threadId} initialTitle={chatTitle} />

      <div
        className={cn(
          'grid w-full grid-cols-[1fr_0fr]',
          // Panel open (mobile-first): the diagram/artifact takes the whole width
          // on small screens — no split — and shares the row from md up (more
          // room for the panel on xl).
          rightPanelOpen && 'grid-cols-[0fr_1fr] md:grid-cols-[2fr_2fr] xl:grid-cols-[2fr_3fr]',
          // Fullscreen topology hides the chat column entirely, at every width.
          rightPanelOpen && graphFullscreen && 'grid-cols-[0fr_1fr] md:grid-cols-[0fr_1fr] xl:grid-cols-[0fr_1fr]',
        )}
      >
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-full min-h-0 flex-col">
            {/* Top bar: same structure as the topology header. */}
            <div className="flex items-center justify-between gap-3 border-b p-3">
              <div className="flex min-w-0 items-center gap-2">
                <TooltipIconButton tooltip="Toggle sidebar" onClick={toggleSidebar}>
                  {sidebarVisible ? <PanelLeftClose /> : <PanelLeftOpen />}
                </TooltipIconButton>
                <div className="min-w-0">
                  {chatTitle && (
                    <div className="truncate text-sm font-semibold tracking-tight" title={chatTitle}>
                      {chatTitle}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Topology can be opened from here as well as the sidebar. */}
                {!graphPanelOpen && (
                  <TooltipIconButton tooltip="Home topology" onClick={openTopology}>
                    <Network />
                  </TooltipIconButton>
                )}
                {/* In split view, closing the chat expands the topology to full screen. */}
                {graphPanelOpen && !graphFullscreen && !isMobile && (
                  <TooltipIconButton tooltip="Close chat" onClick={() => setGraphFullscreen(true)}>
                    <XIcon />
                  </TooltipIconButton>
                )}
                {threadId && (
                  <Menu>
                    <MenuTrigger aria-label="Chat options" render={<Button variant="ghost" size="icon" />}>
                      <MoreVertical />
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem onClick={() => setRenameOpen(true)}>
                        <Pencil />
                        Rename
                      </MenuItem>
                      <MenuItem variant="destructive" onClick={handleArchiveCurrent}>
                        <Archive />
                        Archive
                      </MenuItem>
                    </MenuContent>
                  </Menu>
                )}
              </div>
            </div>

            {/* Active session. */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              <StickToBottom className="relative flex-1 overflow-hidden">
                <StickyToBottomContent
                  className={cn(
                    '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 absolute inset-0 overflow-x-hidden overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent',
                    !chatStarted && 'mt-[25vh] flex flex-col items-stretch',
                    chatStarted && 'grid grid-rows-[1fr_auto]',
                  )}
                  contentClassName="pt-8 pb-16 max-w-3xl mx-auto flex flex-col gap-4 w-full"
                  content={
                    <>
                      {messages
                        .filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
                        .map((message, index) =>
                          message.type === 'human' ? (
                            <HumanMessage
                              key={message.id || `${message.type}-${index}`}
                              message={message}
                              isLoading={isLoading}
                            />
                          ) : (
                            <AssistantMessage
                              key={message.id || `${message.type}-${index}`}
                              message={message}
                              isLoading={isLoading}
                              handleRegenerate={handleRegenerate}
                            />
                          ),
                        )}
                      {/* Special rendering case where there are no AI/tool messages, but there is an interrupt.
                    We need to render it outside of the messages list, since there are no messages to render */}
                      {hasNoAIOrToolMessages && !!stream.interrupt && (
                        <AssistantMessage
                          key="interrupt-msg"
                          message={undefined}
                          isLoading={isLoading}
                          handleRegenerate={handleRegenerate}
                        />
                      )}
                      {isLoading && !firstTokenReceived && <AssistantMessageLoading />}
                    </>
                  }
                  footer={
                    <div className="bg-background/90 sticky bottom-0 flex flex-col items-center gap-8 backdrop-blur-sm">
                      {!chatStarted && (
                        <div className="flex flex-col items-center gap-2 text-center">
                          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Terminus</h1>
                          <p className="text-muted-foreground">
                            Ask about your Home Assistant setup, or have it run a scene or automation for you.
                          </p>
                        </div>
                      )}

                      <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />

                      <div
                        ref={dropRef}
                        className={cn(
                          'bg-background/90 relative z-10 mx-auto mb-8 w-full max-w-3xl rounded-2xl shadow-xs backdrop-blur-sm transition-all',
                          dragOver ? 'border-primary border-2 border-dotted' : 'border border-solid',
                        )}
                      >
                        <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
                          <ContextChips
                            items={availableContext}
                            activeIds={activeContextIds}
                            onToggle={toggleContext}
                          />
                          <ContentBlocksPreview blocks={contentBlocks} onRemove={removeBlock} />
                          <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPaste={handlePaste}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.nativeEvent.isComposing) {
                                e.preventDefault();
                                const el = e.target as HTMLElement | undefined;
                                const form = el?.closest('form');
                                form?.requestSubmit();
                              }
                            }}
                            placeholder="Type your message..."
                            className="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                          />

                          <div className="flex items-center gap-6 p-2 pt-4">
                            <Label htmlFor="file-input" className="flex cursor-pointer items-center gap-2">
                              <Plus className="text-muted-foreground size-5" />
                              <span className="text-muted-foreground text-sm">Upload PDF or Image</span>
                            </Label>
                            <input
                              id="file-input"
                              type="file"
                              onChange={handleFileUpload}
                              multiple
                              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                              className="hidden"
                            />
                            {stream.isLoading ? (
                              <Button key="stop" onClick={() => stream.stop()} className="ml-auto">
                                <LoaderCircle className="size-4 animate-spin" />
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                className="ml-auto shadow-md transition-all"
                                disabled={isLoading || (!input.trim() && contentBlocks.length === 0)}
                              >
                                Send
                              </Button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  }
                />
              </StickToBottom>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col border-l">
          <div className="absolute inset-0 flex min-w-[30vw] flex-col">
            {graphPanelOpen ? (
              <GraphPanel />
            ) : (
              <>
                <div className="grid grid-cols-[1fr_auto] border-b p-4">
                  <ArtifactTitle className="truncate overflow-hidden" />
                  <button onClick={closeArtifact} className="cursor-pointer">
                    <XIcon className="size-5" />
                  </button>
                </div>
                <ArtifactContent className="relative flex-grow" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
