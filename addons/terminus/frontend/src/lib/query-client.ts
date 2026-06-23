import { QueryClient } from '@tanstack/react-query';

// Shared QueryClient for the app. This SPA is embedded in an HA ingress iframe,
// so refetch-on-focus would fire on every parent tab switch — disable it.
// Per-query options (refetchInterval, retry, enabled) live at the call sites.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
