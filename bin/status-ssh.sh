#!/bin/bash
# Laptop wrapper: show HA core / addon / watcher status via SSH.
#
#   bin/status-ssh.sh
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/status-ssh.sh

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"

exec ssh -p "$HA_SSH_PORT" "$HA_SSH_HOST" 'bash /config/bin/status.sh'
