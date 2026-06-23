import { useState } from 'react';

import { Info, LoaderCircle, X } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/** Full-canvas centered spinner overlay (e.g. while an automation config loads). */
export function CanvasSpinner() {
  return (
    <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
      <LoaderCircle className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
}

/**
 * Dismissible "run this automation to see its real flow" nudge, shown when an
 * automation has no parsable trace structure. Render with a `key` tied to the
 * automation id so each automation gets its own chance to show the hint.
 */
export function AutomationHint() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <Alert
      variant="default"
      className="bg-card/95 absolute top-3 right-3 left-3 z-10 pr-9 shadow-md backdrop-blur sm:right-auto sm:left-1/2 sm:max-w-md sm:min-w-[20rem] sm:-translate-x-1/2"
    >
      <Info />
      <AlertTitle>Run this automation to see its real flow</AlertTitle>
      <AlertDescription>
        The diagram below is a simplified view. Trigger the automation once so Home Assistant records a trace, then
        refresh to see the actual steps.
      </AlertDescription>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="hover:bg-muted text-muted-foreground absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-md"
      >
        <X className="size-4" />
      </button>
    </Alert>
  );
}
