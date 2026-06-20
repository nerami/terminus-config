import { type ReactNode } from 'react';

import { TerminusLogoSVG, type TerminusVariant } from '@/components/icons/terminus/terminus-logo';
import { cn } from '@/lib/utils';

// Centered card shell for full-screen status states (warming up, error).
// Shared by ChatRuntime in providers/stream.tsx and the LoadingScreen story
// so the two can't drift. The logo variant defaults to "wave"; pass "glitch"
// for error states.
export function StatusCard({ children, variant = 'wave' }: { children: ReactNode; variant?: TerminusVariant }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="animate-in fade-in-0 zoom-in-95 bg-background flex max-w-md flex-col items-center gap-4 rounded-lg border p-10 text-center shadow-lg">
        <TerminusLogoSVG
          className={cn('h-8', variant === 'glitch' ? 'text-destructive' : 'text-primary')}
          variant={variant}
        />
        {children}
      </div>
    </div>
  );
}
