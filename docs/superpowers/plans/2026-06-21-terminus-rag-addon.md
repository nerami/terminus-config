# terminus-rag Add-on Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Home Assistant local add-on (`addons/terminus-rag/`, slug `local_terminus_rag`) that indexes the home's registry (entities, helpers, automations, scenes, scripts, blueprints, devices, areas, labels) with local ONNX embeddings and exposes semantic search, full enumeration, and on-demand history as an MCP server over Streamable HTTP at `http://local-terminus-rag:9000/mcp`.

**Architecture:** A single uvicorn process hosts a FastMCP (Streamable HTTP) ASGI app at `/mcp` plus a non-MCP `GET /health`. Eight MCP tools wrap an in-memory numpy cosine index (persisted to `/data/index`) fed by per-domain HA fetch functions, with a `fastembed` embedder (model cached under `/data/models`). A single asyncio background refresh loop polls HA every `refresh_interval`, hash-diffs the corpus, embeds only changed records, and persists atomically — degrading to the last-good index on failure. Optional bearer-token ASGI middleware gates `/mcp` (`/health` stays open).

**Tech Stack:** Python 3.12 (glibc `python:3.12-slim`), `mcp` (FastMCP, Streamable HTTP), `fastembed` (`TextEmbedding`, `BAAI/bge-small-en-v1.5`, 384-dim ONNX), `numpy`, `httpx`, `websockets`, `uvicorn[standard]`, `starlette`; `pytest` with `asyncio_mode = "auto"`.

## Global Constraints

These apply to **every** task below — each task's requirements implicitly include this section.

- **Base image:** `python:3.12-slim` (glibc, official Debian image) — **NOT** the Alpine HA base. `fastembed`/`onnxruntime` ship glibc (manylinux) wheels only. Consequently there is **no bashio and no s6-overlay**.
- **Options reading:** add-on options are read **directly from `/data/options.json`** in `config.py` (no `bashio::config`, no env export from `run.sh`). `run.sh` is a plain entrypoint that `exec`s uvicorn.
- **Versioning:** the version is bumped **ONLY in `config.yaml`**. `pyproject.toml` `version` is pinned to a static `"0.0.0"` (preserves the Docker pip dep-layer cache). Never sync them.
- **Changelog:** **every** `config.yaml` version bump must add a matching `CHANGELOG.md` entry under a heading equal to the new version. No bump without a changelog entry. Changelog starts at `0.1.0`.
- **Docker layering:** manifest-before-source — `COPY backend/pyproject.toml` → `pip install` (deps, with a stub `app` package) → `COPY backend/` → `pip install --no-deps --force-reinstall`. Source-only edits must not reinstall deps.
- **No BuildKit:** **no** `# syntax=docker/dockerfile:1` header and **no** `RUN --mount=type=cache` — the Supervisor's classic (docker-py) builder errors on them.
- **Python floor:** `requires-python = ">=3.12"` in `pyproject.toml`.
- **Tests:** pytest with `asyncio_mode = "auto"`; tests live under `backend/tests/`. Unit tests use a **deterministic fake embedder** (no model download). The one real-`fastembed` test is marked `@pytest.mark.slow` (opt-in).
- **Addressing:** slug `terminus_rag` → Supervisor slug `local_terminus_rag` → internal host `local-terminus-rag:9000`. Manifest has **no `ports:`** key (internal hassio network only) and `homeassistant_api: true`.
- **Error handling:** every broad `except` **logs before degrading** (module-level `logging.getLogger(__name__)`). A refresh that fails keeps the last-good index (degrade to stale, never to empty). MCP tools return structured `{"error": ...}` rather than raising.
- **Deploy:** sync via `bin/deploy-addons-ssh.sh`; on device `ha apps update local_terminus_rag` (version bumped) or `ha apps rebuild local_terminus_rag` (source-only). Update `main/AGENTS.md` add-on table.
- **Library API facts (verified via context7):**
  - FastMCP: `from mcp.server.fastmcp import FastMCP`; `FastMCP(name=..., stateless_http=True, json_response=True, host=..., port=...)`; `@mcp.tool()` decorator; tools return JSON-serializable objects; `mcp.streamable_http_app()` → a Starlette app serving `/mcp`; `@mcp.custom_route("/health", methods=["GET"])` with `async def h(request: Request) -> Response`; `mcp.run(transport="streamable-http")` runs uvicorn and manages the session-manager lifespan. Pin `mcp>=1.12,<2` (the stable `FastMCP` line `langchain-mcp-adapters` interoperates with).
  - fastembed: `from fastembed import TextEmbedding`; `TextEmbedding(model_name="BAAI/bge-small-en-v1.5", cache_dir="/data/models")`; `.embed(list[str])` returns a **generator** of `np.ndarray` `float32` shape `(384,)`; cast with `list(...)`. The model downloads on first use.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `addons/terminus-rag/config.yaml` | Add-on manifest + options/schema |
| Create | `addons/terminus-rag/CHANGELOG.md` | Version history (from 0.1.0) |
| Create | `addons/terminus-rag/Dockerfile` | glibc build, manifest-before-source |
| Create | `addons/terminus-rag/run.sh` | Plain entrypoint → `exec uvicorn` (via `app.main`) |
| Create | `addons/terminus-rag/README.md` | First-boot delay, model cache, deploy notes |
| Create | `addons/terminus-rag/CLAUDE.md` | Versioning + Docker caching rules (mirror terminus-langchain) |
| Create | `addons/terminus-rag/backend/pyproject.toml` | Deps, pytest config, `0.0.0` pin |
| Create | `addons/terminus-rag/backend/app/__init__.py` | Package marker |
| Create | `addons/terminus-rag/backend/app/config.py` | Resolve options + HA connection |
| Create | `addons/terminus-rag/backend/app/records.py` | `IndexRecord`, `compose_text`, `content_hash` |
| Create | `addons/terminus-rag/backend/app/embedder.py` | `fastembed` wrapper + `FakeEmbedder` |
| Create | `addons/terminus-rag/backend/app/index.py` | numpy cosine index + persistence |
| Create | `addons/terminus-rag/backend/app/ha_source.py` | short-lived HA ws/REST + per-domain `fetch_*` |
| Create | `addons/terminus-rag/backend/app/refresher.py` | hash-diff refresh pass, single-flight, poll loop |
| Create | `addons/terminus-rag/backend/app/history.py` | trace/logbook/history passthrough |
| Create | `addons/terminus-rag/backend/app/mcp_app.py` | FastMCP tools + auth middleware + `/health` + lifespan |
| Create | `addons/terminus-rag/backend/app/main.py` | uvicorn entrypoint |
| Create | `addons/terminus-rag/backend/tests/__init__.py` | Test package marker |
| Create | `addons/terminus-rag/backend/tests/conftest.py` | Shared fixtures (fake embedder, fake ws) |
| Create | `addons/terminus-rag/backend/tests/test_*.py` | Per-module tests |
| Modify | `main/AGENTS.md` | Add `local_terminus_rag` to the add-on table |

**Note on cwd:** all `pytest` and `git` commands run from `addons/terminus-rag/backend/` unless stated. All paths in this plan are relative to the worktree root `/Users/zrmn/Terminus/home-assistant/features/terminus-rag/`.

---

### Task 1: Add-on scaffold (manifest, Docker, entrypoint, packaging)

Produces the buildable add-on skeleton and the pytest harness. No app code yet beyond an empty package.

**Files:**
- Create: `addons/terminus-rag/config.yaml`
- Create: `addons/terminus-rag/CHANGELOG.md`
- Create: `addons/terminus-rag/Dockerfile`
- Create: `addons/terminus-rag/run.sh`
- Create: `addons/terminus-rag/README.md`
- Create: `addons/terminus-rag/CLAUDE.md`
- Create: `addons/terminus-rag/backend/pyproject.toml`
- Create: `addons/terminus-rag/backend/app/__init__.py`
- Create: `addons/terminus-rag/backend/tests/__init__.py`
- Test: `addons/terminus-rag/backend/tests/test_scaffold.py`

**Interfaces:**
- Produces: an importable `app` package; a pytest run that collects and passes; `config.yaml` with slug `terminus_rag`, `homeassistant_api: true`, no `ports:`; `pyproject.toml` with `version = "0.0.0"`, `requires-python = ">=3.12"`, `asyncio_mode = "auto"`, a `slow` marker.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_scaffold.py`:

```python
import tomllib
from pathlib import Path

import yaml

ADDON = Path(__file__).resolve().parents[2]


def test_pyproject_pins_version_and_python_floor():
    data = tomllib.loads((ADDON / "backend" / "pyproject.toml").read_text())
    assert data["project"]["version"] == "0.0.0"
    assert data["project"]["requires-python"] == ">=3.12"
    ini = data["tool"]["pytest"]["ini_options"]
    assert ini["asyncio_mode"] == "auto"
    assert any("slow" in m for m in ini["markers"])


def test_config_yaml_manifest_invariants():
    cfg = yaml.safe_load((ADDON / "config.yaml").read_text())
    assert cfg["slug"] == "terminus_rag"
    assert cfg["homeassistant_api"] is True
    assert "ports" not in cfg
    assert cfg["init"] is False
    assert cfg["startup"] == "application"
    assert cfg["options"]["refresh_interval"] == 600
    assert cfg["schema"]["api_token"] == "password?"


def test_changelog_has_first_release_heading():
    text = (ADDON / "CHANGELOG.md").read_text()
    cfg = yaml.safe_load((ADDON / "config.yaml").read_text())
    assert f"## {cfg['version']}" in text


def test_app_package_importable():
    import app  # noqa: F401
```

- [ ] **Step 2: Run test to verify it fails**

Run from `addons/terminus-rag/backend/`:
```bash
python -m pytest tests/test_scaffold.py -v
```
Expected: FAIL/ERROR — files don't exist (`FileNotFoundError` / `ModuleNotFoundError: No module named 'app'`).

- [ ] **Step 3: Create `config.yaml`**

```yaml
name: Terminus RAG
# Canonical add-on version — the ONLY version bumped on release. backend/pyproject.toml
# is intentionally pinned to "0.0.0" to preserve the Docker pip dependency-layer cache.
version: "0.1.0"
slug: terminus_rag
description: HA knowledge MCP server — semantic search + enumeration + history over the registry.
arch:
  - aarch64
  - amd64
init: false
homeassistant_api: true
boot: auto
startup: application
options:
  api_token: ""
  refresh_interval: 600
  embed_model: BAAI/bge-small-en-v1.5
  top_k_default: 10
  log_level: info
  ha_url: ""
  ha_token: ""
schema:
  api_token: password?
  refresh_interval: int
  embed_model: str
  top_k_default: int
  log_level: list(debug|info|warning|error)
  ha_url: str?
  ha_token: password?
