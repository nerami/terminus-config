#!/bin/bash
# Local-laptop wrapper: snapshot → pull → sync add-ons on device.
# Run after `git push`. Skips full HA config check and core restart.
#
#   bin/deploy-addons-ssh.sh
#
# After this completes, run the appropriate ha command on device:
#   version bumped → ha apps update local_<slug>
#   same version   → ha apps rebuild local_<slug>
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/deploy-addons-ssh.sh

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"

ssh -t -p "$HA_SSH_PORT" "$HA_SSH_HOST" bash << 'REMOTE'
set -euo pipefail
cd /config
BACKUP_NAME="pre-addons-$(date +%Y%m%d-%H%M%S)"
printf '\n\033[1;36m==> Snapshot: %s\033[0m\n' "$BACKUP_NAME"
ha backup new --name "$BACKUP_NAME" || { printf '\n\033[1;31m!! Backup failed — aborting\033[0m\n' >&2; exit 1; }
git pull --ff-only
./bin/deploy-addons.sh
REMOTE
