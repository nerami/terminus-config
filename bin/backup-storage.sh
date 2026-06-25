#!/bin/bash
# Laptop tool: pull a READ-ONLY local mirror of the device's .storage/ folder
# for development reference. Refreshes the mirror in place on each run.
#
#   bin/backup-storage.sh
#
# Override host/port via env:
#   HA_SSH_HOST=root@other.ts.net HA_SSH_PORT=22 bin/backup-storage.sh

set -euo pipefail

HA_SSH_HOST="${HA_SSH_HOST:-root@terminus.tanuki-mirzam.ts.net}"
HA_SSH_PORT="${HA_SSH_PORT:-22222}"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_dir="$(dirname "$script_dir")"
dest="$repo_dir/.storage"

cat <<'WARN'
========================== ⚠  WARNING  ⚠ ==========================
 This copies Home Assistant's .storage/ — HA's INTERNAL STATE, not
 YAML config. It holds the registries and config-entry options (e.g.
 the Divoom Pixoo pages) AND SECRETS / PII:
   • auth tokens & login sessions      • 2FA (TOTP) seeds
   • Home Assistant Cloud credentials  • person / user data

 PURPOSE of this copy: LOCAL, READ-ONLY development reference ONLY.
   • It is gitignored (.storage/) — NEVER commit it.
   • NEVER deploy or copy it back to the device.
   • Treat it like a password. Delete it when you are done.
===================================================================
WARN

echo "Source : ${HA_SSH_HOST}:/config/.storage/"
echo "Dest   : ${dest}/  (existing mirror is overwritten)"
echo
read -r -p "Proceed with the copy? [y/N]: " ans
case "$ans" in
  [yY] | [yY][eE][sS]) ;;
  *) echo "Aborted — nothing was copied."; exit 0 ;;
esac

# Clear any prior (read-only) mirror so the refresh can write.
if [ -d "$dest" ]; then
  chmod -R u+w "$dest" 2>/dev/null || true
  rm -rf "$dest"
fi
mkdir -p "$dest"

echo
echo "Copying…"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete -e "ssh -p ${HA_SSH_PORT}" "${HA_SSH_HOST}:/config/.storage/" "${dest}/"
else
  scp -r -P "${HA_SSH_PORT}" "${HA_SSH_HOST}:/config/.storage/." "${dest}/"
fi

# Lock the mirror read-only so it cannot be edited by accident.
chmod -R a-w "$dest"

count="$(find "$dest" -type f | wc -l | tr -d ' ')"
echo
echo "Done — mirrored ${count} files (read-only) to:"
echo "  ${dest}/"
echo "Reminder: gitignored, secret-bearing, dev-only — never commit or redeploy."