```

- [ ] **Step 4: Create `CHANGELOG.md`**

```markdown
# Changelog

All notable changes to the Terminus RAG add-on are recorded here. The version
headings match `config.yaml` `version` (the single canonical version bumped on
release).

## 0.1.0

- Initial release. Standalone HA knowledge MCP server: in-memory numpy cosine
  index over the registry (entities, helpers, automations, scenes, scripts,
  blueprints, devices, areas, labels) with local ONNX embeddings
  (`fastembed`, `BAAI/bge-small-en-v1.5`). MCP tools over Streamable HTTP at
  `:9000/mcp`: `search_ha`, `list_records`, `get_record`, `list_kinds`,
  `get_automation_trace`, `get_logbook`, `get_history`, `refresh`; optional
  bearer-token auth; `GET /health`.
```

- [ ] **Step 5: Create `backend/pyproject.toml`**

```toml
[project]
name = "terminus-rag"
# Static placeholder. The add-on's real version lives in config.yaml (the only one
# bumped on release); keeping this constant avoids busting the Docker pip-install
# cache layer on every version bump. Do not sync it to config.yaml.
version = "0.0.0"
description = "Terminus RAG Home Assistant add-on backend"
requires-python = ">=3.12"
dependencies = [
    "mcp>=1.12,<2",
    "fastembed>=0.4",
    "numpy>=1.26",
    "httpx>=0.28",
    "websockets>=14",
    "uvicorn[standard]>=0.34",
    "starlette>=0.40",
    "pyyaml>=6",
]

[project.optional-dependencies]
dev = [
    "pytest>=8",
    "pytest-asyncio>=0.24",
]

[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[tool.setuptools.packages.find]
include = ["app*"]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
markers = [
    "slow: opt-in tests that download/run the real fastembed model",
]
```

- [ ] **Step 6: Create `backend/app/__init__.py` and `backend/tests/__init__.py`**

Both empty:
```python
```

- [ ] **Step 7: Create `Dockerfile`**

```dockerfile
# Plain glibc Debian base — fastembed/onnxruntime ship manylinux (glibc) wheels
# only, so the Alpine/musl HA base images cannot install them. No bashio, no s6.
# No "# syntax=" header and no RUN --mount cache: the Supervisor's classic builder
# errors on them.
FROM python:3.12-slim

WORKDIR /app

# Install backend dependencies first, keyed only on the dependency manifest.
# pyproject.toml's version is frozen at 0.0.0, so this layer is reused across
# version bumps and source-only edits; it re-runs only when deps change.
# setuptools needs a buildable package to read [project] metadata, so provide a
# stub package for this deps-only layer.
COPY backend/pyproject.toml /app/backend/pyproject.toml
RUN mkdir -p /app/backend/app \
    && touch /app/backend/app/__init__.py \
    && pip install --no-cache-dir "/app/backend"

# Copy the real backend source and reinstall just the project — dependencies are
# already cached above. This layer busts on any source edit but is cheap.
COPY backend/ /app/backend/
RUN pip install --no-cache-dir --no-deps --force-reinstall "/app/backend"

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 9000
CMD ["/run.sh"]
```

- [ ] **Step 8: Create `run.sh`**

```bash
#!/usr/bin/env bash
# Plain entrypoint (no bashio/s6 — this is the glibc python:3.12-slim base, not the
# Alpine HA base). Add-on options are read directly from /data/options.json in
# config.py; we only exec uvicorn here. SUPERVISOR_TOKEN is injected by the
# Supervisor (homeassistant_api: true).
set -e

mkdir -p /data/index /data/models
cd /app/backend
exec uvicorn app.main:app --host 0.0.0.0 --port 9000
```

- [ ] **Step 9: Create `README.md`**

```markdown
# Terminus RAG add-on

Standalone Home Assistant knowledge MCP server. Indexes the registry (entities,
helpers, automations, scenes, scripts, blueprints, devices, areas, labels) with
local ONNX embeddings and exposes:

- **Semantic search** (`search_ha`) — find "the lamp by the bed" without the id.
- **Full enumeration** (`list_records`, `list_kinds`, `get_record`).
- **On-demand history** (`get_automation_trace`, `get_logbook`, `get_history`) —
  passthrough to HA's own trace/logbook/recorder, so it inherits HA's retention
  (recorder ~10 days; automations keep ~`stored_traces` traces).
- **Manual `refresh`** to rescan now.

MCP Streamable HTTP at `http://local-terminus-rag:9000/mcp` (internal hassio
network; no LAN port). Optional bearer token via the `api_token` option.

## First boot

The embedding model (`BAAI/bge-small-en-v1.5`, ~130 MB) downloads once into
`/data/models` and is cached across restarts. During that download `/health`
reports `status: "warming"`. Subsequent boots are instant.

## Deploy

Sync source then update/rebuild on the device:

```bash
bin/deploy-addons-ssh.sh
# on device:
ha apps update local_terminus_rag     # if config.yaml version bumped
ha apps rebuild local_terminus_rag    # if source-only change
```

## Base image

`python:3.12-slim` (glibc), not the Alpine HA base — `fastembed`/`onnxruntime`
ship glibc wheels only. There is therefore no bashio/s6; `run.sh` is a plain
entrypoint and options are read directly from `/data/options.json`.
```

- [ ] **Step 10: Create `CLAUDE.md`**

```markdown
# Terminus RAG add-on

Standalone HA knowledge MCP server (`backend/`, Python). One Docker image
(`Dockerfile`), glibc base.

## Versioning / release

- **`config.yaml` `version` is the single canonical version** — the ONLY one bumped
  on release. **Do NOT bump `backend/pyproject.toml`** (pinned `0.0.0`; bumping it
  busts the Docker pip dep-layer cache). Adding/changing a real dependency still
  correctly invalidates that layer.
- **Every version bump adds a matching `CHANGELOG.md` entry** under a heading equal
  to the new `config.yaml` `version`.

## Local development / testing

- Local add-on → full slug `local_terminus_rag`.
- **Don't bump the version to test changes.** The Update button is version-gated for
  *releasing*, not iterating. To pick up source changes, **Rebuild**
  (`ha apps rebuild local_terminus_rag`), not Restart.
- If you changed `config.yaml` options/schema, **Reload** first
  (`ha supervisor reload && ha store reload`) so the Supervisor re-reads metadata.

## Docker caching strategy

- **Manifest-before-source:** `COPY backend/pyproject.toml` → `pip install`
  (stub `app` package) → `COPY backend/` → `pip install --no-deps`. Source-only
  edits reuse the dep layer.
- **No BuildKit cache mounts / no `# syntax=` header** — the classic builder errors
  on them.

## Base image

`python:3.12-slim` (glibc) — fastembed/onnxruntime need glibc wheels. No bashio, no
s6: `run.sh` is a plain entrypoint; options are read directly from
`/data/options.json` in `config.py`.
```

- [ ] **Step 11: Run tests to verify they pass**

Run from `addons/terminus-rag/backend/`:
```bash
python -m pytest tests/test_scaffold.py -v
```
Expected: PASS — 4 passed.

- [ ] **Step 12: Commit**

```bash
git add addons/terminus-rag/config.yaml addons/terminus-rag/CHANGELOG.md \
  addons/terminus-rag/Dockerfile addons/terminus-rag/run.sh \
  addons/terminus-rag/README.md addons/terminus-rag/CLAUDE.md \
  addons/terminus-rag/backend/pyproject.toml \
  addons/terminus-rag/backend/app/__init__.py \
  addons/terminus-rag/backend/tests/__init__.py \
  addons/terminus-rag/backend/tests/test_scaffold.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): add-on scaffold (config.yaml, Dockerfile, run.sh, pyproject, changelog)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 2: `config.py` — resolve options + HA connection

Mirrors terminus-langchain `config.py`: Supervisor token vs dev fallback, options from `/data/options.json`.

**Files:**
- Create: `addons/terminus-rag/backend/app/config.py`
- Test: `addons/terminus-rag/backend/tests/test_config.py`

**Interfaces:**
- Produces:
  - `Settings` (frozen dataclass): `ws_url: str`, `ha_token: str | None`, `use_supervisor: bool`, `api_token: str`, `refresh_interval: int`, `embed_model: str`, `top_k_default: int`, `log_level: str`.
  - `load_settings(env: Mapping[str, str] | None = None, options: Mapping[str, object] | None = None) -> Settings`
  - `load_options(path: Path = OPTIONS_PATH) -> dict`
  - `rest_target(settings: Settings) -> tuple[str | None, str | None]`
  - Constants `OPTIONS_PATH = Path("/data/options.json")`, `SUPERVISOR_WS_URL = "ws://supervisor/core/websocket"`, `DEFAULT_EMBED_MODEL = "BAAI/bge-small-en-v1.5"`.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_config.py`:

```python
from app.config import (
    DEFAULT_EMBED_MODEL,
    Settings,
    load_settings,
    rest_target,
)


def test_supervisor_token_takes_precedence():
    s = load_settings(env={"SUPERVISOR_TOKEN": "super"}, options={"api_token": "t"})
    assert s.use_supervisor is True
    assert s.ws_url == "ws://supervisor/core/websocket"
    assert s.ha_token == "super"
    assert s.api_token == "t"


def test_dev_fallback_uses_options_url_and_token():
    s = load_settings(
        env={}, options={"ha_url": "https://hass.local:8123", "ha_token": "llt"}
    )
    assert s.use_supervisor is False
    assert s.ws_url == "wss://hass.local:8123/api/websocket"
    assert s.ha_token == "llt"


def test_option_defaults():
    s = load_settings(env={}, options={})
    assert s.refresh_interval == 600
    assert s.embed_model == DEFAULT_EMBED_MODEL
    assert s.top_k_default == 10
    assert s.log_level == "info"
    assert s.api_token == ""
    assert s.ws_url == ""


def test_options_override_defaults():
    s = load_settings(
        env={},
        options={
            "refresh_interval": 120,
            "embed_model": "X",
            "top_k_default": 3,
            "log_level": "debug",
        },
    )
    assert s.refresh_interval == 120
    assert s.embed_model == "X"
    assert s.top_k_default == 3
    assert s.log_level == "debug"


def test_rest_target_supervisor():
    s = load_settings(env={"SUPERVISOR_TOKEN": "super"}, options={})
    assert rest_target(s) == ("http://supervisor/core", "super")


def test_rest_target_dev_derives_http_base():
    s = load_settings(
        env={}, options={"ha_url": "http://h:8123", "ha_token": "llt"}
    )
    assert rest_target(s) == ("http://h:8123", "llt")


def test_rest_target_unconfigured():
    assert rest_target(load_settings(env={}, options={})) == (None, None)


