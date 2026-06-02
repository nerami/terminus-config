#!/bin/bash
# Sync local-addon sources from the repo into Supervisor's /addons/ tree
# and reload the add-on index. Run from the HA Advanced SSH add-on:
#   bash /config/bin/deploy-addons.sh
#
# Source: /config/addons/<dir>/   (tracked in git)
# Target: /addons/<dir>/          (Supervisor's local-addon repository)
#
# After sync + reload, Supervisor sees changes:
#   - New add-on  → install with:  ha addons install local_<slug>
#   - Existing    → rebuild with:  ha addons rebuild local_<slug>
#                   then restart:  ha addons restart local_<slug>
#
# Intentionally NO --delete: never nuke a manually-installed local add-on
# that lives outside the repo. Remove stale dirs manually if needed.
#
# Standalone usage OR called by deploy.sh after a successful git pull.

set -euo pipefail

SRC="/config/addons"
DST="/addons"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

if [ ! -d "$SRC" ]; then
  log "No $SRC directory — nothing to sync."
  exit 0
fi

if [ -z "$(ls -A "$SRC" 2>/dev/null)" ]; then
  log "$SRC is empty — nothing to sync."
  exit 0
fi

command -v rsync >/dev/null || fail "rsync not found in PATH."
command -v ha    >/dev/null || fail "ha CLI not found — run inside the SSH add-on."

log "Syncing $SRC/ → $DST/"
rsync -a \
  --exclude 'node_modules/' \
  --exclude '.git/' \
  --exclude 'dist/' \
  --exclude 'build/' \
  --exclude '__pycache__/' \
  --exclude '*.log' \
  "$SRC/" "$DST/" || fail "rsync failed."

log "Reloading Supervisor add-on index"
ha addons reload || fail "ha addons reload failed."

log "Sync OK. Installed local add-ons:"
ha addons 2>/dev/null | awk '/^- /{flag=0} /slug: local_/{print "  " $2; flag=1}' || true

cat <<'EOF'

Next steps (manual — depends on what changed):
  New add-on:        ha addons install  local_<slug>
                     ha addons start    local_<slug>
  Config changed:    ha addons restart  local_<slug>
  Dockerfile/src:    ha addons rebuild  local_<slug>   # slow
EOF
