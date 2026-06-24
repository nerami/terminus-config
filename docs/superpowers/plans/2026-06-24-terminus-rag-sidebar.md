# Terminus RAG Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the terminus-rag playground's hand-rolled `<aside>` tool list with the same shadcn sidebar the Terminus add-on uses (sidebar shell only; data layer unchanged).

**Architecture:** Port terminus's `ui/sidebar` primitive + its four transitive ui deps + `use-mobile` hook verbatim, build a terminus-rag-specific `app-sidebar.tsx` that renders the MCP tools as `SidebarMenu` items, and wrap `App.tsx` in `SidebarProvider`/`SidebarInset`. `App` keeps owning tool/health state (useState/fetch); the sidebar is presentational.

**Tech Stack:** React 19, Vite, Tailwind v4, shadcn (base-nova/mist), `@base-ui/react@^1.2.0`, vitest + Testing Library, Storybook 10.

## Global Constraints

- Work on branch `feat/terminus-rag-theme-dev` (folds into PR #25). All paths below are relative to `addons/terminus-rag/frontend/` unless noted.
- **No new version bump.** PR #25 already bumps `config.yaml` `0.2.0 → 0.3.0` (unreleased). Add a bullet to the existing `0.3.0` `CHANGELOG.md` entry.
- Port files are copied **verbatim** from `addons/terminus/frontend/` — do not edit them. `button.tsx`, `input.tsx`, and `lib/utils.ts` are already byte-identical between the two add-ons, so the primitives compile unchanged.
- Package manager is **pnpm@10.33.0** (`pnpm install --frozen-lockfile` in Docker). No new dependencies are needed — `@base-ui/react`, `class-variance-authority`, `lucide-react`, `clsx`, `tailwind-merge` are all already present.
- Run all `pnpm` commands from `addons/terminus-rag/frontend/`.

---

### Task 1: Port the sidebar ui primitives + use-mobile hook

Verbatim copies from the Terminus add-on. The deliverable is "the primitives type-check and build in terminus-rag." No new tests here (these are upstream shadcn components; they're exercised via Task 2/3).

**Files:**
- Create: `src/components/ui/sidebar.tsx` (copy of terminus's)
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/separator.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/tooltip.tsx`
- Create: `src/hooks/use-mobile.ts`

**Interfaces:**
- Produces: from `@/components/ui/sidebar` — `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` (props: `{ isActive?: boolean; tooltip?: string | TooltipContentProps } & button props`), `useSidebar`. From `@/hooks/use-mobile` — `useIsMobile()`.

- [ ] **Step 1: Copy the six files verbatim**

Run (from repo root, i.e. `addons/terminus-rag/frontend/`'s grandparent — adjust if your cwd differs):

```bash
cd addons/terminus-rag/frontend
SRC=../../terminus/frontend
cp "$SRC/src/components/ui/sidebar.tsx"   src/components/ui/sidebar.tsx
cp "$SRC/src/components/ui/sheet.tsx"      src/components/ui/sheet.tsx
cp "$SRC/src/components/ui/separator.tsx"  src/components/ui/separator.tsx
cp "$SRC/src/components/ui/skeleton.tsx"   src/components/ui/skeleton.tsx
cp "$SRC/src/components/ui/tooltip.tsx"    src/components/ui/tooltip.tsx
mkdir -p src/hooks
cp "$SRC/src/hooks/use-mobile.ts"          src/hooks/use-mobile.ts
```

- [ ] **Step 2: Type-check to verify the port resolves**

Run: `pnpm typecheck`
Expected: PASS (exit 0, no errors). If it fails on a missing `@/components/ui/*` import, a transitive dep was missed — re-check the import list of the failing file against Step 1.

- [ ] **Step 3: Build to verify Tailwind/Vite compile the new components**

Run: `pnpm build`
Expected: PASS — `dist/` written, no Vite/tsc errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/sidebar.tsx src/components/ui/sheet.tsx src/components/ui/separator.tsx src/components/ui/skeleton.tsx src/components/ui/tooltip.tsx src/hooks/use-mobile.ts
git commit -m "feat(terminus-rag): port shadcn sidebar ui primitives from terminus"
```

---

### Task 2: Build the AppSidebar component (TDD)

**Files:**
- Modify: `src/lib/api.ts` (add the exported `Health` type)
- Create: `src/components/sidebar/app-sidebar.tsx`
- Test: `src/components/sidebar/app-sidebar.test.tsx`
- Create: `src/components/sidebar/app-sidebar.stories.tsx`

**Interfaces:**
- Consumes: `@/components/ui/sidebar` exports (Task 1); `ToolDef` from `@/lib/api`.
- Produces: `Health` type (`{ status?: string; indexed?: number; model?: string }`) exported from `@/lib/api`; `AppSidebar` component with props `{ tools: ToolDef[]; selected: string | null; onSelect: (name: string) => void; health: Health | null }`.

- [ ] **Step 1: Export the `Health` type from `api.ts`**

Add to `src/lib/api.ts` (next to the other exported types, after `CallResult`):

```ts
export type Health = { status?: string; indexed?: number; model?: string };
```

- [ ] **Step 2: Write the failing test**

Create `src/components/sidebar/app-sidebar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { AppSidebar } from './app-sidebar';

import { SidebarProvider } from '@/components/ui/sidebar';
import type { ToolDef } from '@/lib/api';

const tools: ToolDef[] = [
  { name: 'list_kinds', description: 'Kinds and counts', inputSchema: { type: 'object', properties: {} } },
  { name: 'search_ha', description: 'Semantic search', inputSchema: { type: 'object', properties: {} } },
];

function renderSidebar(props: Partial<React.ComponentProps<typeof AppSidebar>> = {}) {
  const onSelect = vi.fn();
  render(
    <SidebarProvider>
      <AppSidebar tools={tools} selected="list_kinds" onSelect={onSelect} health={null} {...props} />
    </SidebarProvider>,
  );
  return { onSelect };
}

test('renders each tool as a menu item', () => {
  renderSidebar();
  expect(screen.getByText('list_kinds')).toBeInTheDocument();
  expect(screen.getByText('search_ha')).toBeInTheDocument();
});

test('clicking a tool calls onSelect with its name', async () => {
  const { onSelect } = renderSidebar();
  await userEvent.click(screen.getByText('search_ha'));
  expect(onSelect).toHaveBeenCalledWith('search_ha');
});

test('marks the selected tool active and the others inactive', () => {
  renderSidebar({ selected: 'search_ha' });
  expect(screen.getByText('search_ha').closest('[data-active]')).not.toBeNull();
  expect(screen.getByText('list_kinds').closest('[data-active]')).toBeNull();
});

test('shows the index status in the footer when health is present', () => {
  renderSidebar({ health: { status: 'ok', indexed: 2, model: 'bge' } });
  expect(screen.getByText(/ok · 2 indexed · bge/)).toBeInTheDocument();
});

test('hides the status line when health is null', () => {
  renderSidebar({ health: null });
  expect(screen.queryByText(/indexed/)).not.toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test:run src/components/sidebar/app-sidebar.test.tsx`
Expected: FAIL — `Failed to resolve import "./app-sidebar"` (component not created yet).

- [ ] **Step 4: Write the AppSidebar component**

Create `src/components/sidebar/app-sidebar.tsx`:

```tsx
import { Boxes } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Health, ToolDef } from '@/lib/api';

type Props = {
  tools: ToolDef[];
  selected: string | null;
  onSelect: (name: string) => void;
  health: Health | null;
};

/**
 * The playground sidebar: a brand header, the MCP tool list as the primary
 * navigation, and an index-status footer. Mirrors the Terminus add-on's
 * app-sidebar (logo header / menu / footer) adapted for the tool console. The
 * component is presentational — `App` owns the tool + health state.
 */
export function AppSidebar({ tools, selected, onSelect, health }: Props) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <div className="flex items-center gap-2 px-2">
          <Boxes className="text-primary h-5 w-5" />
          <span className="font-heading text-sm font-semibold">Terminus RAG</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="min-h-0 flex-1">
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarMenu>
            {tools.map((tool) => (
              <SidebarMenuItem key={tool.name}>
                <SidebarMenuButton
                  isActive={selected === tool.name}
                  onClick={() => onSelect(tool.name)}
                  tooltip={tool.description}
                  className="font-mono"
                >
                  <span>{tool.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {health && (
        <SidebarFooter>
          <div className="text-muted-foreground px-2 py-1 font-mono text-[10px] leading-tight">
            {health.status} · {health.indexed} indexed · {health.model}
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test:run src/components/sidebar/app-sidebar.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 6: Add a Storybook story**

Create `src/components/sidebar/app-sidebar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppSidebar } from './app-sidebar';

import { SidebarProvider } from '@/components/ui/sidebar';
import type { ToolDef } from '@/lib/api';

const tools: ToolDef[] = [
  { name: 'list_kinds', description: 'Kinds and counts', inputSchema: { type: 'object', properties: {} } },
  { name: 'search_ha', description: 'Semantic search over the registry', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_history', description: 'State history for an entity', inputSchema: { type: 'object', properties: {} } },
];

const meta: Meta<typeof AppSidebar> = {
  title: 'Sidebar/AppSidebar',
  component: AppSidebar,
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AppSidebar>;

export const Default: Story = {
  args: { tools, selected: 'search_ha', health: { status: 'ok', indexed: 128, model: 'bge-small-en-v1.5' }, onSelect: () => {} },
};

export const NoHealth: Story = {
  args: { tools, selected: 'list_kinds', health: null, onSelect: () => {} },
};
```

- [ ] **Step 7: Verify the story compiles**

Run: `pnpm build-storybook`
Expected: PASS — Storybook static build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/lib/api.ts src/components/sidebar/app-sidebar.tsx src/components/sidebar/app-sidebar.test.tsx src/components/sidebar/app-sidebar.stories.tsx
git commit -m "feat(terminus-rag): add AppSidebar (tools as sidebar menu)"
```

---

### Task 3: Wire AppSidebar into App.tsx; delete ToolList

**Files:**
- Modify: `src/App.tsx` (replace `<main>`/`<aside>` layout with `SidebarProvider`/`SidebarInset`)
- Modify: `src/App.test.tsx` (update for the new layout)
- Delete: `src/components/ToolList.tsx`

**Interfaces:**
- Consumes: `AppSidebar` (Task 2); `SidebarProvider`, `SidebarInset`, `SidebarTrigger` from `@/components/ui/sidebar` (Task 1); `Health` from `@/lib/api` (Task 2).

- [ ] **Step 1: Update the App test for the new layout**

Replace `src/App.test.tsx` with (the only change vs. today is the trigger/heading assertion — selecting a tool by its visible name still works):

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import App from './App';

afterEach(() => vi.restoreAllMocks());

const tools = [
  { name: 'list_kinds', description: 'Kinds and counts', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'search_ha',
    description: 'Semantic search',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
  },
];

test('loads tools into the sidebar, runs the selected one, and shows the result', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tools }) }) // getTools
    .mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'ok', indexed: 2, model: 'bge' }) }) // ./health
    .mockResolvedValueOnce({ ok: true, json: async () => ({ result: [{ kind: 'entity', count: 2 }] }) }); // callTool
  vi.stubGlobal('fetch', fetchMock);

  render(<App />);

  // The playground title renders in the inset header.
  expect(screen.getByText(/terminus rag playground/i)).toBeInTheDocument();

  // Tools load into the sidebar.
  await waitFor(() => expect(screen.getByText('list_kinds')).toBeInTheDocument());

  // list_kinds has no args; select it and run.
  await userEvent.click(screen.getByText('list_kinds'));
  await userEvent.click(screen.getByRole('button', { name: /run/i }));

  await waitFor(() => expect(screen.getByText(/"kind": "entity"/)).toBeInTheDocument());
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:run src/App.test.tsx`
Expected: FAIL — no element matches `/terminus rag playground/i` as the inset header doesn't exist yet (App still renders the old `<main>` with an `<h1>` of the same text, so this may PASS on the title line but the goal is to confirm the suite runs; if it already passes, proceed — Step 3 is still required to change the layout).

> Note: the title text is unchanged, so this test may pass against the old layout too. That's fine — it's a regression guard. The real change is structural (Step 3).

- [ ] **Step 3: Rewrite App.tsx with the sidebar layout**

Replace `src/App.tsx` with:

```tsx
import { useEffect, useMemo, useState } from 'react';

import { callTool, getTools, type Health, type ToolDef } from '@/lib/api';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ResultView, type ResultState } from '@/components/ResultView';
import { SchemaForm } from '@/components/SchemaForm';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function App() {
  const [tools, setTools] = useState<ToolDef[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState>({ status: 'idle' });
  const [health, setHealth] = useState<Health | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getTools()
      .then((t) => {
        setTools(t);
        setSelected((s) => s ?? t[0]?.name ?? null);
      })
      .catch((e) => setLoadError(String(e)));
    fetch('./health')
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const current = useMemo(() => tools.find((t) => t.name === selected) ?? null, [tools, selected]);

  async function run(args: Record<string, unknown>) {
    if (!current) return;
    setResult({ status: 'loading' });
    try {
      const value = await callTool(current.name, args);
      setResult({ status: 'done', value });
    } catch (e) {
      setResult({ status: 'done', value: { error: String(e) } });
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar tools={tools} selected={selected} onSelect={setSelected} health={health} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold">Terminus RAG Playground</h1>
        </header>
        <div className="flex flex-col gap-4 p-6">
          {loadError ? (
            <div role="alert" className="border-destructive/40 bg-destructive/10 text-destructive rounded border p-3 text-sm">
              Failed to load tools: {loadError}
            </div>
          ) : (
            current && <SchemaForm key={current.name} schema={current.inputSchema} onSubmit={run} />
          )}
          <ResultView state={result} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

- [ ] **Step 4: Delete the superseded ToolList component**

Run: `git rm src/components/ToolList.tsx`

- [ ] **Step 5: Run the full test suite + typecheck**

Run: `pnpm test:run && pnpm typecheck`
Expected: PASS — all tests green (App + AppSidebar + existing ResultView/SchemaForm), no type errors. If a test still imports `ToolList`, remove that import (there is no `ToolList.test.tsx`, so none should).

- [ ] **Step 6: Build to confirm the app compiles**

Run: `pnpm build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat(terminus-rag): use AppSidebar layout in App; drop ToolList"
```

---

### Task 4: Changelog + final gates

**Files:**
- Modify: `addons/terminus-rag/CHANGELOG.md` (add a bullet to the existing `0.3.0` entry)

- [ ] **Step 1: Add the changelog bullet**

In `addons/terminus-rag/CHANGELOG.md`, under the existing `## 0.3.0` heading, add as the first bullet (before "Playground theme"):

```markdown
- **Sidebar navigation.** The playground now uses the same shadcn sidebar as
  the Terminus add-on: tools live in a collapsible sidebar (with a mobile
  drawer and an index-status footer) instead of the old fixed left column.
```

- [ ] **Step 2: Run every gate from `addons/terminus-rag/frontend/`**

Run:
```bash
pnpm typecheck && pnpm test:run && pnpm build && pnpm build-storybook
```
Expected: all PASS — typecheck clean, all tests green, Vite build + Storybook build succeed.

- [ ] **Step 3: Confirm frozen-lockfile still holds (no dep drift)**

Run: `CI=true npx pnpm@10.33.0 install --frozen-lockfile`
Expected: "Lockfile is up to date" / "Already up to date" (no new deps were added).

- [ ] **Step 4: Commit**

```bash
git add addons/terminus-rag/CHANGELOG.md
git commit -m "docs(terminus-rag): note sidebar navigation in 0.3.0 changelog"
```

- [ ] **Step 5: Push (updates PR #25)**

```bash
git push
```

---

## Verification checklist (whole feature)

- [ ] Sidebar primitives copied verbatim (no edits) and type-check.
- [ ] `AppSidebar` renders tools as menu items, selects on click, marks active, shows/hides footer status.
- [ ] `App.tsx` uses `SidebarProvider`/`SidebarInset`; `ToolList.tsx` deleted.
- [ ] Data layer unchanged (useState/fetch); no react-query/jotai introduced.
- [ ] No new npm dependencies; frozen-lockfile passes.
- [ ] `0.3.0` changelog has the sidebar bullet; no new version bump.
- [ ] `pnpm typecheck`, `test:run`, `build`, `build-storybook` all green.
