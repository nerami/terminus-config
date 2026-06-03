import {
  createHashHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router"
import type { Manifest } from "@/types/manifest"
import { SystemMap } from "@/routes/system-map"
import { AutomationView } from "@/routes/automation-view"

export type RouterContext = { manifest: Manifest }

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SystemMap,
})

const autoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auto/$autoId",
  component: AutomationView,
})

export const routeTree = rootRoute.addChildren([indexRoute, autoRoute])

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: { manifest: undefined! },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
