#!/bin/bash
# Start full hot-reload pair: device watcher daemon + laptop sync watcher.
# Ctrl-C stops the laptop sync; device watcher keeps running as a daemon.
# To stop the device watcher: bin/watcher-ssh.sh stop
#
#   bin/dev-watch.sh
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/dev-watch.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Starting device watcher..."
"$SCRIPT_DIR/watcher-ssh.sh" start

echo "==> Starting laptop sync watcher (Ctrl-C to stop; device watcher keeps running)..."
exec "$SCRIPT_DIR/sync-watch.sh"
