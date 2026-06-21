import logging
import sys

from app.logging_setup import configure_logging


def test_configure_logging_sets_root_level_from_arg():
    configure_logging("warning")
    assert logging.getLogger().level == logging.WARNING


def test_configure_logging_defaults_to_info(monkeypatch):
    monkeypatch.delenv("LOG_LEVEL", raising=False)
    configure_logging(None)
    assert logging.getLogger().level == logging.INFO


def test_configure_logging_reads_env_when_arg_none(monkeypatch):
    monkeypatch.setenv("LOG_LEVEL", "error")
    configure_logging(None)
    assert logging.getLogger().level == logging.ERROR


def test_configure_logging_is_case_insensitive():
    configure_logging("DEBUG")
    assert logging.getLogger().level == logging.DEBUG


def test_configure_logging_bad_level_falls_back_to_info(caplog):
    with caplog.at_level(logging.WARNING, logger="app.logging_setup"):
        configure_logging("not-a-level")
    assert logging.getLogger().level == logging.INFO
    assert any("not-a-level" in r.message for r in caplog.records)


def test_configure_logging_streams_to_stdout():
    configure_logging("info")
    handlers = logging.getLogger().handlers
    assert any(
        isinstance(h, logging.StreamHandler) and h.stream is sys.stdout
        for h in handlers
    )


def test_modules_expose_named_loggers():
    import app.tools
    import app.ha_registry
    import app.config
    import app.agent
    import app.ha_client
    import app.title
    import app.web

    for mod, name in [
        (app.tools, "app.tools"),
        (app.ha_registry, "app.ha_registry"),
        (app.config, "app.config"),
        (app.agent, "app.agent"),
        (app.ha_client, "app.ha_client"),
        (app.title, "app.title"),
        (app.web, "app.web"),
    ]:
        assert isinstance(mod.logger, logging.Logger)
        assert mod.logger.name == name
