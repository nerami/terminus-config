import numpy as np

from app.index import VectorIndex
from app.records import IndexRecord


def _rec(id, kind, text, **meta):
    meta.setdefault("name", text.split(" | ")[0])
    return IndexRecord(id=id, kind=kind, text=text, metadata=meta)


def _records():
    return [
        _rec("entity:light.bed", "entity", "Bedroom Lamp | light",
             domain="light", area="Master Bedroom"),
        _rec("entity:fan.kitchen", "entity", "Kitchen Fan | fan",
             domain="fan", area="Kitchen"),
        _rec("scene:scene.movie", "scene", "Movie Night | scene",
             area="Living Room"),
    ]


def test_upsert_embeds_only_changed(fake_embedder):
    idx = VectorIndex(fake_embedder)
    r = idx.upsert(_records())
    assert r == {"added": 3, "changed": 0, "unchanged": 0}
    assert len(idx) == 3
    # re-upsert identical records → nothing changes
    r2 = idx.upsert(_records())
    assert r2 == {"added": 0, "changed": 0, "unchanged": 3}
    # change one record's text → exactly one changed
    changed = _records()
    changed[0] = _rec("entity:light.bed", "entity", "Bedroom Reading Lamp | light",
                      domain="light", area="Master Bedroom")
    r3 = idx.upsert(changed)
    assert r3 == {"added": 0, "changed": 1, "unchanged": 2}


def test_remove(fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    n = idx.remove(["entity:fan.kitchen", "missing:id"])
    assert n == 1
    assert len(idx) == 2


def test_reconcile_drops_vanished(fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    keep = _records()[:2]  # drop the scene
    r = idx.reconcile(keep)
    assert r["removed"] == 1
    assert r["total"] == 2
    assert idx.get("scene:scene.movie", "scene") is None


def test_search_ranks_and_filters(fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    q = idx.embed_query("Bedroom Lamp | light")  # identical to record text
    hits = idx.search(q, top_k=3)
    assert hits[0]["id"] == "entity:light.bed"
    assert hits[0]["score"] > hits[1]["score"]
    # kind filter
    only_scene = idx.search(q, kind="scene", top_k=3)
    assert {h["kind"] for h in only_scene} == {"scene"}
    # area filter
    kitchen = idx.search(q, area="Kitchen", top_k=3)
    assert {h["area"] for h in kitchen} == {"Kitchen"}
    # top_k bound
    assert len(idx.search(q, top_k=1)) == 1


def test_search_empty_index_returns_empty(fake_embedder):
    idx = VectorIndex(fake_embedder)
    assert idx.search(np.zeros(8, dtype=np.float32), top_k=5) == []


def test_list_records_and_kinds(fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    entities = idx.list_records(kind="entity")
    assert {e["id"] for e in entities} == {"entity:light.bed", "entity:fan.kitchen"}
    assert all("name" in e for e in entities)
    kinds = idx.list_kinds()
    assert {"kind": "entity", "count": 2} in kinds
    assert {"kind": "scene", "count": 1} in kinds


def test_get_exact(fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    got = idx.get("scene:scene.movie", "scene")
    assert got["area"] == "Living Room"
    assert idx.get("scene:scene.movie", "entity") is None  # kind mismatch
    assert idx.get("nope", "entity") is None


def test_persistence_round_trip(tmp_path, fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    idx.save(tmp_path)
    assert (tmp_path / "vectors.npy").exists()
    assert (tmp_path / "meta.json").exists()
    assert (tmp_path / "hashes.json").exists()
    loaded = VectorIndex.load(tmp_path, fake_embedder)
    assert len(loaded) == 3
    q = loaded.embed_query("Bedroom Lamp | light")
    assert loaded.search(q, top_k=1)[0]["id"] == "entity:light.bed"
    # an unchanged re-upsert on the loaded index embeds nothing (hashes survived)
    assert loaded.upsert(_records()) == {"added": 0, "changed": 0, "unchanged": 3}


def test_load_missing_dir_is_empty(tmp_path, fake_embedder):
    loaded = VectorIndex.load(tmp_path / "nope", fake_embedder)
    assert len(loaded) == 0


def test_save_is_atomic_no_partial(tmp_path, fake_embedder):
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    idx.save(tmp_path)
    # no leftover temp files
    assert not list(tmp_path.glob("*.tmp"))


def test_reconcile_embed_failure_leaves_index_intact(fake_embedder):
    """reconcile() must be atomic w.r.t. embedding: if embedder.embed raises the
    index is left completely unchanged (same ids, same vectors, same hashes)."""
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    assert len(idx) == 3
    ids_before = list(idx._ids)
    vecs_before = idx._vectors.copy()
    hashes_before = list(idx._hashes)

    # Patch the embedder to raise on the next call
    original_embed = fake_embedder.embed
    calls = {"raised": False}

    def exploding_embed(texts):
        calls["raised"] = True
        raise RuntimeError("embed service unavailable")

    fake_embedder.embed = exploding_embed

    # A reconcile that needs new embeddings (new record not in index yet)
    new_records = _records() + [
        _rec("entity:new.thing", "entity", "New Thing | switch", domain="switch")
    ]
    try:
        idx.reconcile(new_records)
    except RuntimeError:
        pass  # expected — must propagate up from the index layer

    # Index must be fully unchanged
    assert calls["raised"]
    assert list(idx._ids) == ids_before
    assert len(idx) == 3
    np.testing.assert_array_equal(idx._vectors, vecs_before)
    assert list(idx._hashes) == hashes_before

    # Restore the embedder
    fake_embedder.embed = original_embed


def test_search_normalizes_query(fake_embedder):
    """search() must be scale-invariant: q and q*7 should yield the same top hit
    and the same score. Without L2 normalization inside search, scores scale by 7×."""
    idx = VectorIndex(fake_embedder)
    idx.upsert(_records())
    q = idx.embed_query("Bedroom Lamp | light")
    hits_normal = idx.search(q, top_k=3)
    hits_scaled = idx.search(q * 7.0, top_k=3)
    # Top result must be the same entity
    assert hits_normal[0]["id"] == hits_scaled[0]["id"]
    # Scores must be (approximately) equal — normalization makes them scale-invariant
    assert abs(hits_normal[0]["score"] - hits_scaled[0]["score"]) < 1e-5
