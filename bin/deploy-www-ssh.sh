#!/bin/bash
# Laptop wrapper: rsync built Terminus panel artifacts to device.
# Run after `pnpm build` in terminus/ — pushes www/terminus/ → /config/www/terminus/.
#
#   bin/deploy-www-ssh.sh
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/deploy-www-ssh.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"
SRC="$REPO_ROOT/www/terminus/"
DEST="$HA_SSH_HOST:/config/www/terminus/"

if [ ! -d "$SRC" ]; then
  echo "ERROR: $SRC not found — run 'pnpm build' in terminus/ first" >&2
  exit 1
fi

ssh -p "$HA_SSH_PORT" "$HA_SSH_HOST" 'mkdir -p /config/www/terminus'
echo "syncing $SRC → $DEST"
rsync -az --delete \
  -e "ssh -p $HA_SSH_PORT" \
  "$SRC" \
  "$DEST"
echo "done"
