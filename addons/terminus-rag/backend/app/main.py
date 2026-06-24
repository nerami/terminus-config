"""uvicorn entrypoint. Loads settings, configures stdout logging (captured by the
Supervisor), builds the real fastembed embedder, loads the persisted index, and
exposes ``app`` for ``uvicorn app.main:app``.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

from .config import Settings, load_settings
from .embedder import Embedder, FastEmbedEmbedder
from .index import VectorIndex
from .mcp_app import AppState, build_app
from .refresher import Refresher

logger = logging.getLogger(__name__)

# The Supervisor mounts a writable per-add-on volume at /data on-device. For
# laptop dev that path is the read-only macOS root, so allow an override via
# RAG_DATA_DIR (set in .env) pointing at a writable local dir.
_DATA_DIR = Path(os.environ.get("RAG_DATA_DIR", "/data"))
_DEFAULT_PERSIST = _DATA_DIR / "index"
_MODELS_DIR = _DATA_DIR / "models"


def configure_logging(level: str) -> None:
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )


def build_state(
    settings: Settings | None = None,
    *,
    embedder: Embedder | None = None,
    connect=None,
    persist_dir: Path | None = None,
) -> AppState:
    settings = settings or load_settings()
    persist_dir = persist_dir or _DEFAULT_PERSIST
    if embedder is None:
        embedder = FastEmbedEmbedder(model_name=settings.embed_model, cache_dir=str(_MODELS_DIR))
    if connect is None:
        from websockets.asyncio.client import connect as ws_connect
        connect = ws_connect

    index = VectorIndex.load(persist_dir, embedder)
    refresher = Refresher(index, settings, connect=connect)
    refresher.persist_dir = persist_dir
    return AppState(settings=settings, index=index, refresher=refresher)


# Module-level ASGI app served by `uvicorn app.main:app`.
_settings = load_settings()
configure_logging(_settings.log_level)
app = build_app(build_state(_settings))
