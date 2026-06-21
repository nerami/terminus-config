"""Embedding backends. ``FastEmbedEmbedder`` wraps fastembed's ONNX model;
``FakeEmbedder`` is a deterministic stand-in so unit tests never download a model.

Both return L2-normalized float32 rows so cosine similarity is a plain dot product.
"""

from __future__ import annotations

import hashlib
import logging
from typing import Protocol, runtime_checkable

import numpy as np

logger = logging.getLogger(__name__)

EMBED_DIM = 384


def l2_normalize(mat: np.ndarray) -> np.ndarray:
    """Row-normalize a 2-D matrix; zero rows stay zero (no divide-by-zero)."""
    mat = np.asarray(mat, dtype=np.float32)
    if mat.ndim != 2:
        mat = mat.reshape(-1, mat.shape[-1])
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms = np.where(norms == 0.0, 1.0, norms)
    return (mat / norms).astype(np.float32)


@runtime_checkable
class Embedder(Protocol):
    dim: int

    def embed(self, texts: list[str]) -> np.ndarray:
        """Return an ``(len(texts), dim)`` float32 matrix of L2-normalized rows."""
        ...


class FastEmbedEmbedder:
    """fastembed ``TextEmbedding`` wrapper. Model is lazy-loaded on first embed and
    cached under ``cache_dir`` (downloaded once on first boot)."""

    def __init__(
        self,
        model_name: str = "BAAI/bge-small-en-v1.5",
        cache_dir: str = "/data/models",
    ) -> None:
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.dim = EMBED_DIM
        self._model = None  # type: ignore[var-annotated]

    def _ensure_model(self):
        if self._model is None:
            from fastembed import TextEmbedding

            logger.info("loading fastembed model %s", self.model_name)
            self._model = TextEmbedding(
                model_name=self.model_name, cache_dir=self.cache_dir
            )
        return self._model

    def embed(self, texts: list[str]) -> np.ndarray:
        if not texts:
            return np.zeros((0, self.dim), dtype=np.float32)
        model = self._ensure_model()
        vecs = np.array(list(model.embed(texts)), dtype=np.float32)
        return l2_normalize(vecs)


class FakeEmbedder:
    """Deterministic embedder for tests — vectors derived from a seeded hash of each
    text, then L2-normalized. No network, no model download."""

    def __init__(self, dim: int = 8) -> None:
        self.dim = dim

    def embed(self, texts: list[str]) -> np.ndarray:
        if not texts:
            return np.zeros((0, self.dim), dtype=np.float32)
        rows = []
        for t in texts:
            seed = int.from_bytes(
                hashlib.sha256(t.encode("utf-8")).digest()[:8], "big"
            )
            rng = np.random.default_rng(seed)
            rows.append(rng.standard_normal(self.dim).astype(np.float32))
        return l2_normalize(np.array(rows, dtype=np.float32))
