import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

import { type Message } from '@langchain/langgraph-sdk';
import { useStream } from '@langchain/langgraph-sdk/react';
import {
  uiMessageReducer,
  isUIMessage,
  isRemoveUIMessage,
  type UIMessage,
  type RemoveUIMessage,
} from '@langchain/langgraph-sdk/react-ui';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { useThreads } from './thread';

import { TerminusLogoSVG } from '@/components/icons/terminus/terminus-logo';
import { StatusCard } from '@/components/status-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Switch } from '@/components/ui/switch';
import { useThreadId } from '@/hooks/use-thread-id';
import { getApiKey } from '@/lib/api-key';
import { endpoints, ASSISTANT_ID } from '@/runtime-config';

export type StateType = { messages: Message[]; ui?: UIMessage[] };

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: {
      messages?: Message[] | Message | string;
      ui?: (UIMessage | RemoveUIMessage)[] | UIMessage | RemoveUIMessage;
      context?: Record<string, unknown>;
    };
    CustomEventType: UIMessage | RemoveUIMessage;
  }
>;

type StreamContextType = ReturnType<typeof useTypedStream>;
const StreamContext = createContext<StreamContextType | undefined>(undefined);

async function sleep(ms = 4000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkGraphStatus(apiUrl: string, apiKey: string | null, authScheme?: string): Promise<boolean> {
  try {
    const headers = new Headers();
    if (apiKey) headers.set('X-Api-Key', apiKey);
    if (authScheme) headers.set('X-Auth-Scheme', authScheme);

    const res = await fetch(`${apiUrl}/info`, {
      headers,
    });

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const StreamSession = ({
  apiKey,
  apiUrl,
  assistantId,
  authScheme,
  children,
}: {
  children: ReactNode;
  apiKey: string | null;
  apiUrl: string;
  assistantId: string;
  authScheme?: string;
}) => {
  const [threadId, setThreadId] = useThreadId();
  const { getThreads, setThreads } = useThreads();
  const streamValue = useTypedStream({
    apiUrl,
    apiKey: apiKey ?? undefined,
    assistantId,
    ...(authScheme && {
      defaultHeaders: {
        'X-Auth-Scheme': authScheme,
      },
    }),
    threadId: threadId ?? null,
    fetchStateHistory: true,
    onCustomEvent: (event, options) => {
      if (isUIMessage(event) || isRemoveUIMessage(event)) {
        options.mutate((prev) => {
          const ui = uiMessageReducer(prev.ui ?? [], event);
          return { ...prev, ui };
        });
      }
    },
    onThreadId: (id) => {
      setThreadId(id);
      // Refetch threads list when thread ID changes.
      // Wait for some seconds before fetching so we're able to get the new thread that was created.
      sleep().then(() => getThreads().then(setThreads).catch(console.error));
    },
  });

  return <StreamContext.Provider value={streamValue}>{children}</StreamContext.Provider>;
};

type ReadyStatus = 'checking' | 'ready' | 'error';

// Polls the LangGraph server until it answers, so the UI can show a "warming
// up" state right after an add-on update/restart (the graph server takes a few
// seconds to come up) instead of a one-shot connection error.
function useGraphReady(
  apiUrl: string,
  apiKey: string | null,
  authScheme?: string,
): { status: ReadyStatus; retry: () => void } {
  const [status, setStatus] = useState<ReadyStatus>('checking');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const MAX_ATTEMPTS = 40; // ~80s of polling before giving up
    const INTERVAL_MS = 2000;

    setStatus('checking');
    const tick = async () => {
      const ok = await checkGraphStatus(apiUrl, apiKey, authScheme);
      if (cancelled) return;
      if (ok) {
        setStatus('ready');
        return;
      }
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        setStatus('error');
        return;
      }
      timer = setTimeout(tick, INTERVAL_MS);
    };
    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [apiUrl, apiKey, authScheme, reloadKey]);

  return { status, retry: () => setReloadKey((k) => k + 1) };
}

// Gates the chat on the LangGraph server being reachable, showing a warming-up
// indicator while it starts and a retryable error if it never comes up.
const ChatRuntime = ({
  apiKey,
  apiUrl,
  assistantId,
  authScheme,
  children,
}: {
  children: ReactNode;
  apiKey: string | null;
  apiUrl: string;
  assistantId: string;
  authScheme?: string;
}) => {
  const { retry, status } = useGraphReady(apiUrl, apiKey, authScheme);

  if (status === 'checking') {
    return (
      <StatusCard>
        <h1 className="text-lg font-semibold tracking-tight">Starting Terminus…</h1>
        <p className="text-muted-foreground text-sm">
          The agent server is warming up. This can take a moment right after an update or restart.
        </p>
      </StatusCard>
    );
  }

  if (status === 'error') {
    return (
      <StatusCard variant="glitch">
        <h1 className="text-lg font-semibold tracking-tight">Couldn't reach the agent server</h1>
        <p className="text-muted-foreground text-sm">
          Please ensure the graph is running at <code>{apiUrl}</code> and your API key is correctly set (if connecting
          to a deployed graph).
        </p>
        <Button variant="outline" onClick={retry}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </StatusCard>
    );
  }

  return (
    <StreamSession apiKey={apiKey} apiUrl={apiUrl} assistantId={assistantId} authScheme={authScheme}>
      {children}
    </StreamSession>
  );
};

// Default values for the form
const DEFAULT_API_URL = 'http://localhost:2024';
const DEFAULT_ASSISTANT_ID = 'agent';
const AGENT_BUILDER_AUTH_SCHEME = 'langsmith-api-key';

export const StreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Resolved at runtime from the ingress location: the FastAPI /api proxy and
  // the langgraph graph id. This replaces agent-chat-ui's NEXT_PUBLIC_* vars,
  // so the setup form below is always bypassed.
  const envApiUrl: string | undefined = endpoints().apiUrl;
  const envAssistantId: string | undefined = ASSISTANT_ID;
  const envAuthScheme: string | undefined = undefined;

  // Use URL params with env var fallbacks
  const [apiUrl, setApiUrl] = useQueryState('apiUrl', {
    defaultValue: envApiUrl || '',
  });
  const [assistantId, setAssistantId] = useQueryState('assistantId', {
    defaultValue: envAssistantId || '',
  });
  const [authScheme, setAuthScheme] = useQueryState('authScheme', {
    defaultValue: envAuthScheme || '',
  });
  const [isAgentBuilder, setIsAgentBuilder] = useState(
    () => (authScheme || envAuthScheme || '').toLowerCase() === AGENT_BUILDER_AUTH_SCHEME,
  );

  // For API key, use localStorage with env var fallback
  const [apiKey, _setApiKey] = useState(() => {
    const storedKey = getApiKey();
    return storedKey || '';
  });

  const setApiKey = (key: string) => {
    window.localStorage.setItem('lg:chat:apiKey', key);
    _setApiKey(key);
  };

  // Determine final values to use, prioritizing URL params then env vars
  const finalApiUrl = apiUrl || envApiUrl;
  const finalAssistantId = assistantId || envAssistantId;
  const finalAuthScheme = authScheme || envAuthScheme || '';

  // Show the form if we: don't have an API URL, or don't have an assistant ID
  if (!finalApiUrl || !finalAssistantId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="animate-in fade-in-0 zoom-in-95 bg-background flex max-w-3xl flex-col rounded-lg border shadow-lg">
          <div className="mt-14 flex flex-col gap-2 border-b p-6">
            <div className="flex flex-col items-start gap-2">
              <TerminusLogoSVG className="text-primary h-7" />
              <h1 className="text-xl font-semibold tracking-tight">Terminus</h1>
            </div>
            <p className="text-muted-foreground">
              Welcome to Terminus! Before you get started, you need to enter the URL of the deployment and the assistant
              / graph ID.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const apiUrl = formData.get('apiUrl') as string;
              const assistantId = formData.get('assistantId') as string;
              const apiKey = formData.get('apiKey') as string;

              setApiUrl(apiUrl);
              setApiKey(apiKey);
              setAssistantId(assistantId);
              setAuthScheme(isAgentBuilder ? AGENT_BUILDER_AUTH_SCHEME : '');

              form.reset();
            }}
            className="bg-muted/50 flex flex-col gap-6 p-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="apiUrl">
                Deployment URL<span className="text-rose-500">*</span>
              </Label>
              <p className="text-muted-foreground text-sm">
                This is the URL of your LangGraph deployment. Can be a local, or production deployment.
              </p>
              <Input
                id="apiUrl"
                name="apiUrl"
                className="bg-background"
                defaultValue={apiUrl || DEFAULT_API_URL}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="assistantId">
                Assistant / Graph ID<span className="text-rose-500">*</span>
              </Label>
              <p className="text-muted-foreground text-sm">
                This is the ID of the graph (can be the graph name), or assistant to fetch threads from, and invoke when
                actions are taken.
              </p>
              <Input
                id="assistantId"
                name="assistantId"
                className="bg-background"
                defaultValue={assistantId || DEFAULT_ASSISTANT_ID}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apiKey">LangSmith API Key</Label>
              <p className="text-muted-foreground text-sm">
                This is <strong>NOT</strong> required if using a local LangGraph server. This value is stored in your
                browser's local storage and is only used to authenticate requests sent to your LangGraph server.
              </p>
              <PasswordInput
                id="apiKey"
                name="apiKey"
                defaultValue={apiKey ?? ''}
                className="bg-background"
                placeholder="lsv2_pt_..."
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="agentBuilderEnabled">Built with Agent Builder</Label>
                  <p className="text-muted-foreground text-sm">Enable this for Agent Builder deployments.</p>
                </div>
                <Switch
                  id="agentBuilderEnabled"
                  checked={isAgentBuilder}
                  onCheckedChange={(checked) => setIsAgentBuilder(checked)}
                />
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <Button type="submit" size="lg">
                Continue
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ChatRuntime
      apiKey={apiKey}
      apiUrl={finalApiUrl}
      assistantId={finalAssistantId}
      authScheme={finalAuthScheme || undefined}
    >
      {children}
    </ChatRuntime>
  );
};

// Create a custom hook to use the context
export const useStreamContext = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error('useStreamContext must be used within a StreamProvider');
  }
  return context;
};

export { StreamContext };
