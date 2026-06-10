/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

export function ThemeProvider({
  children,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  // The theme always follows the OS color scheme — there is no manual override.
  // The resolved class drives two kinds of rules that need different anchors:
  //   - `:host(.dark)` (our design tokens) needs the class on the shadow HOST.
  //   - `:is(.dark *)` (Tailwind `dark:` variant — used by our utilities and by
  //     CopilotKit) only matches a `.dark` ancestor *inside* the shadow tree,
  //     which the host is not.
  // So toggle the class on the in-shadow wrapper (wrapperRef) AND, when shadowed,
  // the host (themeTargetRef). In the light DOM both resolve to the same element.
  const wrapperRef = React.useRef<HTMLElement | null>(null)
  const themeTargetRef = React.useRef<HTMLElement | null>(null)

  const applyTheme = React.useCallback(() => {
    const resolvedTheme = getSystemTheme()
    const restoreTransitions = disableTransitionOnChange
      ? disableTransitionsTemporarily()
      : null

    const targets = new Set<HTMLElement>()
    if (wrapperRef.current) targets.add(wrapperRef.current)
    if (themeTargetRef.current) targets.add(themeTargetRef.current)
    targets.add(document.documentElement)
    for (const t of targets) {
      t.classList.remove("light", "dark")
      t.classList.add(resolvedTheme)
    }

    if (restoreTransitions) {
      restoreTransitions()
    }
  }, [disableTransitionOnChange])

  React.useEffect(() => {
    applyTheme()

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme()
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [applyTheme])

  const value = React.useMemo<ThemeProviderState>(
    () => ({
      theme: "system",
    }),
    []
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div
        ref={(el) => {
          if (!el) {
            wrapperRef.current = null
            themeTargetRef.current = null
            return
          }
          // This wrapper is the in-shadow ancestor of all panel content, so it
          // carries the class for `:is(.dark *)`. In a shadow root, also target
          // the host for `:host(.dark)` token rules.
          wrapperRef.current = el
          const rootNode = el.getRootNode()
          themeTargetRef.current =
            rootNode instanceof ShadowRoot ? (rootNode.host as HTMLElement) : el
          applyTheme()
        }}
        style={{ display: "contents" }}
      >
        {children}
      </div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    // Degrade gracefully when rendered without a provider (isolated tests,
    // standalone embeds) instead of crashing. The app always wraps with
    // ThemeProvider, so this default only applies outside it.
    return { theme: "system" as Theme }
  }

  return context
}
