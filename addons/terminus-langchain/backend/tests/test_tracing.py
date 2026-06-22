"""Tracing opt-in policy — fail-closed, private-LAN only.

Langfuse tracing ships prompts (live HA state + user messages) off-device, so
``should_trace`` is the safety gate: it activates ONLY when explicitly switched
on, fully credentialed, AND pointed at a private-LAN host. Anything else stays
off — and says so in the log rather than silently no-op'ing (the same
"empty ≠ failed" discipline as the 0.11.0 observability work).
"""

import logging

import pytest

from app.config import Settings
from app.tracing import build_tracer, should_trace


def _settings(**overrides) -> Settings:
    """A fully-enabled, validly-configured tracing Settings; override per test."""
    base = dict(
        ws_url="ws://supervisor/core/websocket",
        ha_token="t",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=True,
        langfuse_tracing=True,
        langfuse_public_key="pk-lf-abc",
        langfuse_secret_key="sk-lf-abc",
        langfuse_host="http://192.168.100.176:3000",
    )
    base.update(overrides)
    return Settings(**base)


def test_should_trace_false_when_switch_off():
    # The master switch wins even when everything else is valid.
    assert should_trace(_settings(langfuse_tracing=False)) is False


@pytest.mark.parametrize(
    "missing",
    [
        {"langfuse_public_key": ""},
        {"langfuse_secret_key": ""},
        {"langfuse_host": ""},
    ],
)
def test_should_trace_false_and_warns_when_config_incomplete(missing, caplog):
    # Switch on but partial config must NOT half-enable, and must not be silent.
    with caplog.at_level(logging.WARNING, logger="app.tracing"):
        assert should_trace(_settings(**missing)) is False
    assert any(r.levelno >= logging.WARNING for r in caplog.records)


@pytest.mark.parametrize(
    "host",
    [
        "http://192.168.100.176:3000",  # the validated laptop
        "http://10.0.0.5:3000",
        "http://172.16.0.9:3000",
        "http://127.0.0.1:3000",        # localhost dev
    ],
)
def test_should_trace_true_for_private_lan_host(host):
    assert should_trace(_settings(langfuse_host=host)) is True


@pytest.mark.parametrize(
    "host",
    [
        "http://8.8.8.8:3000",          # public IP
        "https://1.1.1.1",              # public IP
        "https://cloud.langfuse.com",   # public hostname — the SaaS we declined
    ],
)
def test_should_trace_false_and_warns_for_public_host(host, caplog):
    # Refusing a public host is the whole reason we picked self-hosted Langfuse.
    with caplog.at_level(logging.WARNING, logger="app.tracing"):
        assert should_trace(_settings(langfuse_host=host)) is False
    assert any(r.levelno >= logging.WARNING for r in caplog.records)


def test_build_tracer_returns_none_when_disabled():
    # When the gate says no, the agent must never receive a handler.
    assert build_tracer(_settings(langfuse_tracing=False)) is None
