# CLAUDE.md

Terminus is the pnpm workspace for the HA config repo's TypeScript subprojects. Parent `AGENTS.md` covers HA YAML conventions and on-device deploy; this file covers the Terminus workspace only.

```
terminus/
  apps/dashboard/   @terminus/dashboard — custom HA panel (Vite/React/React Flow)
  apps/agent/       @terminus/agent     — LangGraph.js agent (laptop-hosted, Express)
```

**Always use `pnpm`** — `pnpm-lock.yaml` is the workspace lockfile. Never `npm` or `yarn`.

```bash
# from terminus/
pnpm install                              # install all workspace deps
pnpm build                                # build @terminus/dashboard only
pnpm --filter @terminus/dashboard <cmd>   # run any script in dashboard
pnpm --filter @terminus/agent <cmd>       # run any script in agent
pnpm -r test                              # run tests across all apps
pnpm --filter @terminus/dashboard test:run  # single app, one-shot
pnpm -r typecheck                         # typecheck all apps
```

---

## Dashboard (`apps/dashboard/`)

Custom HA panel — visualises automations as a React Flow graph. Registered via `panel_custom` in repo-root `configuration.yaml`, served from `/local/terminus-dashboard/`.

Deferred ideas live in `apps/dashboard/BACKLOG.md` — check before proposing new features.

### Commands

```bash
pnpm dev              # vite dev server (uses .env: VITE_HA_URL, VITE_HA_TOKEN)
pnpm build            # tsc -b && vite build → www/terminus-dashboard/{index.js,style.css,graph.json}
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint .
pnpm test             # vitest watch
pnpm test:run         # vitest run (CI/one-shot)
```

After `pnpm build`, deploy with `bin/build-deploy-terminus-ssh.sh` (builds + rsyncs in one step) or `bin/deploy-www-ssh.sh` (rsync only). `www/` and `public/graph.json` are gitignored — commit only `src/` changes.

### Architecture

**Build-time manifest bake** — `vite-plugin-graph.ts` runs at build/dev-start. It globs `packages/*.yaml`, `automations.yaml`, `scripts.yaml`, `scenes.yaml` from `repoRoot` (`../../..` from the app dir = `main/`), parses YAML with source-line tracking, builds two dagre layouts (system map LR + per-automation TB), and writes `public/graph.json`. No runtime YAML parsing in the browser — manifest is frozen at build time. After editing automations, rebuild to refresh the graph.

**Shadow DOM is mandatory.** Tailwind v4 preflight cascades into HA's styles otherwise. The `<terminus-panel>` custom element opens a shadow root, injects the stylesheet, then mounts React inside. Changes to Tailwind layers or CSS injection need manual verification inside HA — vitest won't catch bleed-through.

**Auth** — production awaits `window.hassConnection` (exposed by HA on the parent window, `src/lib/ha.ts`). Dev falls back to `.env` (`VITE_HA_URL`, `VITE_HA_TOKEN`). `.env` is gitignored.

**Routing** — hash router (`src/lib/router.ts`), `useSyncExternalStore` over `hashchange`. Routes: `#/` (system map), `#/auto/<id>` (per-automation drill-in).

**Node handle direction** — every node component accepts `data.direction?: "LR" | "TB"` and swaps `Handle` positions to match dagre `rankdir`. Follow this pattern for any new node type.

**Area inference** — `src/lib/area.ts` derives `AreaId` (`mb`/`lr`/`abi`/`common`/`system`) from entity-id prefix. Drives the colored left border on nodes.

### Conventions

- **File naming: kebab-case only.** No PascalCase, camelCase, or snake_case. `my-component.tsx`, not `MyComponent.tsx`; `live-state.ts`, not `liveState.ts`. New files must follow this — existing files are already kebab-case.
- Path alias `@/*` → `src/*` (vite.config.ts + tsconfig.app.json).
- shadcn/ui components in `src/components/ui/`, follow shadcn conventions (`components.json`).
- Tests: vitest + `@testing-library/react` + happy-dom. Test files next to source (`*.test.ts(x)`).
- `build.outDir` (`../../../www/terminus-dashboard`) is load-bearing — matches `module_url` in `configuration.yaml`. Don't change without updating both.
- Vite lib mode does NOT inline `process.env.NODE_ENV` — the `define` in `vite.config.ts` replaces it manually. Keep it when touching build config.

---

## Agent (`apps/agent/`)

LangGraph.js agent — laptop-hosted Express server, called by Terminus Copilot add-on over LAN.

### Commands

```bash
pnpm dev    # tsx --env-file=.env src/index.ts (hot reload)
pnpm build  # tsc → dist/
pnpm start  # node dist/index.js (production)
```

Copy `.env.example` → `.env` and fill in:

```
ANTHROPIC_API_KEY=
HASS_SERVER=https://terminus.tanuki-mirzam.ts.net
HASS_TOKEN=
REPO_ROOT=/Users/zrmn/Documents/home-assistant/main
PORT=3001
```

### Network

Runs on laptop, reachable from HA device via **LAN IP only** — the SSH add-on runs in Docker bridge networking and cannot reach Tailscale peers (100.x.x.x). Set `terminus_agent_url` in the Terminus Copilot add-on options to `http://<laptop-LAN-IP>:3001`. Get LAN IP: `ipconfig getifaddr en0`.

Health check: `GET /health` → `{ ok: true }`.

### Architecture

Entry: `src/index.ts` (Express server). Graph: `src/graph.ts` (LangGraph state machine). Agent logic: `src/agent.ts`.

Tools (`src/tools/`):
- `ha-api.ts` — read/write HA entity state + call services via REST
- `ha-config.ts` — read/write `packages/*.yaml` automation config files
- `ha-git.ts` — commit and push config changes to the repo
