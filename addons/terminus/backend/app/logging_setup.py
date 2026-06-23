"""Configure root logging once at startup; log to stdout for the Supervisor.

The Supervisor captures the add-on's stdout (`ha apps logs local_terminus`),
so there is no handler gymnastics here: a single stdout StreamHandler at a
level resolved from the `log_level` add-on option / `LOG_LEVEL` env var.
"""

from __future__ import annotations

import logging
import os
import sys

logger = logging.getLogger(__name__)

_DEFAULT_LEVEL = "info"
_FORMAT = "%(asctime)s %(levelname)s %(name)s %(message)s"


def configure_logging(level: str | None = None) -> None:
    """Set up root logging to stdout at ``level`` (default ``info``).

    ``level`` falls back to ``$LOG_LEVEL`` then ``info``. An unrecognized
    name degrades to ``INFO`` with a warning. Idempotent (``force=True``).
    """
    raw = (level or os.environ.get("LOG_LEVEL") or _DEFAULT_LEVEL)
    name = raw.upper()
    resolved = logging.getLevelName(name)
    bad = not isinstance(resolved, int)
    if bad:
        resolved = logging.INFO
        # Warn before basicConfig so the record reaches any pre-existing handlers
        # (e.g. pytest caplog) that force=True would otherwise remove.
        logger.warning("unknown log level %r; defaulting to INFO", raw)
    logging.basicConfig(
        level=resolved, stream=sys.stdout, format=_FORMAT, force=True
    )
