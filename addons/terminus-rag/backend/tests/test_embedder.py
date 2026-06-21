import numpy as np
import pytest

from app.embedder import EMBED_DIM, FakeEmbedder, l2_normalize


def test_fake_embedder_shape_and_dtype(fake_embedder):
    out = fake_embedder.embed(["a", "b", "c"])
    assert out.shape == (3, 8)
    assert out.dtype == np.float32


def test_fake_embedder_deterministic(fake_embedder):
    a = fake_embedder.embed(["hello world"])
    b = FakeEmbedder(dim=8).embed(["hello world"])
    assert np.allclose(a, b)


def test_fake_embedder_rows_l2_normalized(fake_embedder):
    out = fake_embedder.embed(["x", "yy"])
    norms = np.linalg.norm(out, axis=1)
    assert np.allclose(norms, 1.0, atol=1e-5)


def test_fake_embedder_distinguishes_texts(fake_embedder):
    out = fake_embedder.embed(["the bedroom lamp", "kitchen fan"])
    cos = float(out[0] @ out[1])
    assert cos < 0.999  # not identical vectors


def test_l2_normalize_leaves_zero_rows():
    mat = np.array([[0.0, 0.0], [3.0, 4.0]], dtype=np.float32)
    out = l2_normalize(mat)
    assert np.allclose(out[0], [0.0, 0.0])
    assert np.allclose(np.linalg.norm(out[1]), 1.0)


@pytest.mark.slow
def test_real_fastembed_dim_and_ranking():
    from app.embedder import FastEmbedEmbedder

    emb = FastEmbedEmbedder(cache_dir="/tmp/fastembed-test-cache")
    vecs = emb.embed(
        ["the bedroom lamp", "kitchen exhaust fan", "a cozy reading light"]
    )
    assert vecs.shape == (3, EMBED_DIM)
    q = emb.embed(["light for reading in bed"])[0]
    sims = vecs @ q
    # the two light-ish strings should outrank the kitchen fan
    assert int(np.argmax(sims)) in (0, 2)
