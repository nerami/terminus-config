import { Component, type ErrorInfo, type ReactNode } from 'react';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

// A region-scoped error state (unlike the full-screen ErrorScreen). It fills its
// parent container so a crash in one pane — a topology renderer, the message
// list, the artifact view — shows a local recoverable error while its siblings
// stay alive.
export function ErrorFallback({
  message,
  onRetry = () => window.location.reload(),
  retryLabel = 'Reload',
  title,
}: {
  title: ReactNode;
  message?: ReactNode;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-destructive text-sm text-balance">{title}</p>
      {message ? <p className="text-muted-foreground text-sm text-pretty">{message}</p> : null}
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-4" />
        {retryLabel}
      </Button>
    </div>
  );
}

// Reusable error boundary that renders the contained ErrorFallback (with a
// per-scenario title/message) instead of the hardcoded full-screen ErrorScreen.
// Retry defaults to a full window reload. Each wrapped region fails
// independently — a thrown render error is caught here; a pending lazy import is
// caught by a Suspense nested inside.
export class RegionErrorBoundary extends Component<
  { children: ReactNode; title: ReactNode; message?: ReactNode; retryLabel?: string },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Terminus region crashed:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return <ErrorFallback title={this.props.title} message={this.props.message} retryLabel={this.props.retryLabel} />;
    }
    return this.props.children;
  }
}
