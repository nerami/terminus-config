# Terminus LangChain

A Home Assistant local add-on that serves an agent chat UI backed by a local
LangChain / LangGraph agent (Anthropic). The chat UI is a port of
[`langchain-ai/agent-chat-ui`](https://github.com/langchain-ai/agent-chat-ui)
rebuilt as a Vite + Tanstack Router single-page app.

## Architecture

One add-on, two processes behind a single Home Assistant ingress port (`8099`):

```
HA Ingress ─▶ FastAPI (uvicorn :8099)            ── public face
                ├─ GET /ha/status   → HA websocket connection status
                ├─ /api/*  (proxy)  → LangGraph dev server :2025   (Plan 2)
                └─ /  (static SPA)  → frontend/dist                (Plan 3)
             langgraph dev (langgraph-cli[inmem] :2025)            (Plan 2)
                └─ graph "agent" = create_agent(ChatAnthropic, tools=[ha_basic_info])
```

- In the Supervisor, the backend connects to Core via
  `ws://supervisor/core/websocket` authenticated with `SUPERVISOR_TOKEN`
  (`homeassistant_api: true`).
- The Anthropic API key is injected into the LangGraph process only; it never
  reaches the browser.

## Options

| Option | Type | Description |
| --- | --- | --- |
| `anthropic_api_key` | password | Anthropic API key for the agent. |
| `model` | str | Claude model id (default `claude-sonnet-4-6`). |
| `ha_url` | str? | Dev only: HA URL when running outside the Supervisor. |
| `ha_token` | password? | Dev only: long-lived access token for `ha_url`. |

## Development

### Quick start

Run the whole local stack (LangGraph + uvicorn `--reload` + Vite HMR) with one
command, then open the Vite URL:

```bash
cp .env.example .env      # add ANTHROPIC_API_KEY (+ HASS_URL/HASS_TOKEN)
./dev.sh                  # LangGraph :2025 + uvicorn :8099 + Vite :5173, hot-reload
# open http://localhost:5173   (Ctrl-C stops everything)
```

First run bootstraps the backend venv and `pnpm install`; later runs go straight
to the servers. `dev.sh` generates a LangGraph config with local paths (the
committed `langgraph.json` uses in-container `/app/backend` paths — see Gotchas).

The manual steps below are what `dev.sh` runs under the hood.

Backend:

```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -e ".[dev,server]"
# point at a real HA instance for the websocket status:
export HASS_URL=https://your-ha:8123 HASS_TOKEN=<long-lived-token>
export ANTHROPIC_API_KEY=<key>
pytest                       # run the test suite
uvicorn app.web:app --port 8099 --reload
```

Frontend:

```bash
cd frontend
pnpm install
pnpm dev                     # Vite dev server (proxies /ha and /api to :8099)
```

## Deploy

Use the existing repo scripts, e.g. `bin/deploy-addons-ssh.sh`, then install
**Terminus LangChain** from the local add-on store and set the Anthropic key.

After source changes (version unchanged) rebuild on device:
`ha apps rebuild local_terminus`.

### Gotchas (learned the hard way)

- **Base image tag must be `{python}-alpine{alpine}`, never bare `{python}`.**
  `ghcr.io/home-assistant/{arch}-base-python:3.12` does **not** exist — the
  build dies at metadata resolution (`not found`) before any layer runs. Pin a
  real published tag in `build.yaml` *and* the Dockerfile `ARG BUILD_FROM`
  default. Newest available is `3.12-alpine3.18` (no `3.13` yet). List tags:
  ```bash
  TOKEN=$(curl -s "https://ghcr.io/token?scope=repository:home-assistant/aarch64-base-python:pull" | jq -r .token)
  curl -s -H "Authorization: Bearer $TOKEN" https://ghcr.io/v2/home-assistant/aarch64-base-python/tags/list | jq -r '.tags[]' | grep '^3.12-'
  ```

- **`langgraph.json` graph paths must be absolute.** `langgraph dev` resolves
  relative paths against the process **cwd**, not the `--config` directory.
  `run.sh` runs from `/data/langgraph` (checkpoint scratch dir), so a relative
  `./app/agent.py` resolves to `/data/langgraph/app/agent.py` and fails with
  `GraphLoadError`. Use `/app/backend/...` absolute paths instead.

- **This runs the LangGraph *dev* (in-memory) server**, not a production
  deployment. Thread history is not durable across rebuilds — `cd /data/langgraph`
  only persists the `.langgraph_api` scratch dir. Swap to LangSmith Deployment
  if persistence matters.
