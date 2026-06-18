#!/usr/bin/with-contenv bashio
# shellcheck shell=bash
set -e

# Add-on options -> environment. Inside the Supervisor, SUPERVISOR_TOKEN is
# injected automatically (homeassistant_api: true) and used for the Core
# websocket / REST; ha_url/ha_token are a dev-only fallback.
export ANTHROPIC_API_KEY="$(bashio::config 'anthropic_api_key')"
export TLC_MODEL="$(bashio::config 'model')"

if bashio::config.has_value 'ha_url'; then
  export HASS_URL="$(bashio::config 'ha_url')"
fi
if bashio::config.has_value 'ha_token'; then
  export HASS_TOKEN="$(bashio::config 'ha_token')"
fi

# LangGraph in-memory dev server: serves the agent graph and thread history on a
# loopback port that the FastAPI process proxies to. Persist threads/checkpoints
# under /data so chat history survives restarts.
export LANGGRAPH_URL="http://127.0.0.1:2025"
mkdir -p /data/langgraph
cd /data/langgraph
langgraph dev \
  --config /app/backend/langgraph.json \
  --host 127.0.0.1 --port 2025 \
  --no-browser --no-reload &
langgraph_pid=$!
trap 'kill -TERM "${langgraph_pid}" 2>/dev/null || true' TERM INT

# FastAPI is the add-on's public face on the ingress port.
cd /app/backend
exec uvicorn app.web:app --host 0.0.0.0 --port 8099
