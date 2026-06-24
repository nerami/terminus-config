from app.config import _normalize_ws_url, load_settings, rest_target


def test_supervisor_token_takes_precedence():
    settings = load_settings(
        env={"SUPERVISOR_TOKEN": "super-secret"},
        options={"anthropic_api_key": "sk-ant", "model": "claude-sonnet-4-6"},
    )
    assert settings.use_supervisor is True
    assert settings.ws_url == "ws://supervisor/core/websocket"
    assert settings.ha_token == "super-secret"
    assert settings.anthropic_api_key == "sk-ant"
    assert settings.model == "claude-sonnet-4-6"


def test_dev_fallback_uses_options_url_and_token():
    settings = load_settings(
        env={},
        options={"ha_url": "https://hass.local:8123", "ha_token": "llt"},
    )
    assert settings.use_supervisor is False
    assert settings.ws_url == "wss://hass.local:8123/api/websocket"
    assert settings.ha_token == "llt"


def test_dev_fallback_reads_env_when_options_empty():
    settings = load_settings(
        env={"HASS_URL": "http://localhost:8123", "HASS_TOKEN": "tok"},
        options={},
    )
    assert settings.ws_url == "ws://localhost:8123/api/websocket"
    assert settings.ha_token == "tok"


def test_model_defaults_when_unset():
    settings = load_settings(env={}, options={})
    assert settings.model == "claude-sonnet-4-6"
    assert settings.ws_url == ""


def test_rest_target_supervisor():
    settings = load_settings(env={"SUPERVISOR_TOKEN": "super"}, options={})
    assert rest_target(settings) == ("http://supervisor/core", "super")


def test_rest_target_dev_derives_http_base():
    settings = load_settings(
        env={}, options={"ha_url": "https://hass.local:8123", "ha_token": "llt"}
    )
    assert rest_target(settings) == ("https://hass.local:8123", "llt")


def test_rest_target_unconfigured():
    settings = load_settings(env={}, options={})
    assert rest_target(settings) == (None, None)


def test_normalize_ws_url_variants():
    assert _normalize_ws_url("https://h:8123") == "wss://h:8123/api/websocket"
    assert _normalize_ws_url("http://h:8123/") == "ws://h:8123/api/websocket"
    assert _normalize_ws_url("http://h:8123/api/websocket") == "ws://h:8123/api/websocket"
    assert _normalize_ws_url("ws://h:8123/api/websocket") == "ws://h:8123/api/websocket"
    assert _normalize_ws_url("h:8123") == "ws://h:8123/api/websocket"


def test_auto_run_tools_defaults_false():
    assert load_settings(env={}, options={}).auto_run_tools is False


def test_auto_run_tools_from_options():
    settings = load_settings(env={}, options={"auto_run_tools": True})
    assert settings.auto_run_tools is True


def test_auto_run_tools_from_env_truthy_and_falsy():
    for truthy in ("true", "True", "1", "yes"):
        assert load_settings(env={"AUTO_RUN_TOOLS": truthy}, options={}).auto_run_tools is True
    for falsy in ("false", "False", "0", "no", ""):
        assert load_settings(env={"AUTO_RUN_TOOLS": falsy}, options={}).auto_run_tools is False


def test_auto_run_tools_carried_in_supervisor_mode():
    settings = load_settings(
        env={"SUPERVISOR_TOKEN": "super"}, options={"auto_run_tools": True}
    )
    assert settings.use_supervisor is True
    assert settings.auto_run_tools is True


def test_title_model_defaults_to_haiku():
    assert load_settings(env={}, options={}).title_model == "claude-haiku-4-5"


def test_title_model_from_options_and_env():
    assert load_settings(env={}, options={"title_model": "x"}).title_model == "x"
    assert load_settings(env={"TLC_TITLE_MODEL": "y"}, options={}).title_model == "y"


def test_title_model_carried_in_supervisor_mode():
    settings = load_settings(
        env={"SUPERVISOR_TOKEN": "super"}, options={"title_model": "z"}
    )
    assert settings.use_supervisor is True
    assert settings.title_model == "z"


import logging


