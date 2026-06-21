from app.config import Settings
from app.embedder import FakeEmbedder
from app.main import build_state, configure_logging
from app.mcp_app import AppState


def _settings():
    return Settings(
        ws_url="ws://x", ha_token="t", use_supervisor=False, api_token="",
        refresh_interval=600, embed_model="m", top_k_default=10, log_level="info",
    )


def test_build_state_wires_index_and_refresher(tmp_path):
    state = build_state(
        _settings(), embedder=FakeEmbedder(dim=8),
        connect=lambda u: None, persist_dir=tmp_path,
    )
    assert isinstance(state, AppState)
    assert len(state.index) == 0  # empty persist dir
    assert state.refresher.persist_dir == tmp_path
    assert state.refresher.index is state.index


def test_build_state_loads_persisted_index(tmp_path):
    from app.index import VectorIndex
    from app.records import IndexRecord

    seed = VectorIndex(FakeEmbedder(dim=8))
    seed.upsert([IndexRecord(id="entity:a", kind="entity", text="a | entity",
                             metadata={"name": "a"})])
    seed.save(tmp_path)

    state = build_state(_settings(), embedder=FakeEmbedder(dim=8),
                        connect=lambda u: None, persist_dir=tmp_path)
    assert len(state.index) == 1


def test_configure_logging_accepts_level():
    configure_logging("debug")  # must not raise
