#!/usr/bin/env bash
# Plain entrypoint (no bashio/s6 — this is the glibc python:3.12-slim base, not the
# Alpine HA base). Add-on options are read directly from /data/options.json in
# config.py; we only exec uvicorn here. SUPERVISOR_TOKEN is injected by the
# Supervisor (homeassistant_api: true).
set -e

mkdir -p /data/index /data/models
cd /app/backend
exec uvicorn app.main:app --host 0.0.0.0 --port 9000
