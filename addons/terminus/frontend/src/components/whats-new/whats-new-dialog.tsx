import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { TerminusLogoSVG } from '@/components/brand/terminus-logo/terminus-logo';
import { MarkdownText } from '@/components/thread/markdown-text';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChangelog } from '@/hooks/use-changelog';
import { useHaStatus } from '@/hooks/use-ha-status';

/** localStorage key holding the last add-on version whose changelog was shown. */
export const LAST_SEEN_KEY = 'terminus:whats-new:last-seen';

// `getOnInit` so the stored value is read synchronously on first render — the
// trigger logic must distinguish "first ever run" (null) from "already seen this
// version" on the very first effect, not after an async hydration.
export const lastSeenVersionAtom = atomWithStorage<string | null>(LAST_SEEN_KEY, null, undefined, {
  getOnInit: true,
});

/**
 * A dismissable "what's new" dialog. Pops once per upgrade: when the running
 * add-on version differs from the last one we showed and the backend has a
 * changelog section for it. A fresh install (no stored version) is silently
 * recorded, so the dialog only ever appears after an actual upgrade.
 */
export function WhatsNewDialog() {
  const { terminus_version: version } = useHaStatus();
  const { data: changelog } = useChangelog();
  const [lastSeen, setLastSeen] = useAtom(lastSeenVersionAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!version) return;
    if (lastSeen === null) {
      // First run of this feature: remember where we are, don't announce.
      setLastSeen(version);
      return;
    }
    if (version !== lastSeen && changelog?.version === version) {
      setOpen(true);
    }
  }, [version, lastSeen, changelog, setLastSeen]);

  const dismiss = () => {
    setOpen(false);
    if (version) setLastSeen(version);
  };

  if (!open || !changelog) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">What's new in Terminus {changelog.version}</DialogTitle>
          <div className="flex flex-col items-center gap-1 pt-2 pb-1">
            <div className="flex items-baseline gap-1.5">
              <TerminusLogoSVG variant="phosphor" className="text-primary h-6" />
              <span className="text-muted-foreground font-mono text-[10px] leading-none">
                v{changelog.version}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">What's new</span>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto text-sm">
          <MarkdownText>{changelog.markdown}</MarkdownText>
        </div>

        <DialogFooter>
          <Button onClick={dismiss}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
