import React from 'react';

import { Thread } from '@/components/thread';
import { ArtifactProvider } from '@/components/thread/artifact';
import { Toaster } from '@/components/ui/sonner';
import { StreamProvider } from '@/providers/Stream';
import { ThreadProvider } from '@/providers/Thread';

// Ported from agent-chat-ui's app/page.tsx (the only change is SSR -> SPA:
// default export -> named, no "use client").
export function ChatPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading (layout)...</div>}>
      <Toaster />
      <ThreadProvider>
        <StreamProvider>
          <ArtifactProvider>
            <Thread />
          </ArtifactProvider>
        </StreamProvider>
      </ThreadProvider>
    </React.Suspense>
  );
}
