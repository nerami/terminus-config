import React from 'react';

import { ErrorBoundary } from '@/components/error-boundary';
import { HaStatusGate } from '@/components/ha-status-gate';
import { HtmlFontSize } from '@/components/html-font-size';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ArtifactProvider } from '@/components/thread/artifact';
import { Thread } from '@/components/thread/thread';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { WhatsNewDialog } from '@/components/whats-new/whats-new-dialog';
import { StreamProvider } from '@/providers/stream';
import { ThreadProvider } from '@/providers/thread';

// Ported from agent-chat-ui's app/page.tsx (the only change is SSR -> SPA:
// default export -> named, no "use client").
export function ChatPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading (layout)...</div>}>
      <HtmlFontSize />
      <Toaster />
      <HaStatusGate>
        <WhatsNewDialog />
        <ThreadProvider>
          <StreamProvider>
            <ArtifactProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="min-w-0 overflow-hidden">
                  <ErrorBoundary>
                    <Thread />
                  </ErrorBoundary>
                </SidebarInset>
              </SidebarProvider>
            </ArtifactProvider>
          </StreamProvider>
        </ThreadProvider>
      </HaStatusGate>
    </React.Suspense>
  );
}
