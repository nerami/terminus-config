import { useState } from 'react';

import { Info, LoaderCircle, SearchX, X } from 'lucide-react';

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
      className="bg-card/95 absolute right-3 bottom-3 left-3 z-10 pr-9 shadow-md backdrop-blur sm:right-auto sm:left-1/2 sm:max-w-md sm:min-w-[20rem] sm:-translate-x-1/2"
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

const NOT_FOUND_COPY: Record<'automation' | 'scene' | 'area', { body: string; back: string }> = {
  automation: { body: 'This automation no longer exists — it may have been deleted.', back: 'Back to automations' },
  scene: { body: 'This scene no longer exists — it may have been deleted.', back: 'Back to scenes' },
  area: { body: 'This area no longer exists — it may have been deleted.', back: 'Back to areas' },
};

/** Full-canvas error shown when the URL targets an entity absent from topology. */
export function CanvasNotFound({ kind, onBack }: { kind: 'automation' | 'scene' | 'area'; onBack: () => void }) {
  const copy = NOT_FOUND_COPY[kind];
  return (
    <div className="bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center backdrop-blur-sm">
      <SearchX className="text-muted-foreground size-10" />
      <p className="text-muted-foreground max-w-xs text-sm">{copy.body}</p>
      <button
        type="button"
        onClick={onBack}
        className="border-border hover:bg-muted cursor-pointer border px-3 py-1.5 text-sm font-medium shadow-sm"
      >
        {copy.back}
      </button>
    </div>
  );
}