def test_settings_is_frozen():
    s = load_settings(env={}, options={})
    try:
        s.refresh_interval = 1  # type: ignore[misc]
    except Exception as exc:
        assert isinstance(exc, (AttributeError, TypeError))
    else:
        raise AssertionError("Settings should be frozen")
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_config.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.config'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/config.py`:

```python
"""Resolve add-on options and the Home Assistant connection.

Inside the Supervisor the add-on talks to Core through the Supervisor proxy
(``ws://supervisor/core/websocket``) authenticated with ``SUPERVISOR_TOKEN``. For
local development we fall back to an explicit HA URL plus long-lived token. Options
are read directly from ``/data/options.json`` (this is the glibc base — there is no
bashio to export them as env).
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

logger = logging.getLogger(__name__)

OPTIONS_PATH = Path("/data/options.json")
SUPERVISOR_WS_URL = "ws://supervisor/core/websocket"
DEFAULT_EMBED_MODEL = "BAAI/bge-small-en-v1.5"


@dataclass(frozen=True)
class Settings:
    ws_url: str
    ha_token: str | None
    use_supervisor: bool
    api_token: str
    refresh_interval: int
    embed_model: str
    top_k_default: int
    log_level: str


def _normalize_ws_url(raw: str) -> str:
    """Turn any HA URL form into a ``ws(s)://host/api/websocket`` endpoint."""
    url = raw.strip().rstrip("/")
    if url.endswith("/api/websocket"):
        url = url[: -len("/api/websocket")]

    if url.startswith("https://"):
        base = "wss://" + url[len("https://") :]
    elif url.startswith("http://"):
        base = "ws://" + url[len("http://") :]
    elif url.startswith(("ws://", "wss://")):
        base = url
    else:
        base = "ws://" + url
    return base + "/api/websocket"


def _as_int(value: object, default: int) -> int:
    try:
        return int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default


def rest_target(settings: "Settings") -> tuple[str | None, str | None]:
    """The HA REST base URL and bearer token, or ``(None, None)`` if unconfigured."""
    if settings.use_supervisor:
        return "http://supervisor/core", settings.ha_token
    if not settings.ws_url or not settings.ha_token:
        return None, None
    base = settings.ws_url
    if base.endswith("/api/websocket"):
        base = base[: -len("/api/websocket")]
    if base.startswith("wss://"):
        base = "https://" + base[len("wss://") :]
    elif base.startswith("ws://"):
        base = "http://" + base[len("ws://") :]
    return base, settings.ha_token


def load_options(path: Path = OPTIONS_PATH) -> dict:
    try:
        return json.loads(path.read_text())
    except FileNotFoundError:
        return {}
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning("options.json present but unreadable: %s", exc)
        return {}


def load_settings(
    env: Mapping[str, str] | None = None,
    options: Mapping[str, object] | None = None,
) -> Settings:
    env = os.environ if env is None else env
    options = load_options() if options is None else options

    api_token = str(options.get("api_token") or env.get("RAG_API_TOKEN", ""))
    refresh_interval = _as_int(options.get("refresh_interval"), 600)
    embed_model = str(options.get("embed_model") or DEFAULT_EMBED_MODEL)
    top_k_default = _as_int(options.get("top_k_default"), 10)
    log_level = str(options.get("log_level") or env.get("LOG_LEVEL") or "info")

    supervisor_token = env.get("SUPERVISOR_TOKEN")
    if supervisor_token:
        return Settings(
            ws_url=SUPERVISOR_WS_URL,
            ha_token=supervisor_token,
            use_supervisor=True,
            api_token=api_token,
            refresh_interval=refresh_interval,
            embed_model=embed_model,
            top_k_default=top_k_default,
            log_level=log_level,
        )

    raw_url = str(options.get("ha_url") or env.get("HASS_URL") or env.get("HA_URL") or "")
    ha_token = (
        options.get("ha_token") or env.get("HASS_TOKEN") or env.get("HA_TOKEN") or None
    )
    return Settings(
        ws_url=_normalize_ws_url(raw_url) if raw_url else "",
        ha_token=str(ha_token) if ha_token else None,
        use_supervisor=False,
        api_token=api_token,
        refresh_interval=refresh_interval,
        embed_model=embed_model,
        top_k_default=top_k_default,
        log_level=log_level,
    )
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_config.py -v
```
Expected: PASS — 8 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/config.py \
  addons/terminus-rag/backend/tests/test_config.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): config.py resolving add-on options + HA connection

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 3: `records.py` — `IndexRecord`, `compose_text`, `content_hash`

Pure module. The latent seam: everything indexable becomes an `IndexRecord`.

**Files:**
- Create: `addons/terminus-rag/backend/app/records.py`
- Test: `addons/terminus-rag/backend/tests/test_records.py`

**Interfaces:**
- Produces:
  - `@dataclass(frozen=True) class IndexRecord` with fields `id: str`, `kind: str`, `text: str`, `metadata: dict` (note: `metadata` is a plain dict; the dataclass is frozen but the dict is not hashed — never put `IndexRecord` in a set).
  - `compose_text(kind: str, *, name: str, domain: str | None = None, area_name: str | None = None, device_name: str | None = None, aliases: list[str] | None = None, original_name: str | None = None, extra: list[str] | None = None) -> str` — builds the dense ` | `-joined descriptor.
  - `content_hash(text: str) -> str` — `sha256` hex digest of `text`.
  - `HELPER_DOMAINS: frozenset[str]` — `{"input_boolean","input_number","input_text","input_select","input_datetime","input_button","timer","counter","schedule"}`.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_records.py`:

```python
from app.records import (
    HELPER_DOMAINS,
    IndexRecord,
    compose_text,
    content_hash,
)


def test_compose_text_full_entity():
    text = compose_text(
        "entity",
        name="Master Bedroom LED One",
        domain="light",
        area_name="Master Bedroom",
        device_name="MB Strip",
        aliases=["bedside", "reading light"],
        original_name="LED One",
    )
    assert text == (
        "Master Bedroom LED One | light | area: Master Bedroom | "
        "device: MB Strip | aliases: bedside, reading light | original: LED One"
    )


def test_compose_text_omits_absent_parts():
    assert compose_text("scene", name="Movie Night") == "Movie Night | scene"


def test_compose_text_area_only():
    text = compose_text("entity", name="Lamp", domain="light", area_name="Living")
    assert text == "Lamp | light | area: Living"


def test_compose_text_extra_segments_appended():
    text = compose_text("blueprint", name="Motion Light", extra=["domain: automation"])
    assert text == "Motion Light | blueprint | domain: automation"


def test_content_hash_stable_and_changes():
    a = content_hash("Lamp | light")
    assert a == content_hash("Lamp | light")
    assert a != content_hash("Lamp | light | area: Living")
    assert len(a) == 64  # sha256 hex


def test_index_record_is_frozen():
    r = IndexRecord(id="entity:light.x", kind="entity", text="t", metadata={})
    try:
        r.kind = "scene"  # type: ignore[misc]
    except Exception as exc:
        assert isinstance(exc, (AttributeError, TypeError))
    else:
        raise AssertionError("IndexRecord should be frozen")


def test_helper_domains_constant():
    assert "input_boolean" in HELPER_DOMAINS
    assert "timer" in HELPER_DOMAINS
    assert "light" not in HELPER_DOMAINS
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_records.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.records'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/records.py`:

```python
"""The latent ingestion seam: every indexable HA item is an ``IndexRecord``.

``compose_text`` builds the dense descriptor that gets embedded (richer text ⇒
better fuzzy matches). ``content_hash`` over that text drives incremental
re-embedding (only changed records are re-embedded).
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass

# Config entities tagged kind="helper" rather than "entity" (documented constant).
HELPER_DOMAINS: frozenset[str] = frozenset(
    {
        "input_boolean",
        "input_number",
        "input_text",
        "input_select",
        "input_datetime",
        "input_button",
        "timer",
        "counter",
        "schedule",
    }
)


@dataclass(frozen=True)
class IndexRecord:
    id: str  # stable unique: f"{kind}:{native_id}" e.g. "entity:light.mb_led_one"
    kind: str  # entity|helper|automation|scene|script|blueprint|device|area|label
    text: str  # the embedded string (compose_text output)
    metadata: dict  # everything a consumer wants back


def compose_text(
    kind: str,
    *,
    name: str,
    domain: str | None = None,
    area_name: str | None = None,
    device_name: str | None = None,
    aliases: list[str] | None = None,
    original_name: str | None = None,
    extra: list[str] | None = None,
) -> str:
    """Build the dense ``|``-joined descriptor embedded for semantic match.

    The second segment is the ``domain`` when one is given (entities/helpers), else
    the ``kind`` itself (e.g. ``"Movie Night | scene"``).
    """
    parts: list[str] = [name, kind if domain is None else domain]
    if area_name:
        parts.append(f"area: {area_name}")
    if device_name:
        parts.append(f"device: {device_name}")
    if aliases:
        parts.append("aliases: " + ", ".join(aliases))
    if original_name:
        parts.append(f"original: {original_name}")
    if extra:
        parts.extend(extra)
    return " | ".join(parts)


def content_hash(text: str) -> str:
    """Stable sha256 hex digest of the embedded text (drives re-embedding)."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_records.py -v
```
Expected: PASS — 7 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/records.py \
  addons/terminus-rag/backend/tests/test_records.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): records.py — IndexRecord, compose_text, content_hash

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 4: `embedder.py` — fastembed wrapper + deterministic fake

Thin, injectable wrapper. Unit tests use `FakeEmbedder` (no download). One real-model test is `@pytest.mark.slow`.

**Files:**
- Create: `addons/terminus-rag/backend/app/embedder.py`
- Create: `addons/terminus-rag/backend/tests/conftest.py`
- Test: `addons/terminus-rag/backend/tests/test_embedder.py`

**Interfaces:**
- Produces:
  - `EMBED_DIM = 384`
  - `class Embedder(Protocol)` with `dim: int` and `embed(self, texts: list[str]) -> np.ndarray` returning shape `(len(texts), dim)` `float32`, **L2-normalized rows**.
  - `class FastEmbedEmbedder` (constructor `(model_name: str = "BAAI/bge-small-en-v1.5", cache_dir: str = "/data/models")`; lazy-loads `TextEmbedding` on first `embed`). Implements `Embedder`.
  - `class FakeEmbedder(dim: int = 8)` — deterministic vectors from a seeded hash of each text; L2-normalized. Implements `Embedder`. Lives in `embedder.py` (importable by both tests and any future harness).
  - `def l2_normalize(mat: np.ndarray) -> np.ndarray` — row-normalize, leaving zero rows as zeros.
