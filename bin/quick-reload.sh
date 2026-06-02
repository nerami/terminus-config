#!/bin/bash
# Fast reload: git pull + homeassistant.reload_all. No backup, no restart.
# Use for package/automation/script/scene/template/helper changes only.
# Still needs full restart for: new integrations, configuration.yaml structure.
#
# Run from HA Advanced SSH / Web Terminal:
#   bash /config/bin/quick-reload.sh

set -euo pipefail

REPO_DIR="/config"

log()  { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

cd "$REPO_DIR" || fail "Cannot cd to $REPO_DIR"

log "Fetching latest from origin"
git fetch --prune origin || fail "git fetch failed."

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse '@{u}')
if [ "$LOCAL" = "$REMOTE" ]; then
  log "Already up to date ($LOCAL). Nothing to reload."
  exit 0
fi

log "Pulling (fast-forward only): $LOCAL → $REMOTE"
git pull --ff-only || fail "git pull --ff-only failed. Dirty tree or non-FF history."

log "Validating config (ha core check)"
if ! ha core check; then
  printf '\n\033[1;31m!! ha core check FAILED — rolling back to %s\033[0m\n' "$LOCAL" >&2
  git reset --hard "$LOCAL" || fail "git reset failed. Manual fix required."
  fail "Rolled back to $LOCAL. Fix config and retry."
fi

log "Reloading (homeassistant.reload_all)"
curl -fsSL -X POST "http://supervisor/core/api/services/homeassistant/reload_all" \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{}' || fail "reload_all call failed."

log "Reload OK — $LOCAL → $(git rev-parse HEAD)"
log "Verify: ha core logs  (or Settings → System → Logs)"
