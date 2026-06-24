#!/bin/bash
# Laptop-side watcher: rsync YAML changes from main/ → /config/ on device.
# Device watcher (watcher.sh) detects the new mtimes and triggers reload_all.
# Both must be running for end-to-end hot-reload.
#
# Requires: fswatch (brew install fswatch)
#
# Usage:
#   bin/sync-watch.sh           — watch + sync on change
#   bin/sync-watch.sh --once    — one-shot sync then exit (useful after git pull)
#
# Override SSH target via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/sync-watch.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"
DEBOUNCE=1  # seconds of quiet before syncing

log() { printf '%s [sync] %s\n' "$(date '+%H:%M:%S')" "$*"; }

RSYNC_EXCLUDES=(
  --exclude="node_modules/"
  --exclude=".git/"
  --exclude="secrets.yaml"
  --exclude="*.db"
  --exclude="*.log*"
  --exclude=".storage/"
  --exclude="deps/"
  --exclude="tts/"
  --exclude=".HA_VERSION"
  --exclude=".uuid"
  --exclude="known_devices.yaml"
  --exclude="ip_bans.yaml"
)

do_sync() {
  rsync -az --delete \
    "${RSYNC_EXCLUDES[@]}" \
    -e "ssh -p $HA_SSH_PORT" \
    "$REPO_ROOT/main/" \
    "$HA_SSH_HOST:/config/" \
  && log "synced" \
  || log "ERROR: rsync failed (device reachable?)"
}

check_device_watcher() {
  local status
  status=$(ssh -p "$HA_SSH_PORT" "$HA_SSH_HOST" "/config/bin/watcher.sh status" 2>/dev/null | head -1) || return 1
  if [[ "$status" != running* ]]; then
    log "WARN: device watcher not running — start it with: bin/watcher-ssh.sh start"
  else
    log "device watcher: $status"
  fi
}

# ── one-shot mode ──────────────────────────────────────────────────────────────
if [ "${1:-}" = "--once" ]; then
  log "one-shot sync: $REPO_ROOT/main/ → $HA_SSH_HOST:/config/"
  do_sync
  exit 0
fi

# ── watch mode ─────────────────────────────────────────────────────────────────
if ! command -v fswatch &>/dev/null; then
  echo "ERROR: fswatch not found. Install: brew install fswatch" >&2
  exit 1
fi

log "starting — $REPO_ROOT/main/ → $HA_SSH_HOST:/config/"
log "Ctrl-C to stop"

check_device_watcher || log "WARN: could not reach device to check watcher status"

log "initial sync..."
do_sync

# fswatch → debounced rsync
# Inner read -t drains rapid-fire events; syncs once quiet for DEBOUNCE seconds.
fswatch -r \
  -e "node_modules" \
  -e "\.git" \
  -e "\.db$" \
  -e "\.log" \
  -e "secrets\.yaml" \
  -i "\.yaml$" \
  "$REPO_ROOT/main/" \
| while IFS= read -r _event; do
    while IFS= read -r -t "$DEBOUNCE" _; do :; done
    log "change detected — syncing"
    do_sync
  done
