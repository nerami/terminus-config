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
