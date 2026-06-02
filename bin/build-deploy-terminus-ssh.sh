#!/bin/bash
# Build Terminus panel then push artifacts to device in one step.
# Equivalent to: cd terminus-dashboard && pnpm build && bin/deploy-www-ssh.sh
#
#   bin/build-deploy-terminus-ssh.sh
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/build-deploy-terminus-ssh.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> Building Terminus panel..."
cd "$REPO_ROOT/terminus-dashboard"
pnpm build

echo "==> Deploying to device..."
exec "$SCRIPT_DIR/deploy-www-ssh.sh"