def test_normalize_ws_url_uppercase_scheme():
    assert _normalize_ws_url("HTTPS://h:8123") == "wss://h:8123/api/websocket"
    assert _normalize_ws_url("HTTP://h:8123") == "ws://h:8123/api/websocket"
    assert _normalize_ws_url("WSS://h:8123/api/websocket") == "wss://h:8123/api/websocket"


def test_normalize_ws_url_preserves_credentials():
    assert (
        _normalize_ws_url("https://user:pass@h:8123")
        == "wss://user:pass@h:8123/api/websocket"
    )


def test_normalize_ws_url_warns_on_empty_host(caplog):
    # A scheme-only dev URL (no host) is a misconfiguration: warn but don't raise.
    with caplog.at_level(logging.WARNING, logger="app.config"):
        out = _normalize_ws_url("https://")
    assert any("no host" in r.message for r in caplog.records)
    # still returns a (degenerate) string rather than raising
    assert out.endswith("/api/websocket")


def test_normalize_ws_url_no_warn_on_valid_host(caplog):
    with caplog.at_level(logging.WARNING, logger="app.config"):
        _normalize_ws_url("https://h:8123")
    assert not any("no host" in r.message for r in caplog.records)


def test_rest_target_handles_uppercase_ws_scheme():
    from app.config import Settings

    settings = Settings(
        ws_url="WSS://h:8123/api/websocket",
        ha_token="t",
        anthropic_api_key="k",
        model="m",
        use_supervisor=False,
    )
    assert rest_target(settings) == ("https://h:8123", "t")


from pathlib import Path

from app.config import load_options
import pytest
from app.config import Settings


def test_load_options_missing_file_is_silent(caplog, tmp_path):
    missing = tmp_path / "nope.json"
    with caplog.at_level(logging.WARNING, logger="app.config"):
        assert load_options(missing) == {}
    assert not caplog.records


def test_load_options_corrupt_file_warns(caplog, tmp_path):
    corrupt = tmp_path / "options.json"
    corrupt.write_text("{not valid json")
    with caplog.at_level(logging.WARNING, logger="app.config"):
        assert load_options(corrupt) == {}
    assert any("failed to parse options" in r.message for r in caplog.records)


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("http://h:8123", "ws://h:8123/api/websocket"),
        ("https://h:8123", "wss://h:8123/api/websocket"),
        ("ws://h:8123", "ws://h:8123/api/websocket"),
        ("wss://h:8123", "wss://h:8123/api/websocket"),
        ("h:8123", "ws://h:8123/api/websocket"),
        ("HTTPS://h:8123", "wss://h:8123/api/websocket"),
        ("https://user:pass@h:8123", "wss://user:pass@h:8123/api/websocket"),
        ("https://h:8123/", "wss://h:8123/api/websocket"),
        ("https://h:8123/api/websocket", "wss://h:8123/api/websocket"),
        ("https://h:8123/api/websocket/", "wss://h:8123/api/websocket"),
    ],
)
def test_normalize_ws_url_all_forms(raw, expected):
    assert _normalize_ws_url(raw) == expected


def _dev(ws_url):
    return Settings(
        ws_url=ws_url,
        ha_token="t",
        anthropic_api_key="k",
        model="m",
        use_supervisor=False,
    )


@pytest.mark.parametrize(
    "ws_url,expected_base",
    [
        ("wss://h:8123/api/websocket", "https://h:8123"),
        ("ws://h:8123/api/websocket", "http://h:8123"),
        ("wss://h:8123", "https://h:8123"),
        ("ws://h:8123", "http://h:8123"),
    ],
)
def test_rest_target_all_dev_forms(ws_url, expected_base):
    assert rest_target(_dev(ws_url)) == (expected_base, "t")


def test_rest_target_supervisor_ignores_ws_url():
    settings = load_settings(env={"SUPERVISOR_TOKEN": "super"}, options={})
    assert rest_target(settings) == ("http://supervisor/core", "super")


from app.config import DEFAULT_RAG_URL


def test_rag_url_defaults_to_internal_host():
    settings = load_settings(env={}, options={})
    assert settings.rag_url == DEFAULT_RAG_URL
    assert settings.rag_url == "http://local-terminus-rag:9000/mcp"


