#!/bin/bash
# Local-laptop wrapper: pull latest on device then sync add-ons.
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

exec ssh -t -p "$HA_SSH_PORT" "$HA_SSH_HOST" 'cd /config && git pull --ff-only && ./bin/deploy-addons.sh'
