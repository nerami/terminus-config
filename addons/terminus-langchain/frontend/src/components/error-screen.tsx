import { type ReactNode } from 'react';

import { RefreshCw } from 'lucide-react';

import { StatusCard } from '@/components/status-card';
import { Button } from '@/components/ui/button';

// Full-screen error state, reused by the agent-server connection error
// (providers/stream.tsx) and the chat error boundary (components/error-boundary.tsx).
// Centralising it keeps the two from drifting and gives every error state the
// same glitch-logo card + a single recovery action.
export function ErrorScreen({
  message,
  onRetry,
  retryLabel = 'Reload',
  title = 'Something went wrong',
}: {
  title?: ReactNode;
  message?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <StatusCard variant="glitch">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      {message ? <p className="text-muted-foreground text-sm">{message}</p> : null}
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" />
          {retryLabel}
        </Button>
      ) : null}
    </StatusCard>
  );
}
