# Terminus RAG — sidebar navigation (mirror the Terminus add-on)

**Date:** 2026-06-24
**Branch:** `feat/terminus-rag-theme-dev` (folds into PR #25)
**Status:** Approved design

## Goal

Replace the terminus-rag playground's hand-rolled two-column `<aside>` layout
with the same shadcn **sidebar** approach the Terminus add-on uses, so the two
add-ons share UI structure (now that they also share the theme — PR #25). Scope
is the **sidebar shell only**: the existing `useState`/`fetch` data layer is
unchanged (no jotai / react-query adoption).

## Background

Terminus's approach has three layers:

1. `components/ui/sidebar.tsx` — the shadcn sidebar primitive (base-ui /
   base-nova): `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`,
   `SidebarHeader/Content/Footer`, `SidebarGroup`, `SidebarMenu*`, rail, mobile
   `Sheet` drawer, cookie-persisted open state.
2. `components/sidebar/app-sidebar.tsx` — the app-specific composition.
3. The route wraps `<SidebarProvider><AppSidebar/><SidebarInset>…</SidebarInset></SidebarProvider>`.

terminus-rag already shares the base: `components.json` (base-nova / mist),
`@base-ui/react@^1.2.0`, `cn`, `button`, `input`, and (via PR #25) the sidebar
color tokens. It is missing the sidebar primitive and four transitive ui deps.

## Architecture / files

### Port verbatim from terminus (identical base — exact mirror)

| File | Why |
|---|---|
| `components/ui/sidebar.tsx` | the primitive |
| `components/ui/sheet.tsx` | mobile drawer used by the primitive |
| `components/ui/separator.tsx` | used by the primitive |
| `components/ui/skeleton.tsx` | used by the primitive (`SidebarMenuSkeleton`) |
| `components/ui/tooltip.tsx` | collapsed-rail tooltips |
| `hooks/use-mobile.ts` | drives the mobile drawer breakpoint |

These import only from `@base-ui/react/*`, `@/components/ui/button`, and
`@/lib/utils` (`cn`) — all present in terminus-rag. They copy without edits.

**Not ported:** `sidebar-session-list.tsx` (LangGraph threads, dropdown-menu,
sonner — terminus-specific). terminus-rag renders its tools directly as
`SidebarMenu` items instead.

### New: `components/sidebar/app-sidebar.tsx`

Modeled on terminus's `app-sidebar.tsx`. `<Sidebar variant="inset">` with:

- **Header** — a lucide icon + "Terminus RAG" title. (Terminus shows its logo +
  `terminus_version` from `useHaStatus`; terminus-rag has no logo and `/health`
  exposes no version, so icon + title.)
- **Content** — one `SidebarGroup` (`min-h-0 flex-1`) with `SidebarGroupLabel`
  "Tools" and a `SidebarMenu`; each tool is a `SidebarMenuItem` >
  `SidebarMenuButton isActive={selected === tool.name} onClick={() => onSelect(tool.name)}`.
  This replaces the `ToolList` component.
- **Footer** — `SidebarFooter` showing index status (`status · indexed ·
  model`), moved out of the old page header (mirrors terminus's footer slot).

Props: `{ tools: ToolDef[]; selected: string | null; onSelect: (name: string) =>
void; health: Health | null }`. No data fetching inside — stays a presentational
component fed by `App`.

### Refactor: `App.tsx`

Mirror the chat route's composition:

```tsx
<SidebarProvider>
  <AppSidebar tools={tools} selected={selected} onSelect={setSelected} health={health} />
  <SidebarInset>
    <header className="flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <h1 className="text-sm font-semibold">Terminus RAG Playground</h1>
    </header>
    <div className="flex flex-col gap-4 p-6">
      {loadError ? <alert/> : (current && <SchemaForm/>)}
      <ResultView/>
    </div>
  </SidebarInset>
</SidebarProvider>
```

- The `tools`/`selected`/`result`/`health`/`loadError` state and the `run()`
  handler are unchanged.
- The old `<aside>` + `grid grid-cols-[16rem_1fr]` is removed; the sidebar owns
  tool selection now.
- `components/ToolList.tsx` is **deleted** (superseded). It has no test file.

### Removed

- `components/ToolList.tsx`

## Data flow

Unchanged from today: `App` fetches tools (`getTools`) + `/health` on mount,
holds `selected` in `useState`, passes `tools/selected/onSelect/health` down to
`AppSidebar`; selecting a tool re-renders `SchemaForm` (keyed by tool name);
submitting calls `callTool` → `ResultView`. The sidebar is purely presentational.

## Error handling

`loadError` (tools failed to load) renders the existing alert inside
`SidebarInset` instead of the old `<main>`. The sidebar still renders (empty
tool menu). Health fetch failure → `health` is null → footer hides the status
line (same null-guard as today's header).

## Testing (TDD)

- `components/sidebar/app-sidebar.test.tsx` (mirror terminus's): renders a tool
  list, clicking a tool calls `onSelect`, the selected tool has active state,
  footer shows status when `health` present and hides it when null. Wrap in
  `SidebarProvider` (the primitive throws without it — a known terminus story
  gotcha).
- `components/sidebar/app-sidebar.stories.tsx`: a render story under
  `SidebarProvider`.
- Update `App.test.tsx` for the new layout (tool appears in sidebar, selecting
  shows the form).
- Gates: `pnpm typecheck`, `pnpm test:run`, `pnpm build`, `pnpm build-storybook`.

## Release

No new version bump. PR #25 already bumps `0.2.0 → 0.3.0` (unreleased), so add a
"Sidebar navigation" bullet to the existing `0.3.0` CHANGELOG entry.

## Out of scope (YAGNI)

- react-query / jotai adoption (data layer stays useState/fetch).
- Porting `sidebar-session-list`, settings menu, what's-new, breadcrumbs.
- Persisting selected tool to the URL.