- conftest provides fixture `fake_embedder() -> FakeEmbedder`.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/conftest.py`:

```python
import pytest

from app.embedder import FakeEmbedder


@pytest.fixture
def fake_embedder() -> FakeEmbedder:
    return FakeEmbedder(dim=8)
```

Create `addons/terminus-rag/backend/tests/test_embedder.py`:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_embedder.py -v -m "not slow"
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.embedder'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/embedder.py`:

```python
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_embedder.py -v -m "not slow"
```
Expected: PASS — 5 passed, 1 deselected (the slow test).

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/embedder.py \
  addons/terminus-rag/backend/tests/conftest.py \
  addons/terminus-rag/backend/tests/test_embedder.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): embedder.py — fastembed wrapper + deterministic FakeEmbedder

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 5: `index.py` — in-memory numpy cosine index + persistence

Holds the vectors, metadata, and content-hashes; does search/list and atomic save/load.

**Files:**
- Create: `addons/terminus-rag/backend/app/index.py`
- Test: `addons/terminus-rag/backend/tests/test_index.py`

**Interfaces:**
- Consumes: `IndexRecord`, `content_hash` (records.py); `Embedder`, `EMBED_DIM`, `l2_normalize` (embedder.py).
- Produces:
  - `class VectorIndex(embedder: Embedder)`:
    - `upsert(records: list[IndexRecord]) -> dict` — adds/replaces records keyed by `record.id`, embedding only those whose `content_hash(text)` differs from the stored one; returns `{"added": int, "changed": int, "unchanged": int}`.
    - `remove(ids: list[str]) -> int` — drops records by id; returns count removed.
    - `reconcile(records: list[IndexRecord]) -> dict` — upsert the given set **and** remove any stored ids not present; returns `{"added", "changed", "removed", "total"}`.
    - `search(query_vec: np.ndarray, *, kind: str | None = None, area: str | None = None, top_k: int = 10) -> list[dict]` — cosine top-k over the (optionally filtered) corpus; each hit `{"id","kind","name","domain","area","score","metadata"}`.
    - `list_records(*, kind: str | None = None, area: str | None = None) -> list[dict]` — full enumeration (no embedding); each `{"id","kind","name", **metadata}`.
    - `list_kinds() -> list[dict]` — `[{"kind","count"}]` sorted by kind.
    - `get(id: str, kind: str) -> dict | None` — exact metadata for one record (matching id and kind), else `None`.
    - `embed_query(query: str) -> np.ndarray` — `self.embedder.embed([query])[0]`.
    - `__len__()` → record count.
    - `save(path: Path) -> None` / classmethod `load(path: Path, embedder: Embedder) -> "VectorIndex"` — `vectors.npy` + `meta.json` + `hashes.json`, atomic (temp file + `os.replace`). `load` of a missing dir returns an empty index.
  - Internal record dict shape stored in `meta.json`: `{"id","kind","text","metadata","name","domain","area"}` where `name`/`domain`/`area` are denormalized from `metadata` for cheap filtering/return.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_index.py`:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_index.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.index'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/index.py`:

```python
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
        wanted = {r.id for r in records}
        gone = [i for i in self._ids if i not in wanted]
        removed = self.remove(gone)
        up = self.upsert(records)
        return {
            "added": up["added"],
            "changed": up["changed"],
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
        q = np.asarray(query_vec, dtype=np.float32).reshape(-1)
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

        _atomic_write("vectors.npy", lambda t: np.save(t, self._vectors))
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_index.py -v
```
Expected: PASS — 9 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/index.py \
  addons/terminus-rag/backend/tests/test_index.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): index.py — numpy cosine index, upsert/reconcile/search/list + persistence

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 6: `ha_source.py` — short-lived HA client + per-domain `fetch_*`

Opens a short-lived authenticated websocket (and REST where needed), runs the registry list commands, and normalizes each domain into `IndexRecord`s. Per-source failures are logged and isolated.

**Files:**
- Create: `addons/terminus-rag/backend/app/ha_source.py`
- Test: `addons/terminus-rag/backend/tests/test_ha_source.py`

**Interfaces:**
- Consumes: `IndexRecord`, `compose_text`, `HELPER_DOMAINS` (records.py); `Settings`, `rest_target` (config.py).
- Produces:
  - `HASourceError(Exception)`
  - `ConnectFn = Callable[[str], Any]` (async-context-manager factory yielding a ws with `send`/`recv`).
  - Pure normalizers (registry JSON → records), each `(...) -> list[IndexRecord]`:
    - `build_area_records(areas: list[dict]) -> list[IndexRecord]`
    - `build_label_records(labels: list[dict]) -> list[IndexRecord]`
    - `build_device_records(devices: list[dict]) -> list[IndexRecord]`
    - `build_entity_records(entities: list[dict], states: list[dict], areas: list[dict], devices: list[dict]) -> list[IndexRecord]` — tags helper domains `kind="helper"`; resolves area `entity.area_id` → device's `area_id`; denormalizes area/device names.
    - `build_scene_script_automation_records(states: list[dict]) -> list[IndexRecord]` — from `get_states`; scenes carry `entities`, automations carry `numeric_id`.
    - `build_blueprint_records(blueprints: dict) -> list[IndexRecord]` — flattens the `blueprint/list` per-domain map.
  - `async def fetch_all(settings: Settings, connect: ConnectFn) -> tuple[list[IndexRecord], list[str]]` — opens one ws, runs every list command, calls each normalizer under its own try/except (logging+skipping failures), returns `(records, errors)` where `errors` names the failed sources.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_ha_source.py`:

```python
import json

from app.config import Settings
from app.ha_source import (
    build_area_records,
    build_blueprint_records,
    build_device_records,
    build_entity_records,
    build_label_records,
    build_scene_script_automation_records,
    fetch_all,
)


def _settings():
    return Settings(
        ws_url="ws://x", ha_token="tok", use_supervisor=False, api_token="",
        refresh_interval=600, embed_model="m", top_k_default=10, log_level="info",
    )


AREAS = [{"area_id": "mb", "name": "Master Bedroom", "labels": ["sleep"]}]
LABELS = [{"label_id": "sleep", "name": "Sleep", "color": "blue"}]
DEVICES = [{"id": "dev1", "name": "MB Strip", "manufacturer": "Acme",
            "model": "S1", "area_id": "mb"}]
ENTITIES = [
    {"entity_id": "light.mb_led", "area_id": None, "device_id": "dev1",
     "name": None, "original_name": "Led One", "aliases": ["bedside"]},
    {"entity_id": "timer.tea", "area_id": "mb", "device_id": None,
     "name": "Tea Timer", "original_name": None, "aliases": []},
]
STATES = [
    {"entity_id": "light.mb_led", "attributes": {"friendly_name": "MB LED One"}},
    {"entity_id": "timer.tea", "attributes": {"friendly_name": "Tea Timer"}},
    {"entity_id": "scene.movie",
     "attributes": {"friendly_name": "Movie", "entity_id": ["light.mb_led"]}},
    {"entity_id": "script.bedtime", "attributes": {"friendly_name": "Bedtime"}},
    {"entity_id": "automation.night",
     "attributes": {"friendly_name": "Night", "id": "1699"}},
]
BLUEPRINTS = {
    "automation": {
        "motion/light.yaml": {"metadata": {"name": "Motion Light",
                                           "source_url": "http://x"}},
    },
    "script": {},
}


def test_area_records():
    recs = build_area_records(AREAS)
    assert recs[0].id == "area:mb"
    assert recs[0].kind == "area"
    assert recs[0].metadata["name"] == "Master Bedroom"
    assert "Master Bedroom" in recs[0].text


def test_label_records():
    recs = build_label_records(LABELS)
    assert recs[0].id == "label:sleep"
    assert recs[0].metadata["color"] == "blue"


def test_device_records():
    recs = build_device_records(DEVICES)
    assert recs[0].id == "device:dev1"
    assert recs[0].metadata["manufacturer"] == "Acme"
    assert "MB Strip" in recs[0].text


def test_entity_records_area_fallback_and_helper_tagging():
    recs = build_entity_records(ENTITIES, STATES, AREAS, DEVICES)
    by_id = {r.id: r for r in recs}
    led = by_id["entity:light.mb_led"]
    assert led.kind == "entity"
    # area resolved via device dev1 -> mb -> "Master Bedroom"
    assert led.metadata["area_name"] == "Master Bedroom"
    assert led.metadata["device_name"] == "MB Strip"
    assert "bedside" in led.text  # alias embedded
    timer = by_id["helper:timer.tea"]
    assert timer.kind == "helper"
    assert timer.metadata["domain"] == "timer"


def test_scene_script_automation_records():
    recs = build_scene_script_automation_records(STATES)
    by_id = {r.id: r for r in recs}
    assert by_id["scene:scene.movie"].metadata["entities"] == ["light.mb_led"]
    assert by_id["automation:automation.night"].metadata["numeric_id"] == "1699"
    assert by_id["script:script.bedtime"].kind == "script"
    # entities/timers are NOT produced here (handled by build_entity_records)
    assert "entity:light.mb_led" not in by_id


def test_blueprint_records():
    recs = build_blueprint_records(BLUEPRINTS)
    assert recs[0].id == "blueprint:automation:motion/light.yaml"
    assert recs[0].metadata["domain"] == "automation"
    assert recs[0].metadata["source_url"] == "http://x"


class FakeWS:
    def __init__(self, results):
        # results: dict mapping command "type" -> result payload
        self._results = results
        self._queue = [json.dumps({"type": "auth_required"})]
        self._pending_id = None

    async def send(self, data):
        msg = json.loads(data)
        if msg.get("type") == "auth":
            self._queue.append(json.dumps({"type": "auth_ok"}))
            return
        result = self._results.get(msg["type"], [])
        self._queue.append(json.dumps({"id": msg["id"], "success": True, "result": result}))

    async def recv(self):
        return self._queue.pop(0)


def _fake_connect(ws):
    class _CM:
        async def __aenter__(self):
            return ws

        async def __aexit__(self, *exc):
            return False

    return lambda url: _CM()


async def test_fetch_all_assembles_all_kinds():
    ws = FakeWS({
        "config/area_registry/list": AREAS,
        "config/label_registry/list": LABELS,
        "config/device_registry/list": DEVICES,
        "config/entity_registry/list": ENTITIES,
        "get_states": STATES,
        "blueprint/list": BLUEPRINTS,
    })
    records, errors = await fetch_all(_settings(), _fake_connect(ws))
    assert errors == []
    kinds = {r.kind for r in records}
    assert kinds == {"area", "label", "device", "entity", "helper",
                     "scene", "script", "automation", "blueprint"}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_ha_source.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.ha_source'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/ha_source.py`:

