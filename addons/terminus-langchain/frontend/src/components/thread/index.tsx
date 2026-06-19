import { v4 as uuidv4 } from "uuid";
import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useStreamContext } from "@/providers/Stream";
import { useState, FormEvent } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { AssistantMessage, AssistantMessageLoading } from "./messages/ai";
import { HumanMessage } from "./messages/human";
import {
  DO_NOT_RENDER_ID_PREFIX,
  ensureToolCallsHaveResponses,
} from "@/lib/ensure-tool-responses";
import { TerminusLogoSVG } from "../icons/terminus";
import { TooltipIconButton } from "./tooltip-icon-button";
import { HaStatusIndicator } from "./ha-status-indicator";
import {
  ArrowDown,
  LoaderCircle,
  SquarePen,
  XIcon,
  Plus,
  Network,
} from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  graphFullscreenAtom,
  graphPanelOpenAtom,
  graphViewAtom,
  selectedNodeAtom,
  topologyAtom,
} from "@/lib/ha-graph/atoms";
import { contextItems, formatContextBlock } from "@/lib/chat-context";
import { ContextChips } from "./ContextChips";
import { GraphPanel } from "../graph/GraphPanel";
import { TopologyUrlSync } from "../graph/TopologyUrlSync";
import { ParentUrlSync } from "../ParentUrlSync";
import { useQueryState, parseAsBoolean } from "nuqs";
import { useThreadId } from "@/hooks/use-thread-id";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ThreadHistory from "./history";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ContentBlocksPreview } from "./ContentBlocksPreview";
import {
  useArtifactOpen,
  ArtifactContent,
  ArtifactTitle,
  useArtifactContext,
} from "./artifact";

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const context = useStickToBottomContext();
  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={props.className}
    >
      <div
        ref={context.contentRef}
        className={props.contentClassName}
      >
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
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

