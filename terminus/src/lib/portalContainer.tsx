import { createContext, useContext, type ReactNode } from "react"

const Ctx = createContext<HTMLElement | null>(null)

export function PortalContainerProvider({
  container,
  children,
}: {
  container: HTMLElement | null
  children: ReactNode
}) {
  return <Ctx.Provider value={container}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortalContainer(): HTMLElement | null {
  return useContext(Ctx)
}
