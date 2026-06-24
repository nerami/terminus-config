"""Parse the add-on's CHANGELOG.md into per-version sections.

The changelog uses ``## <version>`` headings whose text matches config.yaml's
``version`` (the single canonical version). The frontend's "what's new" dialog
asks for the section body of the running version; this module turns the raw
markdown into ``{version: body}`` so the web layer can hand back one entry.
"""

from __future__ import annotations

import re
from typing import Optional

# A level-2 heading whose text is the version, e.g. ``## 0.22.0``. The top-level
# ``# Changelog`` title and any intro prose are deliberately not matched.
_HEADING = re.compile(r"^##\s+(.+?)\s*$")


def parse_sections(text: str) -> dict[str, str]:
    """Map each ``## <version>`` heading to its body (markdown, stripped)."""
    sections: dict[str, str] = {}
    current: Optional[str] = None
    buf: list[str] = []
    for line in text.splitlines():
        m = _HEADING.match(line)
        if m:
            if current is not None:
                sections[current] = "\n".join(buf).strip()
            current = m.group(1).strip()
            buf = []
        elif current is not None:
            buf.append(line)
    if current is not None:
        sections[current] = "\n".join(buf).strip()
    return sections


def extract_entry(text: str, version: str) -> Optional[str]:
    """Return the markdown body for ``version``, or None when absent."""
    return parse_sections(text).get(version)
