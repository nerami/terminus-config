import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHaStatus, type HaConnectionStatus } from '@/hooks/use-ha-status';
import { cn } from '@/lib/utils';

const LABELS: Record<HaConnectionStatus, string> = {
  connecting: 'Connecting…',
  connected: 'Connected',
  disconnected: 'Disconnected',
  auth_failed: 'Authentication failed',
};

const DOT: Record<HaConnectionStatus, string> = {
  connecting: 'bg-amber-400 animate-pulse',
  connected: 'bg-emerald-500',
  disconnected: 'bg-red-500',
  auth_failed: 'bg-red-600',
};

/**
 * A subtle Home Assistant connection indicator for the chat header: a small
 * status dot with a tooltip. Reuses the polling `useHaStatus` hook.
 */
export function HaStatusIndicator() {
  const status = useHaStatus();
  const label = LABELS[status.status] + (status.ha_version ? ` · v${status.ha_version}` : '');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              role="status"
              aria-label={`Home Assistant: ${label}`}
              className="flex size-6 items-center justify-center"
            />
          }
        >
          <span className={cn('size-2 rounded-full', DOT[status.status])} aria-hidden />
        </TooltipTrigger>
        <TooltipContent side="bottom">Home Assistant: {label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
