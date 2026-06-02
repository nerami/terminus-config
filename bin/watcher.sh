#!/bin/bash
# HA config watcher — polls packages/ + top-level YAML, reloads on change.
# No inotify-tools needed. Validates before reload; logs failures without dying.
#
# Must be started from the Advanced SSH add-on shell so SUPERVISOR_TOKEN is set.
# Token is valid for the lifetime of the add-on instance.
#
# Usage (on-device):
#   /config/bin/watcher.sh start    — daemonize, logs to /tmp/ha-watcher.log
#   /config/bin/watcher.sh stop     — kill daemon
#   /config/bin/watcher.sh restart  — stop + start
#   /config/bin/watcher.sh status   — pid + last 5 log lines
#   /config/bin/watcher.sh logs     — tail -f log
#   /config/bin/watcher.sh run      — foreground (debugging)

set -euo pipefail

PID_FILE="/tmp/ha-watcher.pid"
LOG_FILE="/tmp/ha-watcher.log"
POLL=2      # seconds between hash checks
DEBOUNCE=3  # seconds of quiet before triggering reload

WATCH_FILES=(
  /config/configuration.yaml
  /config/automations.yaml
  /config/scripts.yaml
  /config/scenes.yaml
)

log() { printf '%s [watcher] %s\n' "$(date '+%H:%M:%S')" "$*"; }

get_hash() {
  {
    find /config/packages -name "*.yaml" 2>/dev/null | sort || true
    for f in "${WATCH_FILES[@]}"; do [ -f "$f" ] && echo "$f"; done
  } | xargs md5sum 2>/dev/null | md5sum | awk '{print $1}'
}

do_reload() {
  log "validating config..."
  if ha core check &>/dev/null; then
    if curl -fsSL -X POST "http://supervisor/core/api/services/homeassistant/reload_all" \
        -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{}' &>/dev/null; then
      log "reload OK"
    else
      log "ERROR: reload_all call failed (HA running?)"
    fi
  else
    log "ERROR: ha core check failed — skipped reload (fix config and save again)"
  fi
}

run_loop() {
  log "started (PID $$) — poll ${POLL}s / debounce ${DEBOUNCE}s"
  trap 'log "stopped"; rm -f "$PID_FILE"' EXIT INT TERM

  local last_hash pending=false pending_since=0 now current_hash
  last_hash=$(get_hash)

  while true; do
    sleep "$POLL"

    current_hash=$(get_hash) || { log "WARN: hash failed, skipping"; continue; }
    now=$(date +%s)

    if [ "$current_hash" != "$last_hash" ]; then
      last_hash=$current_hash
      if [ "$pending" = false ]; then
        pending=true
        pending_since=$now
        log "change detected — waiting ${DEBOUNCE}s for writes to settle"
      fi
    fi

    if [ "$pending" = true ] && [ $((now - pending_since)) -ge "$DEBOUNCE" ]; then
      pending=false
      do_reload
    fi
  done
}

cmd="${1:-status}"

case "$cmd" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "already running (PID $(cat "$PID_FILE"))"
      exit 0
    fi
    rm -f "$PID_FILE"
    # Pass SUPERVISOR_TOKEN explicitly so nohup env has it
    SUPERVISOR_TOKEN="${SUPERVISOR_TOKEN:-}" nohup bash "$0" run >>"$LOG_FILE" 2>&1 &
    sleep 1
    if [ -f "$PID_FILE" ]; then
      echo "started (PID $(cat "$PID_FILE")), logging to $LOG_FILE"
    else
      echo "started, logging to $LOG_FILE"
    fi
    ;;
  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      kill "$(cat "$PID_FILE")"
      rm -f "$PID_FILE"
      echo "stopped"
    else
      echo "not running"
      rm -f "$PID_FILE"
    fi
    ;;
  restart)
    bash "$0" stop
    sleep 1
    bash "$0" start
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "running (PID $(cat "$PID_FILE"))"
    else
      echo "not running"
    fi
    echo "--- last 5 log lines ---"
    tail -5 "$LOG_FILE" 2>/dev/null || echo "(no log yet)"
    ;;
  logs)
    exec tail -f "$LOG_FILE"
    ;;
  run)
    echo $$ > "$PID_FILE"
    run_loop
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs|run}" >&2
    exit 1
    ;;
esac
