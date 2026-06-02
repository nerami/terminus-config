#!/bin/bash
# Show HA core info, local addon states, last deploy SHA, config watcher status.
# Run from the HA Advanced SSH add-on shell:
#   bash /config/bin/status.sh

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

log "HA Core"
ha core info 2>/dev/null | grep -E 'version|state' || echo "(unavailable)"

log "Last deploy"
git -C /config log -1 --format="%h  %ai  %s" 2>/dev/null || echo "(no git history)"

log "Local add-ons"
found=false
for d in /addons/*/; do
  [ -d "$d" ] || continue
  found=true
  slug="local_$(basename "$d")"
  info=$(ha apps info "$slug" 2>/dev/null) || { echo "  $slug: (ha apps info failed)"; continue; }
  version=$(echo "$info" | grep 'version' | head -1 | awk '{print $2}')
  state=$(echo "$info"   | grep 'state'   | head -1 | awk '{print $2}')
  printf '  %-35s  version=%-10s  state=%s\n' "$slug" "$version" "$state"
done
"$found" = false && echo "  (none)"

log "Config watcher"
/config/bin/watcher.sh status 2>/dev/null || echo "(unavailable)"
