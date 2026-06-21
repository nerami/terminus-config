import asyncio

import pytest

from app.config import Settings
from app.index import VectorIndex
from app.records import IndexRecord
from app.refresher import Refresher


def _settings(interval=600):
    return Settings(
        ws_url="ws://x", ha_token="t", use_supervisor=False, api_token="",
        refresh_interval=interval, embed_model="m", top_k_default=10, log_level="info",
    )


def _rec(id, kind="entity", text=None):
    text = text or f"{id} | {kind}"
    return IndexRecord(id=id, kind=kind, text=text, metadata={"name": id})


def _refresher(tmp_path, fake_embedder, fetch):
    idx = VectorIndex(fake_embedder)
    r = Refresher(idx, _settings(), connect=lambda u: None, fetch=fetch)
    r.persist_dir = tmp_path
    return r, idx


async def test_refresh_once_indexes_and_persists(tmp_path, fake_embedder):
    async def fetch(settings, connect):
        return [_rec("entity:a"), _rec("entity:b")], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    out = await r.refresh_once()
    assert out["added"] == 2
    assert out["total"] == 2
    assert "took_ms" in out
    assert r.last_refresh is not None
    assert (tmp_path / "vectors.npy").exists()


async def test_refresh_only_changed_on_second_pass(tmp_path, fake_embedder):
    state = {"recs": [_rec("entity:a"), _rec("entity:b")]}

    async def fetch(settings, connect):
        return state["recs"], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    await r.refresh_once()
    state["recs"] = [_rec("entity:a", text="entity:a | changed"), _rec("entity:b")]
    out = await r.refresh_once()
    assert out["changed"] == 1
    assert out["added"] == 0


async def test_refresh_drops_removed(tmp_path, fake_embedder):
    state = {"recs": [_rec("entity:a"), _rec("entity:b")]}

    async def fetch(settings, connect):
        return state["recs"], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    await r.refresh_once()
    state["recs"] = [_rec("entity:a")]
    out = await r.refresh_once()
    assert out["removed"] == 1
    assert out["total"] == 1


async def test_failed_fetch_keeps_prior_index(tmp_path, fake_embedder):
    state = {"fail": False}

    async def fetch(settings, connect):
        if state["fail"]:
            raise RuntimeError("ws down")
        return [_rec("entity:a")], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    await r.refresh_once()
    assert len(idx) == 1
    state["fail"] = True
    out = await r.refresh_once()
    assert "error" in out
    assert len(idx) == 1  # prior index preserved
    assert r.last_error is not None


async def test_single_flight_one_fetch_three_concurrent(tmp_path, fake_embedder):
    """N concurrent refresh_once() calls must perform the fetch exactly ONCE.

    The lock is acquired by the first coroutine; the others wait on it. When
    they wake up they detect that _generation advanced while they were blocked
    and return {"skipped": True} without re-fetching. A sleep inside fetch is
    NOT required to prove this — we assert calls["n"] == 1 for 3 concurrent
    callers, which holds regardless of scheduling order.
    """
    calls = {"n": 0}

    async def fetch(settings, connect):
        calls["n"] += 1
        # tiny yield so the other two coroutines have a chance to reach
        # the lock before the first one finishes — maximises race likelihood
        await asyncio.sleep(0)
        return [_rec("entity:a")], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    results = await asyncio.gather(r.refresh_once(), r.refresh_once(), r.refresh_once())
    # fetch ran exactly once regardless of which coroutine won the lock
    assert calls["n"] == 1
    # exactly one result is a real refresh result; the other two are skipped
    real = [res for res in results if "skipped" not in res]
    skipped = [res for res in results if "skipped" in res]
    assert len(real) == 1
    assert len(skipped) == 2
    assert real[0]["total"] == 1


async def test_embed_failure_keeps_prior_index_and_logs(tmp_path, fake_embedder, caplog):
    """If the embedder raises during reconcile, the prior index stays fully intact
    and the refresher logs a warning (keep-last-good, not keep-empty).

    We seed the index with two records, then on the next fetch return those same
    records PLUS a brand-new record — forcing reconcile to call embed for the new
    text. With the embedder patched to raise, the index must remain at length 2
    with the original ids intact.
    """
    import logging

    state = {"blow_up": False}
    original_embed = fake_embedder.embed

    def guarded_embed(texts):
        if state["blow_up"]:
            raise RuntimeError("GPU OOM")
        return original_embed(texts)

    fake_embedder.embed = guarded_embed

    state_fetch = {"extra": False}

    async def fetch(settings, connect):
        recs = [_rec("entity:a"), _rec("entity:b")]
        if state_fetch["extra"]:
            recs.append(_rec("entity:c"))  # new record — forces embed on reconcile
        return recs, []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    # Seed with known-good state
    await r.refresh_once()
    assert len(idx) == 2
    prior_ids = set(idx._ids)

    # Next fetch adds a new record; embedder will blow up while embedding it
    state_fetch["extra"] = True
    state["blow_up"] = True
    with caplog.at_level(logging.WARNING, logger="app.refresher"):
        out = await r.refresh_once()

    # Error result returned, not an exception
    assert "error" in out
    # Prior index is intact — not 3, not 0
    assert len(idx) == 2
    assert set(idx._ids) == prior_ids
    # A warning was logged
    assert any("reconcile" in rec.message.lower() or "keeping prior" in rec.message.lower()
               for rec in caplog.records)


async def test_run_loop_stops(tmp_path, fake_embedder):
    async def fetch(settings, connect):
        return [_rec("entity:a")], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    r.settings = _settings(interval=0)  # tight loop
    task = asyncio.create_task(r.run_loop())
    await asyncio.sleep(0.02)
    r.stop()
    await asyncio.wait_for(task, timeout=1.0)
    assert len(idx) == 1
