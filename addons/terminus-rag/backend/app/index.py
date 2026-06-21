"""In-memory cosine index over IndexRecords with atomic persistence.

Vectors are L2-normalized float32 rows, so cosine similarity is ``vec · matrixᵀ``.
A few-hundred-record corpus needs no FAISS/Chroma. ``name``/``domain``/``area`` are
denormalized out of each record's metadata for cheap filtering and result shaping.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

import numpy as np

from .embedder import EMBED_DIM, Embedder, l2_normalize
from .records import IndexRecord, content_hash

logger = logging.getLogger(__name__)


def _denorm(record: IndexRecord) -> dict:
    meta = record.metadata or {}
    return {
        "id": record.id,
        "kind": record.kind,
        "text": record.text,
        "metadata": meta,
        "name": meta.get("name") or record.id,
        "domain": meta.get("domain"),
        "area": meta.get("area_name") or meta.get("area"),
    }


class VectorIndex:
    def __init__(self, embedder: Embedder) -> None:
        self.embedder = embedder
        self._dim = getattr(embedder, "dim", EMBED_DIM)
        # parallel arrays keyed by position; id → position for upsert/remove
        self._ids: list[str] = []
        self._pos: dict[str, int] = {}
        self._rows: list[dict] = []  # denormalized record dicts
        self._hashes: list[str] = []
        self._vectors = np.zeros((0, self._dim), dtype=np.float32)

    def __len__(self) -> int:
        return len(self._ids)

    # -- mutation ---------------------------------------------------------
    def upsert(self, records: list[IndexRecord]) -> dict:
        added = changed = unchanged = 0
        to_embed: list[tuple[int, str]] = []  # (position, text)
        new_rows: list[dict] = []
        new_hashes: list[str] = []
        new_ids: list[str] = []

        for rec in records:
            h = content_hash(rec.text)
            row = _denorm(rec)
            if rec.id in self._pos:
                p = self._pos[rec.id]
                if self._hashes[p] == h:
                    self._rows[p] = row  # refresh metadata even if text unchanged
                    unchanged += 1
                    continue
                self._rows[p] = row
                self._hashes[p] = h
                to_embed.append((p, rec.text))
                changed += 1
            else:
                p = len(self._ids) + len(new_ids)
                new_ids.append(rec.id)
                new_rows.append(row)
                new_hashes.append(h)
                to_embed.append((p, rec.text))
                added += 1

        if new_ids:
            self._ids.extend(new_ids)
            self._rows.extend(new_rows)
            self._hashes.extend(new_hashes)
            self._pos = {i: n for n, i in enumerate(self._ids)}
            pad = np.zeros((len(new_ids), self._dim), dtype=np.float32)
            self._vectors = np.vstack([self._vectors, pad]) if len(self._vectors) else pad

        if to_embed:
            vecs = self.embedder.embed([t for _, t in to_embed])
            for (p, _), v in zip(to_embed, vecs):
                self._vectors[p] = v

        return {"added": added, "changed": changed, "unchanged": unchanged}

    def remove(self, ids: list[str]) -> int:
        present = [i for i in ids if i in self._pos]
        if not present:
            return 0
        drop = set(present)
        keep = [n for n, i in enumerate(self._ids) if i not in drop]
        self._ids = [self._ids[n] for n in keep]
        self._rows = [self._rows[n] for n in keep]
        self._hashes = [self._hashes[n] for n in keep]
        self._vectors = (
            self._vectors[keep] if keep else np.zeros((0, self._dim), dtype=np.float32)
        )
        self._pos = {i: n for n, i in enumerate(self._ids)}
        return len(present)

    def reconcile(self, records: list[IndexRecord]) -> dict:
        """Reconcile the index atomically w.r.t. embedding.

        Embedding is the only failure point. We compute it FIRST — before mutating
        any internal state — so that if ``embedder.embed`` raises the index is left
        fully intact (keep-last-good). Only after the vectors are in hand do we
        apply removals and insertions.
        """
        wanted = {r.id for r in records}
        gone = [i for i in self._ids if i not in wanted]

        # --- Phase 1: classify records (no mutation yet) ---------------------
        added_recs: list[tuple[IndexRecord, str]] = []   # (rec, hash)
        changed_pos: list[tuple[int, IndexRecord, str]] = []  # (pos, rec, hash)
        unchanged_pos: list[int] = []

        for rec in records:
            h = content_hash(rec.text)
            if rec.id in self._pos:
                p = self._pos[rec.id]
                if self._hashes[p] == h:
                    unchanged_pos.append(p)
                else:
                    changed_pos.append((p, rec, h))
            else:
                added_recs.append((rec, h))

        # --- Phase 2: embed NEW + CHANGED texts (raises → no mutation) -------
        need_embed: list[str] = [rec.text for rec, _ in added_recs] + \
                                 [rec.text for _, rec, _ in changed_pos]
        precomputed: list[np.ndarray] = []
        if need_embed:
            precomputed = self.embedder.embed(need_embed)  # may raise; index untouched

        # --- Phase 3: apply mutations (no failure point below) ---------------
        n_added = len(added_recs)
        n_changed = len(changed_pos)

        # Build the new state for added records
        new_ids: list[str] = [rec.id for rec, _ in added_recs]
        new_rows: list[dict] = [_denorm(rec) for rec, _ in added_recs]
        new_hashes: list[str] = [h for _, h in added_recs]
        added_vecs = precomputed[:n_added]

        # Apply changes in-place for existing positions
        changed_vecs = precomputed[n_added:]
        for (p, rec, h), vec in zip(changed_pos, changed_vecs):
            self._rows[p] = _denorm(rec)
            self._hashes[p] = h
            self._vectors[p] = vec

        # Also refresh metadata rows for unchanged records (text unchanged, meta may differ)
        # We need a quick id→rec map for this
        rec_by_id = {rec.id: rec for rec in records}
        for p in unchanged_pos:
            rid = self._ids[p]
            self._rows[p] = _denorm(rec_by_id[rid])

        # Remove vanished ids
        removed = self.remove(gone)

        # Append new records
        if new_ids:
            base = len(self._ids)
            self._ids.extend(new_ids)
            self._rows.extend(new_rows)
            self._hashes.extend(new_hashes)
            self._pos = {i: n for n, i in enumerate(self._ids)}
            pad = np.zeros((len(new_ids), self._dim), dtype=np.float32)
            self._vectors = np.vstack([self._vectors, pad]) if len(self._vectors) else pad
            for i, vec in enumerate(added_vecs):
                self._vectors[base + i] = vec

        return {
            "added": n_added,
            "changed": n_changed,
            "removed": removed,
            "total": len(self._ids),
        }

    # -- query ------------------------------------------------------------
    def embed_query(self, query: str) -> np.ndarray:
        return self.embedder.embed([query])[0]

    def _mask(self, kind: str | None, area: str | None) -> list[int]:
        out = []
        for n, row in enumerate(self._rows):
            if kind is not None and row["kind"] != kind:
                continue
            if area is not None and row["area"] != area:
                continue
            out.append(n)
        return out

    def search(
        self,
        query_vec: np.ndarray,
        *,
        kind: str | None = None,
        area: str | None = None,
        top_k: int = 10,
    ) -> list[dict]:
        if len(self._ids) == 0:
            return []
        positions = self._mask(kind, area)
        if not positions:
            return []
        q = l2_normalize(np.asarray(query_vec, dtype=np.float32).reshape(1, -1))[0]
        sub = self._vectors[positions]
        sims = sub @ q
        order = np.argsort(-sims)[: max(top_k, 0)]
        hits = []
        for j in order:
            p = positions[int(j)]
            row = self._rows[p]
            hits.append(
                {
                    "id": row["id"],
                    "kind": row["kind"],
                    "name": row["name"],
                    "domain": row["domain"],
                    "area": row["area"],
                    "score": float(sims[int(j)]),
                    "metadata": row["metadata"],
                }
            )
        return hits

    def list_records(
        self, *, kind: str | None = None, area: str | None = None
    ) -> list[dict]:
        out = []
        for p in self._mask(kind, area):
            row = self._rows[p]
            out.append({"id": row["id"], "kind": row["kind"], "name": row["name"], **row["metadata"]})
        return out

    def list_kinds(self) -> list[dict]:
        counts: dict[str, int] = {}
        for row in self._rows:
            counts[row["kind"]] = counts.get(row["kind"], 0) + 1
        return [{"kind": k, "count": counts[k]} for k in sorted(counts)]

    def get(self, id: str, kind: str) -> dict | None:
        p = self._pos.get(id)
        if p is None:
            return None
        row = self._rows[p]
        if row["kind"] != kind:
            return None
        return row["metadata"]

    # -- persistence ------------------------------------------------------
    def save(self, path: Path) -> None:
        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)

        def _atomic_write(name: str, writer) -> None:
            tmp = path / (name + ".tmp")
            writer(tmp)
            os.replace(tmp, path / name)

        def _write_vectors(t):
            with open(t, "wb") as fh:
                np.save(fh, self._vectors)

        _atomic_write("vectors.npy", _write_vectors)
        _atomic_write(
            "meta.json", lambda t: t.write_text(json.dumps(self._rows))
        )
        _atomic_write(
            "hashes.json",
            lambda t: t.write_text(json.dumps(dict(zip(self._ids, self._hashes)))),
        )

    @classmethod
    def load(cls, path: Path, embedder: Embedder) -> "VectorIndex":
        path = Path(path)
        idx = cls(embedder)
        meta_p = path / "meta.json"
        vec_p = path / "vectors.npy"
        hash_p = path / "hashes.json"
        if not (meta_p.exists() and vec_p.exists() and hash_p.exists()):
            return idx
        try:
            rows = json.loads(meta_p.read_text())
            vectors = np.load(vec_p).astype(np.float32)
            hashes = json.loads(hash_p.read_text())
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            logger.warning("index load failed (%s); starting empty", exc)
            return cls(embedder)
        idx._rows = rows
        idx._ids = [r["id"] for r in rows]
        idx._pos = {i: n for n, i in enumerate(idx._ids)}
        idx._hashes = [hashes.get(i, "") for i in idx._ids]
        idx._vectors = l2_normalize(vectors) if len(vectors) else np.zeros(
            (0, idx._dim), dtype=np.float32
        )
        return idx
