#!/usr/bin/env bash
# Local dev stack for terminus-rag: backend (uvicorn :9000) + Vite (:63743),
# both with reload. One command instead of two terminals.
#
#   cp .env.example .env   # fill in HASS_URL / HASS_TOKEN
#   ./dev.sh
#
# Open the Vite URL (http://localhost:63743). Ctrl-C stops everything.
set -euo pipefail

ADDON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ADDON_DIR/backend"
FRONTEND="$ADDON_DIR/frontend"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$*" >&2; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

if [ -f "$ADDON_DIR/.env" ]; then
  log "Loading $ADDON_DIR/.env"
  set -a; . "$ADDON_DIR/.env"; set +a
else
  warn "No .env found — copy .env.example to .env and add HASS_URL/HASS_TOKEN."
fi
[ -n "${HASS_TOKEN:-}" ] || warn "HASS_TOKEN is empty — the index cannot warm."

# Backend bind port. Defaults to the add-on contract (:9000); override via
# DEV_BACKEND_PORT in .env when something else holds 9000 (e.g. a local
# langfuse-clickhouse stack). The Vite proxy reads the same var.
BACKEND_PORT="${DEV_BACKEND_PORT:-9000}"

command -v uv   >/dev/null || fail "uv not found (https://docs.astral.sh/uv/)."
command -v pnpm >/dev/null || fail "pnpm not found (npm install -g pnpm@10.33.0)."

log "Syncing backend deps via uv"
( cd "$BACKEND" && uv sync --extra dev )

if [ ! -d "$FRONTEND/node_modules" ]; then
  log "Installing frontend deps (first run)"
  ( cd "$FRONTEND" && pnpm install )
fi

pids=()
cleanup() {
  trap - INT TERM EXIT
  log "Shutting down"
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
}
trap cleanup INT TERM EXIT

log "Backend (uvicorn --reload) → http://127.0.0.1:$BACKEND_PORT"
( cd "$BACKEND" && exec uv run uvicorn app.main:app --host 127.0.0.1 --port "$BACKEND_PORT" --reload ) &
pids+=($!)

log "Vite (HMR) → http://localhost:63743   <-- open this"
( cd "$FRONTEND" && exec pnpm dev ) &
pids+=($!)

wait