def test_rag_url_from_options_overrides_default():
    settings = load_settings(
        env={}, options={"rag_url": "http://rag.test:9000/mcp"}
    )
    assert settings.rag_url == "http://rag.test:9000/mcp"


def test_rag_url_from_env_when_options_empty():
    settings = load_settings(env={"RAG_URL": "http://envrag:9000/mcp"}, options={})
    assert settings.rag_url == "http://envrag:9000/mcp"


def test_rag_token_defaults_none_and_reads_options_then_env():
    assert load_settings(env={}, options={}).rag_token is None
    assert (
        load_settings(env={}, options={"rag_token": "tok"}).rag_token == "tok"
    )
    assert (
        load_settings(env={"RAG_TOKEN": "etok"}, options={}).rag_token == "etok"
    )


def test_rag_settings_carried_in_supervisor_mode():
    settings = load_settings(
        env={"SUPERVISOR_TOKEN": "super"},
        options={"rag_url": "http://r:9000/mcp", "rag_token": "t"},
    )
    assert settings.use_supervisor is True
    assert settings.rag_url == "http://r:9000/mcp"
    assert settings.rag_token == "t"


def test_get_settings_memoizes_options_read(monkeypatch):
    """get_settings reads /data/options.json + env once, then caches."""
    import app.config as config

    config.reset_settings_cache()
    calls = {"n": 0}

    def counting_load_options(path=config.OPTIONS_PATH):
        calls["n"] += 1
        return {"anthropic_api_key": "sk", "model": "claude-sonnet-4-6"}

    monkeypatch.setattr(config, "load_options", counting_load_options)

    first = config.get_settings()
    second = config.get_settings()

    assert first is second  # same cached object
    assert calls["n"] == 1  # options read exactly once
    config.reset_settings_cache()


def test_reset_settings_cache_forces_reload(monkeypatch):
    import app.config as config

    config.reset_settings_cache()
    monkeypatch.setattr(
        config, "load_options", lambda path=config.OPTIONS_PATH: {}
    )
    first = config.get_settings()
    config.reset_settings_cache()
    second = config.get_settings()
    assert first is not second
    config.reset_settings_cache()


def test_langfuse_defaults_off_and_empty():
    s = load_settings(env={}, options={})
    assert s.langfuse_tracing is False
    assert s.langfuse_public_key == ""
    assert s.langfuse_secret_key == ""
    assert s.langfuse_base_url == ""


def test_langfuse_from_options():
    s = load_settings(
        env={},
        options={
            "langfuse_tracing": True,
            "langfuse_public_key": "pk-lf-1",
            "langfuse_secret_key": "sk-lf-1",
            "langfuse_base_url": "http://192.168.100.176:3000",
        },
    )
    assert s.langfuse_tracing is True
    assert s.langfuse_public_key == "pk-lf-1"
    assert s.langfuse_secret_key == "sk-lf-1"
    assert s.langfuse_base_url == "http://192.168.100.176:3000"


def test_langfuse_tracing_from_env_truthy_and_falsy():
    for truthy in ("true", "True", "1", "yes"):
        assert load_settings(env={"LANGFUSE_TRACING": truthy}, options={}).langfuse_tracing is True
    for falsy in ("false", "0", "no", ""):
        assert load_settings(env={"LANGFUSE_TRACING": falsy}, options={}).langfuse_tracing is False


def test_langfuse_keys_from_env():
    s = load_settings(
        env={
            "LANGFUSE_PUBLIC_KEY": "pk-env",
            "LANGFUSE_SECRET_KEY": "sk-env",
            "LANGFUSE_BASE_URL": "http://10.0.0.5:3000",
        },
        options={},
    )
    assert s.langfuse_public_key == "pk-env"
    assert s.langfuse_secret_key == "sk-env"
    assert s.langfuse_base_url == "http://10.0.0.5:3000"


def test_langfuse_carried_in_supervisor_mode():
    s = load_settings(
        env={"SUPERVISOR_TOKEN": "super"},
        options={"langfuse_tracing": True, "langfuse_base_url": "http://192.168.1.2:3000"},
    )
    assert s.use_supervisor is True
    assert s.langfuse_tracing is True
    assert s.langfuse_base_url == "http://192.168.1.2:3000"
