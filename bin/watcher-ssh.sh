#!/bin/bash
# Local-laptop wrapper: manage the HA config watcher over SSH.
#
#   bin/watcher-ssh.sh [start|stop|restart|status|logs]   (default: status)
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/watcher-ssh.sh start

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"
CMD="${1:-status}"

# logs needs a TTY for interactive tail -f; other commands don't
if [ "$CMD" = "logs" ]; then
  exec ssh -t -p "$HA_SSH_PORT" "$HA_SSH_HOST" "/config/bin/watcher.sh logs"
else
  exec ssh -p "$HA_SSH_PORT" "$HA_SSH_HOST" "/config/bin/watcher.sh $CMD"
fi