```python
"""Short-lived authenticated HA websocket reads + per-domain normalizers that turn
registry JSON into IndexRecords. Each normalizer is pure and unit-tested; ``fetch_all``
runs them under isolated try/except so one failing source is logged and skipped while
the others still index.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Callable

from .config import Settings
from .records import HELPER_DOMAINS, IndexRecord, compose_text

logger = logging.getLogger(__name__)

ConnectFn = Callable[[str], Any]


class HASourceError(Exception):
    pass


# -- ws helpers -----------------------------------------------------------
async def _authenticate(ws, token: str | None) -> None:
    msg = json.loads(await ws.recv())
    if msg.get("type") != "auth_required":
        raise HASourceError(f"unexpected greeting: {msg.get('type')!r}")
    await ws.send(json.dumps({"type": "auth", "access_token": token}))
    msg = json.loads(await ws.recv())
    if msg.get("type") != "auth_ok":
        raise HASourceError(msg.get("message", "authentication failed"))


async def _command(ws, mid: int, payload: dict) -> Any:
    await ws.send(json.dumps({"id": mid, **payload}))
    while True:
        msg = json.loads(await ws.recv())
        if msg.get("id") == mid:
            if not msg.get("success", True):
                raise HASourceError((msg.get("error") or {}).get("message", "command failed"))
            return msg.get("result")


# -- normalizers (pure) ---------------------------------------------------
def build_area_records(areas: list[dict]) -> list[IndexRecord]:
    out = []
    for a in areas:
        aid = a.get("area_id")
        if not aid:
            continue
        name = a.get("name") or aid
        meta = {"area_id": aid, "name": name, "labels": a.get("labels") or []}
        out.append(IndexRecord(
            id=f"area:{aid}", kind="area",
            text=compose_text("area", name=name), metadata=meta,
        ))
    return out


def build_label_records(labels: list[dict]) -> list[IndexRecord]:
    out = []
    for lb in labels:
        lid = lb.get("label_id")
        if not lid:
            continue
        name = lb.get("name") or lid
        meta = {"label_id": lid, "name": name, "color": lb.get("color")}
        out.append(IndexRecord(
            id=f"label:{lid}", kind="label",
            text=compose_text("label", name=name), metadata=meta,
        ))
    return out


def build_device_records(devices: list[dict]) -> list[IndexRecord]:
    out = []
    for d in devices:
        did = d.get("id")
        if not did:
            continue
        name = d.get("name_by_user") or d.get("name") or did
        meta = {
            "device_id": did, "name": name,
            "manufacturer": d.get("manufacturer"), "model": d.get("model"),
            "area_id": d.get("area_id"),
        }
        out.append(IndexRecord(
            id=f"device:{did}", kind="device",
            text=compose_text(
                "device", name=name,
                extra=[p for p in [d.get("manufacturer"), d.get("model")] if p],
            ),
            metadata=meta,
        ))
    return out


def build_entity_records(
    entities: list[dict], states: list[dict], areas: list[dict], devices: list[dict]
) -> list[IndexRecord]:
    area_name = {a["area_id"]: (a.get("name") or a["area_id"]) for a in areas if a.get("area_id")}
    dev_by_id = {d["id"]: d for d in devices if d.get("id")}
    state_by_id = {s["entity_id"]: s for s in states if s.get("entity_id")}

    out = []
    for e in entities:
        eid = e.get("entity_id")
        if not eid or "." not in eid:
            continue
        domain = eid.split(".", 1)[0]
        # registry editor automations/scenes/scripts are covered by the state-based
        # builder; skip them here so we don't double-index.
        if domain in ("automation", "scene", "script"):
            continue
        kind = "helper" if domain in HELPER_DOMAINS else "entity"

        dev = dev_by_id.get(e.get("device_id")) if e.get("device_id") else None
        aid = e.get("area_id") or (dev.get("area_id") if dev else None)
        a_name = area_name.get(aid) if aid else None
        d_name = (dev.get("name_by_user") or dev.get("name")) if dev else None

        attrs = (state_by_id.get(eid) or {}).get("attributes") or {}
        name = (
            attrs.get("friendly_name") or e.get("name")
            or e.get("original_name") or eid
        )
        aliases = [a for a in (e.get("aliases") or []) if a]

        meta = {
            "entity_id": eid, "name": name, "domain": domain,
            "area_id": aid, "area_name": a_name,
            "device_id": e.get("device_id"), "device_name": d_name,
            "aliases": aliases,
        }
        out.append(IndexRecord(
            id=f"{kind}:{eid}", kind=kind,
            text=compose_text(
                kind, name=name, domain=domain, area_name=a_name,
                device_name=d_name, aliases=aliases or None,
                original_name=e.get("original_name"),
            ),
            metadata=meta,
        ))
    return out


def build_scene_script_automation_records(states: list[dict]) -> list[IndexRecord]:
    out = []
    for s in states:
        eid = s.get("entity_id")
        if not eid or "." not in eid:
            continue
        domain = eid.split(".", 1)[0]
        if domain not in ("scene", "script", "automation"):
            continue
        attrs = s.get("attributes") or {}
        name = attrs.get("friendly_name") or eid
        meta: dict = {"entity_id": eid, "name": name}
        if domain == "scene":
            meta["entities"] = list(attrs.get("entity_id") or [])
        elif domain == "automation":
            meta["numeric_id"] = attrs.get("id")
        out.append(IndexRecord(
            id=f"{domain}:{eid}", kind=domain,
            text=compose_text(domain, name=name), metadata=meta,
        ))
    return out


def build_blueprint_records(blueprints: dict) -> list[IndexRecord]:
    out = []
    for domain, entries in (blueprints or {}).items():
        if not isinstance(entries, dict):
            continue
        for path, info in entries.items():
            meta_in = (info or {}).get("metadata") or {}
            name = meta_in.get("name") or path
            meta = {
                "path": path, "domain": domain, "name": name,
                "source_url": meta_in.get("source_url"),
            }
            out.append(IndexRecord(
                id=f"blueprint:{domain}:{path}", kind="blueprint",
                text=compose_text("blueprint", name=name, extra=[f"domain: {domain}"]),
                metadata=meta,
            ))
    return out


# -- orchestration --------------------------------------------------------
async def fetch_all(settings: Settings, connect: ConnectFn) -> tuple[list[IndexRecord], list[str]]:
    """Open one short-lived ws, fetch every source, normalize each in isolation.

    Returns ``(records, errors)``; ``errors`` lists the sources that failed (logged).
    A normalizer raising does not abort the others.
    """
    records: list[IndexRecord] = []
    errors: list[str] = []

    async with connect(settings.ws_url) as ws:
        await _authenticate(ws, settings.ha_token)
        areas = await _command(ws, 1, {"type": "config/area_registry/list"}) or []
        labels = await _command(ws, 2, {"type": "config/label_registry/list"}) or []
        devices = await _command(ws, 3, {"type": "config/device_registry/list"}) or []
        entities = await _command(ws, 4, {"type": "config/entity_registry/list"}) or []
        states = await _command(ws, 5, {"type": "get_states"}) or []
        try:
            blueprints = await _command(ws, 6, {"type": "blueprint/list"}) or {}
        except Exception as exc:  # noqa: BLE001 - blueprints optional; log + skip
            logger.warning("blueprint/list failed: %s", exc)
            blueprints = {}
            errors.append("blueprint")

    sources = [
        ("area", lambda: build_area_records(areas)),
        ("label", lambda: build_label_records(labels)),
        ("device", lambda: build_device_records(devices)),
        ("entity", lambda: build_entity_records(entities, states, areas, devices)),
        ("scene_script_automation", lambda: build_scene_script_automation_records(states)),
        ("blueprint", lambda: build_blueprint_records(blueprints)),
    ]
    for name, fn in sources:
        try:
            records.extend(fn())
        except Exception as exc:  # noqa: BLE001 - isolate per-source failure
            logger.warning("source %s normalization failed: %s", name, exc)
            errors.append(name)

    return records, errors
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_ha_source.py -v
```
Expected: PASS — 7 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/ha_source.py \
  addons/terminus-rag/backend/tests/test_ha_source.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): ha_source.py — per-domain fetch_* normalizers + fetch_all

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 7: `refresher.py` — hash-diff refresh, single-flight, poll loop, keep-last-good

Orchestrates a refresh pass and owns the asyncio poll loop. Single-flight via `asyncio.Lock`; a failed fetch keeps the prior index.

**Files:**
- Create: `addons/terminus-rag/backend/app/refresher.py`
- Test: `addons/terminus-rag/backend/tests/test_refresher.py`

**Interfaces:**
- Consumes: `VectorIndex` (index.py); `fetch_all`, `ConnectFn` (ha_source.py); `Settings` (config.py); `IndexRecord` (records.py).
- Produces:
  - `class Refresher(index: VectorIndex, settings: Settings, connect: ConnectFn, *, fetch=fetch_all)`:
    - `async def refresh_once() -> dict` — single-flight; on success `index.reconcile(records)`, persist via `self._persist()`, set `last_refresh`/`last_error`; returns `{"added","changed","removed","total","took_ms","errors"}`. On fetch failure: log, set `last_error`, **keep prior index**, return `{"error": str, "total": len(index)}`.
    - `async def run_loop() -> None` — `await refresh_once()` then loop sleeping `settings.refresh_interval` until `stop()`.
    - `def stop() -> None`
    - `last_refresh: str | None`, `last_error: str | None` (read by `/health`).
    - `persist_dir: Path` attribute (default `Path("/data/index")`); `_persist()` calls `index.save(persist_dir)`. Injectable for tests.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_refresher.py`:

```python
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


async def test_single_flight_one_runs(tmp_path, fake_embedder):
    calls = {"n": 0}

    async def fetch(settings, connect):
        calls["n"] += 1
        await asyncio.sleep(0.05)
        return [_rec("entity:a")], []

    r, idx = _refresher(tmp_path, fake_embedder, fetch)
    results = await asyncio.gather(r.refresh_once(), r.refresh_once())
    # both return, but fetch ran once (the second awaited the lock then no-op'd
    # because the corpus is identical — added/changed 0)
    assert calls["n"] == 1
    assert any("skipped" in res or res.get("total") == 1 for res in results)


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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_refresher.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.refresher'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/refresher.py`:

```python
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
        if self._lock.locked():
            logger.debug("refresh already in progress; skipping concurrent request")
            return {"skipped": True, "total": len(self.index)}
        async with self._lock:
            t0 = time.monotonic()
            try:
                records, errors = await self._fetch(self.settings, self.connect)
            except Exception as exc:  # noqa: BLE001 - keep last-good index
                self.last_error = f"{type(exc).__name__}: {exc}"
                logger.warning("refresh fetch failed (%s); keeping prior index", self.last_error)
                return {"error": self.last_error, "total": len(self.index)}

            stats = self.index.reconcile(records)
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_refresher.py -v
```
Expected: PASS — 6 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/refresher.py \
  addons/terminus-rag/backend/tests/test_refresher.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): refresher.py — hash-diff refresh, single-flight, poll loop, keep-last-good

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 8: `history.py` — trace / logbook / history passthrough

