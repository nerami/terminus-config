import { cn } from '@/lib/utils';

// Shown beneath the prompt input as a standing reminder that the agent's
// replies — and the smart-home actions it takes — are AI-generated and fallible.
export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn('text-muted-foreground text-center text-xs', className)}>
      AI can make mistakes. Double-check important actions.
    </p>
  );
}
