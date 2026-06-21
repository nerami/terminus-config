"""Refresh orchestration: fetch all sources → reconcile the index → persist, under a
single-flight lock, owning the asyncio poll loop. A failed fetch is logged and the
prior (last-good) index is preserved — we degrade to stale, never to empty.
"""

from __future__ import annotations

import asyncio
import logging
import time
from datetime import datetime, timezone
from pathlib import Path

from .config import Settings
from .ha_source import ConnectFn, fetch_all
from .index import VectorIndex

logger = logging.getLogger(__name__)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Refresher:
    def __init__(
        self,
        index: VectorIndex,
        settings: Settings,
        connect: ConnectFn,
        *,
        fetch=fetch_all,
    ) -> None:
        self.index = index
        self.settings = settings
        self.connect = connect
        self._fetch = fetch
        self._lock = asyncio.Lock()
        self._generation = 0  # incremented on each successful refresh
        self._stop = asyncio.Event()
        self.persist_dir = Path("/data/index")
        self.last_refresh: str | None = None
        self.last_error: str | None = None

    def _persist(self) -> None:
        try:
            self.index.save(self.persist_dir)
        except Exception as exc:  # noqa: BLE001 - persistence is best-effort; log
            logger.warning("index persist failed: %s", exc)

    async def refresh_once(self) -> dict:
        # Capture generation BEFORE acquiring so a waiter can detect a concurrent
        # refresh completed while it was blocked.
        gen_before = self._generation
        async with self._lock:
            # If someone else refreshed while we were waiting, skip re-fetching.
            if self._generation != gen_before:
                logger.debug("refresh completed by concurrent caller; skipping re-fetch")
                return {"skipped": True, "total": len(self.index)}

            t0 = time.monotonic()
            try:
                records, errors = await self._fetch(self.settings, self.connect)
            except Exception as exc:  # noqa: BLE001 - keep last-good index
                self.last_error = f"{type(exc).__name__}: {exc}"
                logger.warning("refresh fetch failed (%s); keeping prior index", self.last_error)
                return {"error": self.last_error, "total": len(self.index)}

            try:
                stats = self.index.reconcile(records)
            except Exception as exc:  # noqa: BLE001 - embed failure keeps prior index intact
                self.last_error = f"{type(exc).__name__}: {exc}"
                logger.warning(
                    "refresh reconcile failed (%s); keeping prior index", self.last_error,
                    exc_info=True,
                )
                return {"error": self.last_error, "total": len(self.index)}

            self._generation += 1
            self._persist()
            self.last_refresh = _now_iso()
            self.last_error = None
            took_ms = int((time.monotonic() - t0) * 1000)
            result = {**stats, "took_ms": took_ms, "errors": errors}
            logger.info(
                "refresh: +%d ~%d -%d total=%d (%dms) source_errors=%s",
                stats["added"], stats["changed"], stats["removed"],
                stats["total"], took_ms, errors,
            )
            return result

    async def run_loop(self) -> None:
        await self.refresh_once()
        while not self._stop.is_set():
            try:
                await asyncio.wait_for(
                    self._stop.wait(), timeout=max(self.settings.refresh_interval, 0)
                )
            except asyncio.TimeoutError:
                pass
            if self._stop.is_set():
                break
            await self.refresh_once()

    def stop(self) -> None:
        self._stop.set()
