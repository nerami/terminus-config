# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Terminus is the custom Home Assistant frontend panel that visualises the parent repo's automations as a React Flow graph. It is a self-contained subproject inside the HA config repo — the parent `CLAUDE.md` at the repo root covers HA YAML conventions and on-device deploy; this file covers the terminus build only.

Deferred ideas and known follow-ups live in `BACKLOG.md` — check it before proposing new features so you do not re-litigate decisions that are already parked.

## Commands

**Always use `pnpm`** — `pnpm-lock.yaml` is the lockfile and `pnpm-workspace.yaml` exists. Never `npm` or `yarn`.

```bash
pnpm install          # first time / after dep changes
pnpm dev              # vite dev server (mounts into #root from index.html)
pnpm build            # tsc -b && vite build → ../../../www/terminus-dashboard/{index.js,style.css,graph.json}
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint .
pnpm test             # vitest watch
pnpm test:run         # vitest run (CI/one-shot)
pnpm test:run path/to/file.test.ts            # single file
pnpm test:run -t "substring of test name"      # filter by name
```

After `pnpm build`, run `../../../bin/deploy-www-ssh.sh` to rsync `../../../www/terminus-dashboard/` to the device — `www/` and `public/graph.json` are gitignored (build artifacts). Commit only `src/` changes.

## Architecture

### Build-time manifest bake

`vite-plugin-graph.ts` is a custom Vite plugin that runs in `buildStart` and `configureServer`. It:

1. Globs `packages/*.yaml`, `automations.yaml`, `scripts.yaml`, `scenes.yaml` from `repoRoot` (defaults to `..` — the HA config repo root).
2. Parses each YAML with source-line tracking, collects entity refs by walking `trigger`/`condition`/`action`/`sequence` keys (handles HA 2024.10+ plural `triggers`/`conditions`/`actions`).
3. Builds two graph layouts via `@dagrejs/dagre`:
   - **System map** (rankdir `LR`): all automations + entities + scripts + scenes, written to `manifest.nodes` / `manifest.edges`.
   - **Per-automation flow** (rankdir `TB`): one focused DAG per automation, written to `manifest.automations[id].flowNodes` / `flowEdges`.
4. Writes the merged `Manifest` to `public/graph.json`. Vite then copies it into the bundle at `../www/terminus-dashboard/graph.json`.

The dev server watches the YAML sources and triggers a full reload on change. **There is no runtime YAML parsing in the browser** — the manifest is frozen at build time. After editing automations, rebuild to refresh the graph.

### Browser-side panel lifecycle

`src/main.tsx` defines a `<terminus-panel>` custom element. HA's `panel_custom` integration instantiates it inside HA's chrome (declared in repo-root `configuration.yaml`).

**Shadow DOM is mandatory.** Tailwind v4 preflight (`@layer base`) cascades into HA's body/font/button styles otherwise. The custom element opens a shadow root, injects `<link rel="stylesheet" href="/local/terminus-dashboard/style.css">`, then mounts React into a host `<div>` inside the shadow. Any change that touches Tailwind layers, CSS injection, or the panel mount path needs manual verification inside HA — vitest does not catch the bleed-through.

Production reuses HA's existing auth: `window.hassConnection` (a `Promise<{ conn }>` exposed on the parent window) is awaited in `src/lib/ha.ts`. `pnpm dev` runs outside HA so it falls back to long-lived token from `.env` (`VITE_HA_URL`, `VITE_HA_TOKEN`). `.env` is gitignored.

### Routing & rendering

- Hash router (`src/lib/router.ts`) — `useSyncExternalStore` over `hashchange`. Two routes: `#/` (system map) and `#/auto/<id>` (per-automation drill-in). No history API, no router lib.
- `SystemMap.tsx` renders the LR layout with all baked node positions.
- `AutomationView.tsx` renders the TB layout for one automation; right-side panel shows raw trigger/condition/action JSON.
- `LiveStateProvider` (`src/lib/liveState.tsx`) subscribes via `home-assistant-js-websocket` and pushes entity state into context. Node components (`src/components/nodes/*.tsx`) read live state via `useEntityState(entityId)` / `useAutomationEnabled(autoId)` to render status badges over the static graph.

### Node handle direction

Each node component (`AutomationNode`, `EntityNode`, `ScriptNode`, `SceneNode`) accepts `data.direction?: "LR" | "TB"` and swaps `Handle` positions accordingly (Left/Right for LR system map, Top/Bottom for TB automation view). When adding a new node type or a third layout, follow this same pattern — handle position must match the dagre `rankdir` of whatever view renders it, or edges route awkwardly.

### Area inference

`src/lib/area.ts` derives `AreaId` (`mb` / `lr` / `abi` / `common` / `system`) from entity-id prefix (`mb_`, `lr_`, `abi_`). Used for the colored left border on every node. Aliases match the parent repo's convention (MB = Master Bedroom, LR = Living Room, Abi = daughter's room).

### Manifest staleness banner

`App.tsx` checks `manifest.generatedAt` and shows an amber banner when older than 7 days, prompting a rebuild + deploy. The check is purely informational — the panel still renders.

## Conventions

- Path alias `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).
- shadcn/ui components live in `src/components/ui/` and follow shadcn conventions. `components.json` is the shadcn config.
- Tests use vitest + `@testing-library/react` + happy-dom. Test files sit next to source (`*.test.ts(x)`).
- Bundle output path (`../../../www/terminus-dashboard`) is load-bearing — HA serves `/local/` from `<repo>/www/`, and `panel_custom`'s `module_url: /local/terminus-dashboard/index.js` depends on it. Don't change `build.outDir` without updating `configuration.yaml`.
- Vite lib mode does NOT inline `process.env.NODE_ENV`. The `define` in `vite.config.ts` replaces it manually so React's dev/prod switch does not throw `ReferenceError` in the browser. Keep that define when touching build config.
