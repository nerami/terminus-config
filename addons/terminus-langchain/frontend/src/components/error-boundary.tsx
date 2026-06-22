import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorScreen } from '@/components/error-screen';

// A render error anywhere in the chat tree (e.g. a malformed interrupt payload)
// would otherwise unmount the whole app with no way back. This boundary catches
// it, shows the shared ErrorScreen, and offers a full-page reload to recover.
// Hand-rolled (React 19 supports class boundaries natively) to avoid adding a
// dependency and busting the pnpm dep-cache layer.
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Terminus chat crashed:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="Terminus hit a snag"
          message="Something in the chat broke. Reloading should get you back."
          onRetry={() => window.location.reload()}
          retryLabel="Reload"
        />
      );
    }
    return this.props.children;
  }
}
