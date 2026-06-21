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
