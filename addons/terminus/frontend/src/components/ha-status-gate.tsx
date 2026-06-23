import { type ReactNode } from 'react';

import { useQuery } from '@tanstack/react-query';

import { StatusCard } from '@/components/status-card';
import { haStatusQueryOptions } from '@/hooks/use-ha-status';

/**
 * Gates the app on a first reply from the backend `/ha/status` endpoint, shown
 * on a fresh load (navigating to Terminus from outside, or a refresh). The
 * loading screen stays up until the request settles — success OR error
 * (`isFetched`) — then the app renders regardless of the outcome (the live
 * status dot takes over from there). Reuses the same query the status indicator
 * polls, so a single request serves both. Internal navigation doesn't remount
 * this, so the loader only shows on a genuine cold start.
 */
export function HaStatusGate({ children }: { children: ReactNode }) {
  const { isFetched } = useQuery(haStatusQueryOptions());

  if (!isFetched) {
    return (
      <StatusCard>
        <h1 className="text-lg font-semibold tracking-tight">Starting Terminus…</h1>
        <p className="text-muted-foreground text-sm">Checking your Home Assistant connection…</p>
      </StatusCard>
    );
  }

  return <>{children}</>;
}