On-demand passthrough to HA's trace/logbook/recorder APIs. No index involvement. Returns `{"error": ...}` on HA failure rather than raising.

**Files:**
- Create: `addons/terminus-rag/backend/app/history.py`
- Test: `addons/terminus-rag/backend/tests/test_history.py`

**Interfaces:**
- Consumes: `Settings`, `rest_target` (config.py); `ConnectFn`, `_authenticate`, `_command` (ha_source.py — reuse, imported).
- Produces:
  - `async def get_automation_trace(settings: Settings, connect: ConnectFn, automation: str, run_id: str | None = None, *, numeric_resolver=None) -> dict` — resolve `automation` (entity id `automation.x` or numeric id) to a numeric id, `trace/list` → newest (or `run_id`) → `trace/get`; returns `{"run_id","config","trace"}` or `{"error": ...}`. `numeric_resolver(entity_id) -> str | None` is injectable (defaults to stripping `automation.` and reading the numeric id from `get_states`).
  - `async def get_logbook(settings: Settings, start: str, end: str | None = None, entity_id: str | None = None, *, transport=None) -> dict` — REST `GET /api/logbook/{start}` with `?end_time=&entity=`; returns `{"events": [...]}` or `{"error": ...}`.
  - `async def get_history(settings: Settings, entity_id: str, start: str, end: str | None = None, *, transport=None) -> dict` — REST `GET /api/history/period/{start}?filter_entity_id=&end_time=`; returns `{"history": [...]}` or `{"error": ...}`.
  - Each returns plain JSON-serializable dicts.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_history.py`:

```python
import json

import httpx

from app.config import Settings
from app.history import get_automation_trace, get_history, get_logbook


def _settings(supervisor=True):
    if supervisor:
        return Settings(
            ws_url="ws://supervisor/core/websocket", ha_token="super",
            use_supervisor=True, api_token="", refresh_interval=600,
            embed_model="m", top_k_default=10, log_level="info",
        )
    return Settings(
        ws_url="", ha_token=None, use_supervisor=False, api_token="",
        refresh_interval=600, embed_model="m", top_k_default=10, log_level="info",
    )


class FakeWS:
    def __init__(self, results):
        self._results = results
        self._queue = [json.dumps({"type": "auth_required"})]

    async def send(self, data):
        msg = json.loads(data)
        if msg.get("type") == "auth":
            self._queue.append(json.dumps({"type": "auth_ok"}))
            return
        result = self._results.get(msg["type"], [])
        self._queue.append(json.dumps({"id": msg["id"], "success": True, "result": result}))

    async def recv(self):
        return self._queue.pop(0)


def _connect(ws):
    class _CM:
        async def __aenter__(self):
            return ws

        async def __aexit__(self, *exc):
            return False

    return lambda url: _CM()


async def test_get_automation_trace_picks_newest():
    ws = FakeWS({
        "trace/list": [
            {"run_id": "old", "timestamp": {"start": "2026-06-20T00:00:00Z"}},
            {"run_id": "new", "timestamp": {"start": "2026-06-21T00:00:00Z"}},
        ],
        "trace/get": {"config": {"alias": "Night"}, "trace": {"x": 1}},
    })
    out = await get_automation_trace(
        _settings(), _connect(ws), "1699",
    )
    assert out["run_id"] == "new"
    assert out["config"]["alias"] == "Night"


async def test_get_automation_trace_no_traces():
    ws = FakeWS({"trace/list": []})
    out = await get_automation_trace(_settings(), _connect(ws), "1699")
    assert "error" in out


async def test_get_automation_trace_resolves_entity_id():
    ws = FakeWS({
        "trace/list": [{"run_id": "r1", "timestamp": {"start": "2026-06-21T00:00:00Z"}}],
        "trace/get": {"config": {}, "trace": {}},
    })
    out = await get_automation_trace(
        _settings(), _connect(ws), "automation.night",
        numeric_resolver=lambda eid: "1699",
    )
    assert out["run_id"] == "r1"


async def test_get_logbook_shapes_request():
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["url"] = str(request.url)
        return httpx.Response(200, json=[{"name": "Lamp", "state": "on"}])

    out = await get_logbook(
        _settings(), "2026-06-20T00:00:00Z", end="2026-06-21T00:00:00Z",
        entity_id="light.bed", transport=httpx.MockTransport(handler),
    )
    assert out["events"][0]["name"] == "Lamp"
    assert "logbook/2026-06-20T00:00:00Z" in captured["url"]
    assert "entity=light.bed" in captured["url"]
    assert "end_time=" in captured["url"]


async def test_get_history_shapes_request():
    def handler(request: httpx.Request) -> httpx.Response:
        assert "history/period/2026-06-20T00:00:00Z" in str(request.url)
        assert "filter_entity_id=light.bed" in str(request.url)
        return httpx.Response(200, json=[[{"state": "on"}]])

    out = await get_history(
        _settings(), "light.bed", "2026-06-20T00:00:00Z",
        transport=httpx.MockTransport(handler),
    )
    assert out["history"] == [[{"state": "on"}]]


async def test_get_history_unreachable_returns_error():
    out = await get_history(
        _settings(supervisor=False), "light.bed", "2026-06-20T00:00:00Z",
    )
    assert "error" in out  # no connection configured
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_history.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.history'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/history.py`:

```python
"""On-demand passthrough to HA's existing trace / logbook / recorder stores. These
inherit HA's retention (recorder ~10 days; automations keep ~stored_traces traces) —
the MCP tool descriptions say so. Every entry point returns a JSON-serializable dict
and degrades to ``{"error": ...}`` rather than raising.
"""

from __future__ import annotations

import logging

import httpx

from .config import Settings, rest_target
from .ha_source import ConnectFn, _authenticate, _command

logger = logging.getLogger(__name__)


async def _rest_get(settings: Settings, path: str, params: dict, transport) -> object:
    base, token = rest_target(settings)
    if not base:
        raise RuntimeError("Home Assistant connection not configured")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    async with httpx.AsyncClient(base_url=base, transport=transport, timeout=30) as client:
        resp = await client.get(path, params=params, headers=headers)
        resp.raise_for_status()
        return resp.json()


async def get_automation_trace(
    settings: Settings,
    connect: ConnectFn,
    automation: str,
    run_id: str | None = None,
    *,
    numeric_resolver=None,
) -> dict:
    """Latest (or specified) trace for an automation. Accepts an entity id
    (``automation.x``) or a numeric id."""
    numeric = automation
    if automation.startswith("automation."):
        if numeric_resolver is None:
            return {"error": "entity-id resolution requires a numeric_resolver"}
        numeric = numeric_resolver(automation)
        if not numeric:
            return {"error": f"could not resolve numeric id for {automation}"}

    try:
        async with connect(settings.ws_url) as ws:
            await _authenticate(ws, settings.ha_token)
            traces = await _command(
                ws, 1, {"type": "trace/list", "domain": "automation", "item_id": numeric}
            ) or []
            if not traces:
                return {"error": f"no traces for automation {numeric}"}

            chosen = None
            if run_id is not None:
                chosen = next((t for t in traces if t.get("run_id") == run_id), None)
                if chosen is None:
                    return {"error": f"run_id {run_id} not found"}
            else:
                chosen = max(traces, key=lambda t: (t.get("timestamp") or {}).get("start") or "")

            rid = chosen.get("run_id")
            trace = await _command(
                ws, 2,
                {"type": "trace/get", "domain": "automation", "item_id": numeric, "run_id": rid},
            ) or {}
            return {
                "run_id": rid,
                "config": trace.get("config"),
                "trace": trace.get("trace") or trace,
            }
    except Exception as exc:  # noqa: BLE001 - return structured error, never raise
        logger.warning("get_automation_trace(%s) failed: %s", automation, exc)
        return {"error": f"{type(exc).__name__}: {exc}"}


async def get_logbook(
    settings: Settings,
    start: str,
    end: str | None = None,
    entity_id: str | None = None,
    *,
    transport=None,
) -> dict:
    params: dict = {}
    if end:
        params["end_time"] = end
    if entity_id:
        params["entity"] = entity_id
    try:
        data = await _rest_get(settings, f"/api/logbook/{start}", params, transport)
        return {"events": data}
    except Exception as exc:  # noqa: BLE001 - structured error
        logger.warning("get_logbook failed: %s", exc)
        return {"error": f"{type(exc).__name__}: {exc}"}


async def get_history(
    settings: Settings,
    entity_id: str,
    start: str,
    end: str | None = None,
    *,
    transport=None,
) -> dict:
    params: dict = {"filter_entity_id": entity_id}
    if end:
        params["end_time"] = end
    try:
        data = await _rest_get(settings, f"/api/history/period/{start}", params, transport)
        return {"history": data}
    except Exception as exc:  # noqa: BLE001 - structured error
        logger.warning("get_history failed: %s", exc)
        return {"error": f"{type(exc).__name__}: {exc}"}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_history.py -v
```
Expected: PASS — 6 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/history.py \
  addons/terminus-rag/backend/tests/test_history.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): history.py — trace/logbook/history passthrough with structured errors

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 9: `mcp_app.py` — FastMCP tools + bearer auth + `/health` + lifespan

Wires the eight MCP tools over a shared `AppState`, mounts optional bearer-token middleware on `/mcp`, exposes `GET /health`, and starts/stops the refresher in the ASGI lifespan.

**Files:**
- Create: `addons/terminus-rag/backend/app/mcp_app.py`
- Test: `addons/terminus-rag/backend/tests/test_mcp_app.py`

