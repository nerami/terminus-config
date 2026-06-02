#!/bin/bash
# Local-laptop wrapper: SSH into HA Green and run quick-reload.sh.
# Use for package/automation/script/scene/template changes — fast, no downtime.
#
#   bin/quick-reload-ssh.sh
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/quick-reload-ssh.sh

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"

exec ssh -p "$HA_SSH_PORT" "$HA_SSH_HOST" 'cd /config && ./bin/quick-reload.sh'
