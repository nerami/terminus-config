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
                ├─ /api/*  (proxy)  → LangGraph dev server :2024   (Plan 2)
                └─ /  (static SPA)  → frontend/dist                (Plan 3)
             langgraph dev (langgraph-cli[inmem] :2024)            (Plan 2)
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
