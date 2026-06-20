import { type ReactNode, useEffect, useState } from 'react';

import { StatusCard } from '@/components/status-card';
import { endpoints } from '@/runtime-config';

/**
 * Gates the app on a first reply from the backend `/ha/status` endpoint, shown
 * on a fresh load (navigating to Terminus from outside, or a refresh). The
 * loading screen stays up until the request settles — success OR error — then
 * the app renders regardless of the outcome (the live status dot takes over from
 * there). Internal navigation doesn't remount this, so the loader only shows on
 * a genuine cold start.
 */
export function HaStatusGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch(endpoints().haStatusUrl)
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <StatusCard>
        <h1 className="text-lg font-semibold tracking-tight">Starting Terminus…</h1>
        <p className="text-muted-foreground text-sm">Checking your Home Assistant connection…</p>
      </StatusCard>
    );
  }

  return <>{children}</>;
}
