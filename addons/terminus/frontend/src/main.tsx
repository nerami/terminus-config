// Restore the iframe location from the parent (HA) URL hash BEFORE the router is
// imported/evaluated. Must stay the first import.
import './lib/parent-url-restore';
// Then fall back to the localStorage checkpoint if the URL is still blank.
import './lib/navigation-checkpoint-restore';

import { StrictMode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { createRoot } from 'react-dom/client';

import { queryClient } from './lib/query-client';
import { router } from './router';
import '@fontsource-variable/inter';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </QueryClientProvider>
      </JotaiProvider>
    </ThemeProvider>
  </StrictMode>,
);
