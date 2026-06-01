# Terminus Copilot — HA Add-on

CopilotKit runtime for the Terminus panel. Exposes `POST /api/copilotkit` over HA Ingress on port 3000. Holds the Anthropic API key; the browser never sees it.

## Install (local add-on)

1. SSH into the HA Green: `ssh root@terminus.tanuki-mirzam.ts.net -p 22222`.
2. Confirm `addons/terminus-copilot/` is present at the config repo root (deploy via the repo's normal flow — `git push` then `bin/deploy-ssh.sh`).
3. In HA: Settings → Add-ons → Add-on Store → ⋮ → Local add-ons → "Terminus Copilot" → Install.
4. Open the add-on, Configuration tab, paste the Anthropic API key from `secrets.yaml: anthropic_api_key`. Save.
5. Start the add-on. Watch the log: should see `terminus-copilot listening on :3000`.
6. Reload the Terminus panel. The sidebar opens against the running runtime.

## Dev (local laptop)

```bash
cd addons/terminus-copilot
pnpm install
ANTHROPIC_API_KEY=sk-... pnpm dev
# server on http://localhost:3000
# point the terminus dev panel at it via VITE_COPILOT_RUNTIME_URL
```

## Tests

```bash
pnpm test:run        # vitest
pnpm typecheck       # tsc --noEmit
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness probe — returns `{ok:true}`. |
| POST | `/api/copilotkit` | CopilotKit GraphQL/SSE endpoint. |

## Security

- Anthropic key lives in add-on options (`/data/options.json`, root-readable).
- Ingress provides same-origin HA auth. No public port.
- Runtime is stateless. No DB, no logs of prompts.
