"""Persistent Home Assistant websocket client used for the status indicator.

The client keeps a single authenticated websocket open to Home Assistant, tracks
its connection status, and caches a small "basic info" snapshot (HA version,
location, unit system, entity counts) that the agent tool exposes. The keepalive
loop periodically re-fetches that snapshot, which doubles as liveness detection:
any send/recv failure tears the session down and triggers a reconnect.
"""

from __future__ import annotations

import asyncio
import json
from collections import Counter
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Callable, Optional


class HAStatus(str, Enum):
    connecting = "connecting"
    connected = "connected"
    disconnected = "disconnected"
    auth_failed = "auth_failed"


class HAAuthError(Exception):
    """Raised when Home Assistant rejects the access token."""


# connect(url) -> async context manager yielding an object with async send/recv.
ConnectFn = Callable[[str], Any]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def extract_basic_info(config: dict, states: Optional[list[dict]] = None) -> dict:
    unit_system = config.get("unit_system") or {}
    info: dict[str, Any] = {
        "version": config.get("version"),
        "location_name": config.get("location_name"),
        "time_zone": config.get("time_zone"),
        "country": config.get("country"),
        "currency": config.get("currency"),
        "unit_system": {
            "temperature": unit_system.get("temperature"),
            "length": unit_system.get("length"),
        },
    }
    if states is not None:
        counts: Counter[str] = Counter(
            s["entity_id"].split(".", 1)[0]
            for s in states
            if "." in s.get("entity_id", "")
        )
        info["entity_count"] = sum(counts.values())
        info["entities_by_domain"] = dict(sorted(counts.items()))
    return info


class HAClient:
    def __init__(
        self,
        ws_url: str,
        token: Optional[str],
        connect: ConnectFn,
        *,
        refresh_interval: float = 30.0,
        reconnect_delay: float = 3.0,
        max_reconnect_delay: float = 60.0,
    ) -> None:
        self._ws_url = ws_url
        self._token = token
        self._connect = connect
        self._refresh_interval = refresh_interval
        self._reconnect_delay = reconnect_delay
        self._max_reconnect_delay = max_reconnect_delay

        self._status = HAStatus.disconnected
        self._ha_version: Optional[str] = None
        self._last_connected: Optional[str] = None
        self._error: Optional[str] = None
        self._basic_info: Optional[dict] = None
        self._msg_id = 0
        self._stop = asyncio.Event()

    # -- protocol helpers -------------------------------------------------
    def _next_id(self) -> int:
        self._msg_id += 1
        return self._msg_id

    async def _command(self, ws, payload: dict) -> dict:
        mid = self._next_id()
        await ws.send(json.dumps({"id": mid, **payload}))
        while True:
            msg = json.loads(await ws.recv())
            if msg.get("id") == mid:
                return msg

    async def _authenticate(self, ws) -> None:
        msg = json.loads(await ws.recv())
        if msg.get("type") != "auth_required":
            raise HAAuthError(f"unexpected greeting: {msg.get('type')!r}")
        await ws.send(json.dumps({"type": "auth", "access_token": self._token}))
        msg = json.loads(await ws.recv())
        if msg.get("type") == "auth_invalid":
            raise HAAuthError(msg.get("message", "auth_invalid"))
        if msg.get("type") != "auth_ok":
            raise HAAuthError(f"unexpected auth response: {msg.get('type')!r}")
        self._ha_version = msg.get("ha_version") or self._ha_version

    async def _refresh(self, ws) -> None:
        config = (await self._command(ws, {"type": "get_config"})).get("result") or {}
        states = (await self._command(ws, {"type": "get_states"})).get("result") or []
        self._ha_version = config.get("version") or self._ha_version
        self._basic_info = extract_basic_info(config, states)

    # -- lifecycle --------------------------------------------------------
    async def _session(self) -> None:
        async with self._connect(self._ws_url) as ws:
            await self._authenticate(ws)
            self._status = HAStatus.connected
            self._last_connected = _now_iso()
            self._error = None
            await self._refresh(ws)
            while not self._stop.is_set():
                try:
                    await asyncio.wait_for(
                        self._stop.wait(), timeout=self._refresh_interval
                    )
                except asyncio.TimeoutError:
                    pass
                if self._stop.is_set():
                    break
                await self._refresh(ws)

    async def run_forever(self) -> None:
        delay = self._reconnect_delay
        while not self._stop.is_set():
            self._status = HAStatus.connecting
            try:
                await self._session()
                delay = self._reconnect_delay
            except HAAuthError as exc:
                self._status = HAStatus.auth_failed
                self._error = str(exc)
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001 - surface any transport error
                self._status = HAStatus.disconnected
                self._error = f"{type(exc).__name__}: {exc}"

            if self._stop.is_set():
                break
            try:
                await asyncio.wait_for(self._stop.wait(), timeout=delay)
            except asyncio.TimeoutError:
                pass
            delay = min(delay * 2, self._max_reconnect_delay)

        self._status = HAStatus.disconnected

    def stop(self) -> None:
        self._stop.set()

    # -- accessors --------------------------------------------------------
    def get_status(self) -> dict:
        return {
            "status": self._status.value,
            "ha_version": self._ha_version,
            "last_connected": self._last_connected,
            "error": self._error,
            "url": self._ws_url,
        }

    def get_basic_info(self) -> Optional[dict]:
        return self._basic_info
