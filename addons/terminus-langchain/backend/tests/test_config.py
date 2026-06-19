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
