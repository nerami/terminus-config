import { createBrowserHistory, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';

import { ChatPage } from '@/routes/chat';
import { resolveBasePath } from '@/runtime-config';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ChatPage,
});

// A chat session: the bare thread id appended to the served root. Renders the
// same ChatPage; the id is read from the path via `useThreadId`.
const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$threadId',
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([indexRoute, sessionRoute]);

// Browser (path) history so the server can read the URL. `basepath` is the
// dynamic HA ingress directory, detected at load from the page location.
export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  basepath: resolveBasePath(window.location),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
