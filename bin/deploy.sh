#!/bin/bash
# Pull latest config from GitHub and restart HA Core.
# Run from the HA Advanced SSH / Web Terminal add-on on the HA Green:
#   bash /config/bin/deploy.sh
#
# Safety:
# - Snapshots before pull (ha backup new).
# - Refuses merge / dirty tree (git pull --ff-only).
# - Validates YAML (ha core check) before restart.
# - Prompts before restart.
# - Bails loudly on any step's failure; HA Core is not restarted if check fails.
#
# Caveat: ha core check does not catch all runtime integration errors.
# After restart, tail Settings → System → Logs (or `ha core logs`).

set -euo pipefail

REPO_DIR="/config"
BACKUP_NAME="pre-deploy-$(date +%Y%m%d-%H%M%S)"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

cd "$REPO_DIR" || fail "Cannot cd to $REPO_DIR"

log "Snapshot: $BACKUP_NAME"
ha backup new --name "$BACKUP_NAME" || fail "Backup failed — aborting before pull."

log "Fetching latest from origin"
git fetch --prune origin || fail "git fetch failed."

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse '@{u}')
if [ "$LOCAL" = "$REMOTE" ]; then
  log "Already up to date ($LOCAL). Nothing to deploy."
  exit 0
fi

log "Pulling (fast-forward only): $LOCAL → $REMOTE"
git pull --ff-only || fail "git pull --ff-only failed. Dirty tree or non-FF history — resolve on device first."

log "Validating config (ha core check)"
if ! ha core check; then
  printf '\n\033[1;31m!! ha core check FAILED. HA Core NOT restarted.\033[0m\n' >&2
  printf '\nOptions:\n'
  printf "  [r] git rollback to %s (undo the pull; HA still running old config in memory — no restart needed)\n" "$LOCAL"
  printf "  [b] restore from backup '%s' (heavier — restores /config, .storage/, secrets.yaml, triggers restart)\n" "$BACKUP_NAME"
  printf '  [N] do nothing (leave bad config on disk; fix manually before restart)\n'
  read -r -p $'\nChoice [r/b/N]: ' choice
  case "$choice" in
    [rR])
      log "Rolling back git to $LOCAL"
      git reset --hard "$LOCAL" || fail "git reset failed. Manual fix required."
      log "Rollback OK. Disk back to $LOCAL. HA Core untouched."
      exit 1
      ;;
    [bB])
      printf '\nTo restore the backup, run:\n'
      printf "  ha backup list           # find the slug for '%s'\n" "$BACKUP_NAME"
      printf '  ha backup restore <slug> # destructive — restores full /config and restarts HA\n'
      printf '\nNot executing automatically; review the slug first.\n'
      exit 1
      ;;
    *)
      fail "No action taken. Bad config on disk. Backup available: $BACKUP_NAME"
      ;;
  esac
fi

printf '\nConfig valid. Apply changes:\n'
printf '  [l] reload  — fast, no downtime (automations/scripts/scenes/templates/helpers)\n'
printf '  [r] restart — full restart (new integrations, configuration.yaml structure changes)\n'
printf '  [N] skip    — apply manually later\n'
read -r -p $'Choice [l/r/N]: ' ans
case "$ans" in
  [lL])
    log "Reloading (homeassistant.reload_all)"
    curl -fsSL -X POST "http://supervisor/core/api/services/homeassistant/reload_all" \
      -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{}' || fail "reload_all failed. Backup: $BACKUP_NAME"
    log "Reload OK. Backup kept: $BACKUP_NAME"
    ;;
  [rR])
    log "Restarting HA Core"
    ha core restart || fail "ha core restart failed. Backup: $BACKUP_NAME"
    log "Deploy OK. Backup kept: $BACKUP_NAME"
    ;;
  *)
    log "Skipped. Run 'ha core restart' or 'homeassistant.reload_all' manually. Backup: $BACKUP_NAME"
    exit 0
    ;;
esac

log "Verify: ha core logs  (or Settings → System → Logs)"
