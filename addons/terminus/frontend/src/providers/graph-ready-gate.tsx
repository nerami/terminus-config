import { type ReactNode } from 'react';

import { useGraphReadyPoll } from './graph-ready';

import { ErrorScreen } from '@/components/error-screen';
import { StatusCard } from '@/components/status-card';

/**
 * The app's environment-readiness membrane: holds first render until the
 * LangGraph server answers, then renders the real app as its children. This is
 * the wall that must be crossed before Terminus is usable — it establishes the
 * precondition (a live backend) that the data-fetching conventions assume, so it
 * is deliberately hand-rolled rather than a react-query consumer.
 *
 * Outside HA (Vite dev against a running backend) the probe succeeds on the
 * first tick, so the gate is an invisible pass-through.
 */
export function GraphReadyGate({
  apiKey,
  apiUrl,
  authScheme,
  children,
}: {
  apiKey: string | null;
  apiUrl: string;
  authScheme?: string;
  children: ReactNode;
}) {
  const { retry, status } = useGraphReadyPoll(apiUrl, apiKey, authScheme);

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
      <ErrorScreen
        title="Couldn't reach the agent server"
        message={
          <>
            Please ensure the graph is running at <code>{apiUrl}</code> and your API key is correctly set (if connecting
            to a deployed graph).
          </>
        }
        onRetry={retry}
        retryLabel="Retry"
      />
    );
  }

  return <>{children}</>;
}