**Interfaces:**
- Consumes: `Settings` (config.py); `VectorIndex` (index.py); `Refresher` (refresher.py); `Embedder` (embedder.py); `get_automation_trace`, `get_logbook`, `get_history` (history.py).
- Produces:
  - `@dataclass class AppState` holding `settings: Settings`, `index: VectorIndex`, `refresher: Refresher`. A module-level mutable singleton `STATE: AppState | None`.
  - `def build_app(state: AppState) -> Starlette` — constructs a `FastMCP("terminus-rag", stateless_http=True, json_response=True)`, registers the eight tools (bound to `state`), the `/health` custom route, the bearer middleware, and returns `mcp.streamable_http_app()` with a lifespan that runs the session manager + the refresher loop.
  - Tool functions (registered, but also unit-testable as plain callables bound to a state):
    - `search_ha(query, kind=None, area=None, top_k=None) -> list[dict]`
    - `list_records(kind, area=None) -> list[dict]`
    - `list_kinds() -> list[dict]`
    - `get_record(id, kind) -> dict` (`{"error"}` if missing)
    - `get_automation_trace(automation, run_id=None) -> dict`
    - `get_logbook(start, end=None, entity_id=None) -> dict`
    - `get_history(entity_id, start, end=None) -> dict`
    - `refresh() -> dict`
  - `class BearerAuthMiddleware` (pure ASGI) — when `state.settings.api_token` non-empty, requires `Authorization: Bearer <token>` on `/mcp` paths (constant-time compare); `/health` always open; 401 JSON on missing/bad token.
  - `def health_payload(state: AppState) -> dict` — `{"status","indexed","kinds","last_refresh","model"}`; `status` is `"warming"` when nothing indexed yet and no error, else `"ok"`, else `"degraded"` if `last_error`.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_mcp_app.py`:

```python
import pytest

from app.config import Settings
from app.embedder import FakeEmbedder
from app.index import VectorIndex
from app.mcp_app import (
    AppState,
    BearerAuthMiddleware,
    build_tools,
    health_payload,
)
from app.records import IndexRecord
from app.refresher import Refresher


def _settings(api_token=""):
    return Settings(
        ws_url="ws://x", ha_token="t", use_supervisor=False, api_token=api_token,
        refresh_interval=600, embed_model="bge", top_k_default=10, log_level="info",
    )


def _state(api_token=""):
    emb = FakeEmbedder(dim=8)
    idx = VectorIndex(emb)
    idx.upsert([
        IndexRecord(id="entity:light.bed", kind="entity",
                    text="Bedroom Lamp | light",
                    metadata={"name": "Bedroom Lamp", "domain": "light", "area": "MB"}),
        IndexRecord(id="scene:scene.movie", kind="scene",
                    text="Movie Night | scene",
                    metadata={"name": "Movie Night", "area": "Living"}),
    ])
    settings = _settings(api_token)
    refresher = Refresher(idx, settings, connect=lambda u: None, fetch=None)
    return AppState(settings=settings, index=idx, refresher=refresher)


def test_search_ha_tool_returns_ranked_hits():
    tools = build_tools(_state())
    hits = tools["search_ha"]("Bedroom Lamp | light")
    assert hits[0]["id"] == "entity:light.bed"
    assert "score" in hits[0]


def test_search_ha_respects_top_k_default():
    tools = build_tools(_state())
    hits = tools["search_ha"]("anything")  # top_k None -> settings.top_k_default
    assert len(hits) <= 10


def test_list_records_and_kinds_tools():
    tools = build_tools(_state())
    assert {r["id"] for r in tools["list_records"]("entity")} == {"entity:light.bed"}
    kinds = {k["kind"]: k["count"] for k in tools["list_kinds"]()}
    assert kinds == {"entity": 1, "scene": 1}


def test_get_record_tool():
    tools = build_tools(_state())
    assert tools["get_record"]("scene:scene.movie", "scene")["area"] == "Living"
    assert "error" in tools["get_record"]("nope", "entity")


def test_health_payload_states():
    state = _state()
    p = health_payload(state)
    assert p["indexed"] == 2
    assert p["model"] == "bge"
    assert p["status"] in ("ok", "warming")
    # empty index, no refresh -> warming
    empty = AppState(settings=_settings(), index=VectorIndex(FakeEmbedder(dim=8)),
                     refresher=state.refresher)
    assert health_payload(empty)["status"] == "warming"


async def _asgi_status(mw, headers, path="/mcp"):
    """Drive the ASGI middleware and capture the response status."""
    scope = {"type": "http", "path": path, "method": "POST",
             "headers": [(k.lower().encode(), v.encode()) for k, v in headers.items()]}
    sent = []

    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(msg):
        sent.append(msg)

    await mw(scope, receive, send)
    start = next((m for m in sent if m["type"] == "http.response.start"), None)
    return start["status"] if start else None


async def test_bearer_middleware_open_when_no_token():
    inner_called = {"v": False}

    async def inner(scope, receive, send):
        inner_called["v"] = True
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="").settings)
    status = await _asgi_status(mw, {})
    assert status == 200
    assert inner_called["v"] is True


async def test_bearer_middleware_401_without_token():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    assert await _asgi_status(mw, {}) == 401
    assert await _asgi_status(mw, {"Authorization": "Bearer wrong"}) == 401
    assert await _asgi_status(mw, {"Authorization": "Bearer secret"}) == 200


async def test_bearer_middleware_health_open_with_token_set():
    async def inner(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = BearerAuthMiddleware(inner, _state(api_token="secret").settings)
    assert await _asgi_status(mw, {}, path="/health") == 200
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_mcp_app.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.mcp_app'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/mcp_app.py`:

```python
"""FastMCP (Streamable HTTP) app exposing the eight knowledge tools, an optional
bearer-token gate on /mcp, an open GET /health, and a lifespan that runs the MCP
session manager plus the refresher poll loop.

The tools are built as plain callables bound to an ``AppState`` (so they're unit
testable without the MCP transport) and then registered on the FastMCP server.
"""

from __future__ import annotations

import asyncio
import contextlib
import logging
import secrets
from dataclasses import dataclass

from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from .config import Settings
from .history import (
    get_automation_trace as _hist_trace,
    get_history as _hist_history,
    get_logbook as _hist_logbook,
)
from .index import VectorIndex
from .refresher import Refresher

logger = logging.getLogger(__name__)


@dataclass
class AppState:
    settings: Settings
    index: VectorIndex
    refresher: Refresher


STATE: AppState | None = None


def health_payload(state: AppState) -> dict:
    indexed = len(state.index)
    if state.refresher.last_error:
        status = "degraded"
    elif indexed == 0 and state.refresher.last_refresh is None:
        status = "warming"
    else:
        status = "ok"
    return {
        "status": status,
        "indexed": indexed,
        "kinds": state.index.list_kinds(),
        "last_refresh": state.refresher.last_refresh,
        "model": state.settings.embed_model,
    }


def _numeric_resolver(state: AppState):
    """Resolve an automation entity id to its numeric id via the index.

    ``build_scene_script_automation_records`` stores automations under
    ``id=f"automation:{entity_id}"`` (e.g. ``"automation:automation.night"``) with
    ``metadata["numeric_id"]``."""
    def resolve(entity_id: str) -> str | None:
        rec = state.index.get(f"automation:{entity_id}", "automation")
        return rec.get("numeric_id") if rec else None
    return resolve


def build_tools(state: AppState) -> dict:
    """Return the eight tool callables bound to ``state`` (also registered on FastMCP)."""

    def search_ha(query: str, kind: str | None = None, area: str | None = None,
                  top_k: int | None = None) -> list[dict]:
        k = state.settings.top_k_default if top_k is None else top_k
        vec = state.index.embed_query(query)
        return state.index.search(vec, kind=kind, area=area, top_k=k)

    def list_records(kind: str, area: str | None = None) -> list[dict]:
        return state.index.list_records(kind=kind, area=area)

    def list_kinds() -> list[dict]:
        return state.index.list_kinds()

    def get_record(id: str, kind: str) -> dict:
        rec = state.index.get(id, kind)
        return rec if rec is not None else {"error": f"no {kind} record with id {id}"}

    async def get_automation_trace(automation: str, run_id: str | None = None) -> dict:
        from websockets.asyncio.client import connect as ws_connect
        return await _hist_trace(
            state.settings, ws_connect, automation, run_id,
            numeric_resolver=_numeric_resolver(state),
        )

    async def get_logbook(start: str, end: str | None = None,
                          entity_id: str | None = None) -> dict:
        return await _hist_logbook(state.settings, start, end, entity_id)

    async def get_history(entity_id: str, start: str, end: str | None = None) -> dict:
        return await _hist_history(state.settings, entity_id, start, end)

    async def refresh() -> dict:
        return await state.refresher.refresh_once()

    return {
        "search_ha": search_ha,
        "list_records": list_records,
        "list_kinds": list_kinds,
        "get_record": get_record,
        "get_automation_trace": get_automation_trace,
        "get_logbook": get_logbook,
        "get_history": get_history,
        "refresh": refresh,
    }


class BearerAuthMiddleware:
    """Pure ASGI middleware. When ``settings.api_token`` is non-empty, requires
    ``Authorization: Bearer <token>`` on /mcp paths (constant-time compare). /health
    stays open. No token in logs."""

    def __init__(self, app, settings: Settings) -> None:
        self.app = app
        self.settings = settings

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            return await self.app(scope, receive, send)
        token = self.settings.api_token
        path = scope.get("path", "")
        if not token or path.startswith("/health"):
            return await self.app(scope, receive, send)

        headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
        auth = headers.get("authorization", "")
        presented = auth[7:] if auth.startswith("Bearer ") else ""
        if presented and secrets.compare_digest(presented, token):
            return await self.app(scope, receive, send)

        resp = JSONResponse({"error": "unauthorized"}, status_code=401)
        await resp(scope, receive, send)


def build_app(state: AppState) -> Starlette:
    from mcp.server.fastmcp import FastMCP

    global STATE
    STATE = state

    mcp = FastMCP("terminus-rag", stateless_http=True, json_response=True)
    tools = build_tools(state)

    # Register each tool with a description (history descriptions note HA retention).
    mcp.tool(name="search_ha", description=(
        "Semantic search over HA registry items (entities, scenes, automations, "
        "etc.). Returns top-k {id, kind, name, domain, area, score, metadata}."
    ))(tools["search_ha"])
    mcp.tool(name="list_records", description=(
        "Full enumeration of every record of a kind (optionally filtered by area). "
        "No embedding — the complete-list path."
    ))(tools["list_records"])
    mcp.tool(name="list_kinds", description="What kinds are indexed and their counts.")(
        tools["list_kinds"]
    )
    mcp.tool(name="get_record", description="Exact metadata for one record by id+kind.")(
        tools["get_record"]
    )
    mcp.tool(name="get_automation_trace", description=(
        "Latest (or specified) automation trace. Accepts an entity id or numeric id. "
        "Reads HA's trace store — limited to the last ~stored_traces runs HA kept."
    ))(tools["get_automation_trace"])
    mcp.tool(name="get_logbook", description=(
        "Logbook events in a time range. Reads HA's recorder — limited to HA's "
        "retention window (~10 days by default)."
    ))(tools["get_logbook"])
    mcp.tool(name="get_history", description=(
        "State history for an entity in a time range. Reads HA's recorder — limited "
        "to HA's retention window (~10 days by default)."
    ))(tools["get_history"])
    mcp.tool(name="refresh", description=(
        "Force a registry rescan now. Returns {added, changed, removed, total, took_ms}."
    ))(tools["refresh"])

    @mcp.custom_route("/health", methods=["GET"])
    async def health(request: Request) -> Response:
        return JSONResponse(health_payload(state))

    inner = mcp.streamable_http_app()

    @contextlib.asynccontextmanager
    async def lifespan(app: Starlette):
        async with mcp.session_manager.run():
            task = asyncio.create_task(state.refresher.run_loop())
            try:
                yield
            finally:
                state.refresher.stop()
                task.cancel()
                with contextlib.suppress(asyncio.CancelledError):
                    await task

    app = Starlette(routes=inner.routes, lifespan=lifespan)
    app.add_middleware(BearerAuthMiddleware, settings=state.settings)
    return app
```

> Note for the implementer: `mcp.streamable_http_app()` already wires the `/mcp` route and the `/health` custom route. We rebuild a thin `Starlette` wrapper only to attach our lifespan (session manager + refresher) and the bearer middleware. If `FastMCP` in the pinned version exposes its own lifespan slot, mounting the middleware on the returned app and entering `mcp.session_manager.run()` in that app's lifespan is equivalent — keep the session-manager-run + refresher-task pairing.

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_mcp_app.py -v
```
Expected: PASS — 9 passed.

- [ ] **Step 5: Commit**

```bash
git add addons/terminus-rag/backend/app/mcp_app.py \
  addons/terminus-rag/backend/tests/test_mcp_app.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): mcp_app.py — FastMCP tools, bearer auth, /health, refresher lifespan

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 10: `main.py` — uvicorn entrypoint

