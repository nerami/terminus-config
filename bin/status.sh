#!/bin/bash
# Show HA core info, last deploy SHA, config watcher status.
# Run from the HA Advanced SSH add-on shell:
#   bash /config/bin/status.sh

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

log "HA Core"
ha core info 2>/dev/null | grep -E 'version|state' || echo "(unavailable)"

log "Last deploy"
git -C /config log -1 --format="%h  %ai  %s" 2>/dev/null || echo "(no git history)"

log "Config watcher"
/config/bin/watcher.sh status 2>/dev/null || echo "(unavailable)"