export function Thread() {
  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();
  const [graphPanelOpen, setGraphPanelOpen] = useAtom(graphPanelOpenAtom);
  const [graphFullscreen, setGraphFullscreen] = useAtom(graphFullscreenAtom);
  const setGraphView = useSetAtom(graphViewAtom);

  // The topology diagram and the artifact panel share the right column, so
  // opening one closes the other. The chat itself is unaffected either way.
  const rightPanelOpen = artifactOpen || graphPanelOpen;
  const toggleGraphPanel = () =>
    setGraphPanelOpen((prev) => {
      const next = !prev;
      // A fresh open from the toolbar always starts at the areas overview; a
      // restore from the URL opens via TopologyUrlSync instead (keeping its view).
      if (next) {
        closeArtifact();
        setGraphView({ kind: "areas" });
      } else {
        // Leaving the panel always exits fullscreen so the chat comes back.
        setGraphFullscreen(false);
      }
      return next;
    });

  const [threadId, _setThreadId] = useThreadId();
  const [chatTab, setChatTab] = useState<"session" | "history">("session");
  const [hideToolCalls, setHideToolCalls] = useQueryState(
    "hideToolCalls",
    parseAsBoolean.withDefault(false),
  );
  const [input, setInput] = useState("");
  const {
    contentBlocks,
    setContentBlocks,
    handleFileUpload,
    dropRef,
    removeBlock,
    resetBlocks: _resetBlocks,
    dragOver,
    handlePaste,
  } = useFileUpload();
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  // Home-topology context the user can attach to a message via chips.
  const graphView = useAtomValue(graphViewAtom);
  const selectedNode = useAtomValue(selectedNodeAtom);
  const topology = useAtomValue(topologyAtom);
  const [inactiveContextIds, setInactiveContextIds] = useState<Set<string>>(
    new Set(),
  );
  const availableContext = contextItems(graphView, selectedNode, topology);
  const activeContextIds = new Set(
    availableContext
      .filter((i) => !inactiveContextIds.has(i.id))
      .map((i) => i.id),
  );
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
      toast.error("An error occurred. Please try again.", {
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
      messages[messages.length - 1].type === "ai"
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim().length === 0 && contentBlocks.length === 0) || isLoading)
      return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        ...(input.trim().length > 0 ? [{ type: "text", text: input }] : []),
        ...contentBlocks,
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    const context =
      Object.keys(artifactContext).length > 0 ? artifactContext : undefined;

    // Active topology chips are sent as the run's runtime context (not in the
    // message), so the agent reads them for this turn while the stored message
    // stays exactly what the user typed.
    const topologyContext = formatContextBlock(
      availableContext.filter((i) => activeContextIds.has(i.id)),
    );

    stream.submit(
      { messages: [...toolMessages, newHumanMessage], context },
      {
        streamMode: ["values"],
        streamSubgraphs: true,
        streamResumable: true,
        ...(topologyContext
          ? { context: { topology_context: topologyContext } }
          : {}),
        optimisticValues: (prev) => ({
          ...prev,
          context,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    setInput("");
    setContentBlocks([]);
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    setFirstTokenReceived(false);
    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ["values"],
      streamSubgraphs: true,
      streamResumable: true,
    });
  };

  const chatStarted = !!threadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <TopologyUrlSync />
      <ParentUrlSync />

      <div
        className={cn(
          "grid w-full grid-cols-[1fr_0fr] transition-all duration-500",
          // Open: equal split on large screens, give the panel more room on xl.
          rightPanelOpen && "grid-cols-[2fr_2fr] xl:grid-cols-[2fr_3fr]",
          // Fullscreen topology hides the chat column entirely.
          rightPanelOpen &&
            graphFullscreen &&
            "grid-cols-[0fr_1fr] xl:grid-cols-[0fr_1fr]",
        )}
      >
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Tabs
            value={chatTab}
            onValueChange={(v) => setChatTab(v as "session" | "history")}
            className="flex h-full min-h-0 flex-col gap-0"
          >
            {/* 1. Top bar: the logo (always) + actions. */}
            <div className="z-10 flex min-h-[52px] items-center justify-between gap-3 p-2">
              <div className="flex items-center gap-3">
                <button
                  className="flex cursor-pointer items-center"
                  aria-label="New chat"
                  onClick={() => {
                    setThreadId(null);
                    setChatTab("session");
                  }}
                >
                  <TerminusLogoSVG className="h-6" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <TooltipIconButton
                  tooltip="Home topology"
                  variant="ghost"
                  onClick={toggleGraphPanel}
                >
                  <Network className="size-5" />
                </TooltipIconButton>
                <HaStatusIndicator />
                <TooltipIconButton
                  size="lg"
                  className="p-4"
                  tooltip="New thread"
                  variant="ghost"
                  onClick={() => {
                    setThreadId(null);
                    setChatTab("session");
                  }}
                >
                  <SquarePen className="size-5" />
                </TooltipIconButton>
              </div>
            </div>

            {/* 2. Tabs navigation. */}
            <div className="px-2 pb-2">
              <TabsList>
                <TabsTrigger value="session">Session</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </div>

            {/* 3. Tabs container. */}
            <TabsContent
              value="session"
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <StickToBottom className="relative flex-1 overflow-hidden">
            <StickyToBottomContent
              className={cn(
                "absolute inset-0 overflow-x-hidden overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent",
                !chatStarted && "mt-[25vh] flex flex-col items-stretch",
                chatStarted && "grid grid-rows-[1fr_auto]",
              )}
              contentClassName="pt-8 pb-16 max-w-3xl mx-auto flex flex-col gap-4 w-full"
              content={
                <>
                  {messages
                    .filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
                    .map((message, index) =>
                      message.type === "human" ? (
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
                  {isLoading && !firstTokenReceived && (
                    <AssistantMessageLoading />
                  )}
                </>
              }
              footer={
                <div className="sticky bottom-0 flex flex-col items-center gap-8">
                  {!chatStarted && (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome to Terminus
                      </h1>
                      <p className="text-muted-foreground">
                        Ask about your Home Assistant setup, or have it run a
                        scene or automation for you.
                      </p>
                    </div>
                  )}

                  <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />

                  <div
                    ref={dropRef}
                    className={cn(
                      "bg-muted relative z-10 mx-auto mb-8 w-full max-w-3xl rounded-2xl shadow-xs transition-all",
                      dragOver
                        ? "border-primary border-2 border-dotted"
                        : "border border-solid",
                    )}
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2"
                    >
                      <ContextChips
                        items={availableContext}
                        activeIds={activeContextIds}
                        onToggle={toggleContext}
                      />
                      <ContentBlocksPreview
                        blocks={contentBlocks}
                        onRemove={removeBlock}
                      />
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            !e.metaKey &&
                            !e.nativeEvent.isComposing
                          ) {
                            e.preventDefault();
                            const el = e.target as HTMLElement | undefined;
                            const form = el?.closest("form");
                            form?.requestSubmit();
                          }
                        }}
                        placeholder="Type your message..."
                        className="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                      />

                      <div className="flex items-center gap-6 p-2 pt-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="render-tool-calls"
                              checked={hideToolCalls ?? false}
                              onCheckedChange={(checked) => setHideToolCalls(checked)}
                            />
                            <Label
                              htmlFor="render-tool-calls"
                              className="text-muted-foreground text-sm"
                            >
                              Hide Tool Calls
                            </Label>
                          </div>
                        </div>
                        <Label
                          htmlFor="file-input"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Plus className="text-muted-foreground size-5" />
                          <span className="text-muted-foreground text-sm">
                            Upload PDF or Image
                          </span>
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
                          <Button
                            key="stop"
                            onClick={() => stream.stop()}
                            className="ml-auto"
                          >
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="ml-auto shadow-md transition-all"
                            disabled={
                              isLoading ||
                              (!input.trim() && contentBlocks.length === 0)
                            }
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
            </TabsContent>

            <TabsContent
              value="history"
              className="min-h-0 flex-1 overflow-hidden p-2"
            >
              <ThreadHistory onThreadSelect={() => setChatTab("session")} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="relative flex flex-col border-l">
          <div className="absolute inset-0 flex min-w-[30vw] flex-col">
            {graphPanelOpen ? (
              <GraphPanel />
            ) : (
              <>
                <div className="grid grid-cols-[1fr_auto] border-b p-4">
                  <ArtifactTitle className="truncate overflow-hidden" />
                  <button
                    onClick={closeArtifact}
                    className="cursor-pointer"
                  >
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