Assembles the real (non-fake) wiring: load settings, configure logging, build a `FastEmbedEmbedder`, load the persisted index, real websocket connect, and expose `app` for uvicorn.

**Files:**
- Create: `addons/terminus-rag/backend/app/main.py`
- Test: `addons/terminus-rag/backend/tests/test_main.py`

**Interfaces:**
- Consumes: `load_settings` (config.py); `FastEmbedEmbedder` (embedder.py); `VectorIndex` (index.py); `Refresher` (refresher.py); `build_app`, `AppState` (mcp_app.py).
- Produces:
  - `def configure_logging(level: str) -> None`
  - `def build_state(settings=None, *, embedder=None, connect=None, persist_dir=None) -> AppState` — injectable for tests (defaults: real settings, `FastEmbedEmbedder`, `websockets.asyncio.client.connect`, `/data/index`); loads the persisted index via `VectorIndex.load`.
  - `app` — module-level ASGI app (`build_app(build_state())`) that `uvicorn app.main:app` serves.

- [ ] **Step 1: Write the failing test**

Create `addons/terminus-rag/backend/tests/test_main.py`:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python -m pytest tests/test_main.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'app.main'`.

- [ ] **Step 3: Write the implementation**

Create `addons/terminus-rag/backend/app/main.py`:

```python
"""uvicorn entrypoint. Loads settings, configures stdout logging (captured by the
Supervisor), builds the real fastembed embedder, loads the persisted index, and
exposes ``app`` for ``uvicorn app.main:app``.
"""

from __future__ import annotations

import logging
from pathlib import Path

from .config import Settings, load_settings
from .embedder import Embedder, FastEmbedEmbedder
from .index import VectorIndex
from .mcp_app import AppState, build_app
from .refresher import Refresher

logger = logging.getLogger(__name__)

_DEFAULT_PERSIST = Path("/data/index")


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
        embedder = FastEmbedEmbedder(model_name=settings.embed_model, cache_dir="/data/models")
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
```

> Note for the implementer: the module-level `load_settings()` at import reads `/data/options.json`, which only exists inside the add-on. The unit tests import `build_state`/`configure_logging` (which they do not trigger the module-bottom `app =` line beyond import). If importing `app.main` in CI is undesirable because the bottom three lines run at import, guard them under `if __name__ != "__test__"`-style is **not** needed — `load_settings` returns empty `Settings` outside the Supervisor and `build_app` only constructs objects (no network at import). Keep them at module scope so `uvicorn app.main:app` works.

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_main.py -v
```
Expected: PASS — 3 passed.

- [ ] **Step 5: Run the full suite (no slow tests)**

```bash
python -m pytest -v -m "not slow"
```
Expected: PASS — all tests across all modules green; the one slow test deselected.

- [ ] **Step 6: Commit**

```bash
git add addons/terminus-rag/backend/app/main.py \
  addons/terminus-rag/backend/tests/test_main.py
git commit -m "$(cat <<'EOF'
feat(terminus-rag): main.py — uvicorn entrypoint wiring fastembed + persisted index

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 11: Deploy wiring + AGENTS.md add-on table

Register the new add-on in the repo's documented inventory. (No app code; doc + verification.)

**Files:**
- Modify: `main/AGENTS.md` (the "Installed Add-ons" table)

**Interfaces:**
- Consumes: nothing.
- Produces: an updated add-on inventory row for `local_terminus_rag`.

- [ ] **Step 1: Read the current add-on table**

Run from the worktree root:
```bash
grep -n "local_terminus" main/AGENTS.md
```
Expected: shows the existing table rows including `| local_terminus | Terminus | 0.6.0 |` (or current version).

- [ ] **Step 2: Add the new row**

In `main/AGENTS.md`, in the "Installed Add-ons" table, add a row immediately after the `local_terminus` row:

```markdown
| local_terminus_rag | Terminus RAG | 0.1.0 |
```

- [ ] **Step 3: Verify the edit**

```bash
grep -n "local_terminus_rag" main/AGENTS.md
```
Expected: one line showing the new `| local_terminus_rag | Terminus RAG | 0.1.0 |` row.

- [ ] **Step 4: Commit**

```bash
git add main/AGENTS.md
git commit -m "$(cat <<'EOF'
docs(terminus-rag): register local_terminus_rag in the add-on inventory

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

### Task 12: Real-embedder integration check + deploy dry-run (opt-in)

Runs the one slow test (real fastembed) and a Docker build smoke check to confirm the glibc wheels resolve. Optional in CI; run before first device deploy.

**Files:**
- Test: `addons/terminus-rag/backend/tests/test_embedder.py::test_real_fastembed_dim_and_ranking` (already written in Task 4)

**Interfaces:**
- Consumes: `FastEmbedEmbedder` (embedder.py).
- Produces: confidence that the real model loads, embeds at 384-dim, and ranks sensibly; that the Docker image builds on glibc.

- [ ] **Step 1: Run the slow embedder test**

```bash
python -m pytest tests/test_embedder.py -v -m slow
```
Expected: PASS (downloads ~130 MB on first run into `/tmp/fastembed-test-cache`; `test_real_fastembed_dim_and_ranking` asserts shape `(3, 384)` and that a reading-light query outranks the kitchen fan).

- [ ] **Step 2: Docker build smoke check**

Run from the worktree root:
```bash
docker build -t terminus-rag-smoke -f addons/terminus-rag/Dockerfile addons/terminus-rag
```
Expected: build succeeds; the `pip install` layer resolves `fastembed`/`onnxruntime` glibc wheels with no musl error and no BuildKit-syntax error. (If `docker` is unavailable locally, this step is done on-device at deploy.)

- [ ] **Step 3: Deploy to device**

```bash
bin/deploy-addons-ssh.sh
# then, on device (SSH add-on shell):
ha supervisor reload && ha store reload
ha apps update local_terminus_rag    # first install picks up config.yaml 0.1.0
ha apps logs local_terminus_rag      # confirm uvicorn on :9000, /health warming->ok
```
Expected: the add-on installs, logs show the model download on first boot, then `refresh: +N ...` and `/health` transitions `warming` → `ok`.

- [ ] **Step 4: Smoke-test the MCP endpoint from another add-on or curl on the hassio network**

From a tailnet shell on the device (internal DNS), confirm `/health` is reachable:
```bash
curl -s http://local-terminus-rag:9000/health
```
Expected: JSON `{"status":"ok","indexed":<N>,"kinds":[...],"last_refresh":"...","model":"BAAI/bge-small-en-v1.5"}`.

- [ ] **Step 5: Commit (if any deploy-doc tweaks were needed)**

Only if a doc/path needed correction during deploy:
```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(terminus-rag): deploy notes corrections from first device install

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Qxvd8axgVcBxKXKB3bAacn
EOF
)"
```

---

## Self-Review

**Spec coverage** — every spec section maps to a task:

| Spec section | Task(s) |
|---|---|
| Packaging / base image / addressing / manifest | 1 (config.yaml, Dockerfile, run.sh) |
| `config.py` (options + HA connection) | 2 |
| Data model: `IndexRecord` / `compose_text` / `content_hash` / helper domains | 3 |
| Embeddings: fastembed wrapper + injectable fake | 4 |
| Vector store: numpy cosine search/list/persist, atomic write | 5 |
| Per-kind ingestion: `fetch_areas/labels/devices/entities/scenes_scripts_automations/blueprints`, area fallback, helper tagging | 6 |
| Refresh & persistence: incremental hash-diff, single-flight, poll loop, keep-last-good | 7 |
| History passthrough: trace/logbook/history + retention notes + `{error}` | 8 |
| MCP tool surface (8 tools), auth, `/health` | 9 |
| Entrypoint / lifespan | 10, 9 |
| Docker & deploy conventions, AGENTS.md table | 1, 11, 12 |
| Error handling (log before degrade, structured errors, per-source isolation) | 6, 7, 8, 9 |
| Testing (fake embedder unit, opt-in real) | 3–10 (unit), 4 + 12 (slow) |

**No placeholders:** every code step contains complete Python — no "TBD"/"similar to". Tool names match the consumer spec (Spec A): `search_ha, list_records, get_record, list_kinds, get_automation_trace, get_logbook, get_history, refresh`. Consumer URL `http://local-terminus-rag:9000/mcp` and slug `local_terminus_rag` are consistent across config.yaml, README, AGENTS.md, and tasks.

**Type consistency (cross-task):** `IndexRecord(id, kind, text, metadata)` is used identically in Tasks 3/5/6/7/9. `VectorIndex` method names (`upsert/remove/reconcile/search/list_records/list_kinds/get/embed_query/save/load`) match between Task 5 (defs) and Tasks 7/9 (calls). `Refresher(index, settings, connect, *, fetch=...)` + `.refresh_once()/.run_loop()/.stop()/.persist_dir/.last_refresh/.last_error` match between Task 7 (defs) and Tasks 9/10 (use). `Embedder.embed(list[str]) -> np.ndarray` (384-dim, L2-normalized) is the contract honored by `FastEmbedEmbedder` and `FakeEmbedder` and consumed by `VectorIndex`. `Settings` field set is identical everywhere it's constructed in tests.
