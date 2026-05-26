#!/bin/bash
# Local-laptop wrapper: SSH into the HA Green and run the on-device deploy
# script. Run from the repo root or anywhere — does not depend on cwd.
#
#   bin/deploy-ssh.sh
#
# Override host/port via env if needed:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/deploy-ssh.sh
#
# Requires Tailnet membership (SSH is not exposed via Funnel).
# `-t` allocates a TTY so deploy.sh's prompts (rollback choice, restart
# confirmation) and ANSI colors work over SSH.

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"

exec ssh -t -p "$HA_SSH_PORT" "$HA_SSH_HOST" 'cd /config && ./bin/deploy.sh'
