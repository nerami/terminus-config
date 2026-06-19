#!/usr/bin/env bash
# Local "Loop A" dev stack for the Terminus add-on: LangGraph + uvicorn + Vite,
# all with hot-reload. One command instead of three terminals.
#
#   cp .env.example .env   # fill in ANTHROPIC_API_KEY (+ HASS_URL/HASS_TOKEN)
#   ./dev.sh
#
# Open the Vite URL (http://localhost:5173). Ctrl-C stops everything.
set -euo pipefail

ADDON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ADDON_DIR/backend"
FRONTEND="$ADDON_DIR/frontend"

log()  { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$*" >&2; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

# --- env -------------------------------------------------------------------
if [ -f "$ADDON_DIR/.env" ]; then
  log "Loading $ADDON_DIR/.env"
  set -a; . "$ADDON_DIR/.env"; set +a
else
  warn "No .env found — copy .env.example to .env and add your keys."
fi
[ -n "${ANTHROPIC_API_KEY:-}" ] || warn "ANTHROPIC_API_KEY is empty — chat will fail."
export LANGGRAPH_URL="http://127.0.0.1:2025"

# --- tooling checks --------------------------------------------------------
command -v uv   >/dev/null || fail "uv not found (see https://docs.astral.sh/uv/getting-started/installation/)."
command -v pnpm >/dev/null || fail "pnpm not found (npm install -g pnpm@10.33.0)."

# --- backend bootstrap -----------------------------------------------------
log "Syncing backend deps via uv"
( cd "$BACKEND" && uv sync --extra dev --extra server )
VENV_BIN="$BACKEND/.venv/bin"

# --- frontend bootstrap ----------------------------------------------------
if [ ! -d "$FRONTEND/node_modules" ]; then
  log "Installing frontend deps (first run)"
  (cd "$FRONTEND" && pnpm install)
fi

# --- local langgraph config (committed one uses container paths) -----------
LG_CONFIG="$(mktemp -t langgraph-dev.XXXXXX.json)"
cat > "$LG_CONFIG" <<JSON
{
  "dependencies": ["$BACKEND"],
  "graphs": { "agent": "$BACKEND/app/agent.py:graph" }
}
JSON

# --- run -------------------------------------------------------------------
pids=()
cleanup() {
  trap - INT TERM EXIT
  log "Shutting down"
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
  rm -f "$LG_CONFIG"
}
trap cleanup INT TERM EXIT

log "LangGraph dev  → http://127.0.0.1:2025"
( cd "$BACKEND" && exec "$VENV_BIN/langgraph" dev \
    --config "$LG_CONFIG" --host 127.0.0.1 --port 2025 --no-browser ) &
pids+=($!)

log "FastAPI (uvicorn --reload) → http://127.0.0.1:8099"
( cd "$BACKEND" && exec "$VENV_BIN/uvicorn" app.web:app \
    --host 127.0.0.1 --port 8099 --reload ) &
pids+=($!)

log "Vite (HMR) → http://localhost:5173   <-- open this"
( cd "$FRONTEND" && exec pnpm dev ) &
pids+=($!)

wait
