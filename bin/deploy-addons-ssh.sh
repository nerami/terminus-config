#!/bin/bash
# Local-laptop wrapper: SSH into the HA Green and run deploy-addons.sh.
# Use when you only want to push add-on changes without a full HA config
# deploy (no git pull, no ha core check, no restart prompt).
#
#   bin/deploy-addons-ssh.sh
#
# Override host/port via env if needed:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/deploy-addons-ssh.sh
#
# Note: this runs deploy-addons.sh against whatever is currently checked
# out on the device under /config/addons/. To ship laptop-side edits,
# `git push` first then run `bin/deploy-ssh.sh` (full deploy includes
# the addon sync step) — or `ssh ... 'cd /config && git pull --ff-only
# && ./bin/deploy-addons.sh'` for addon-only.

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"

exec ssh -t -p "$HA_SSH_PORT" "$HA_SSH_HOST" 'cd /config && ./bin/deploy-addons.sh'
