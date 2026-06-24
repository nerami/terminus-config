from app.changelog import extract_entry, parse_sections

SAMPLE = """\
# Changelog

Intro prose that should be ignored.

## 0.22.0

- First bullet.
- Second bullet.

## 0.21.0

- Older change.
"""


def test_parse_sections_maps_version_to_body():
    sections = parse_sections(SAMPLE)
    assert set(sections) == {"0.22.0", "0.21.0"}
    assert sections["0.22.0"] == "- First bullet.\n- Second bullet."
    assert sections["0.21.0"] == "- Older change."


def test_extract_entry_returns_named_section_body():
    assert extract_entry(SAMPLE, "0.22.0") == "- First bullet.\n- Second bullet."


def test_extract_entry_missing_version_is_none():
    assert extract_entry(SAMPLE, "9.9.9") is None


def test_extract_entry_ignores_intro_and_top_heading():
    # The single-# title and the intro prose are not sections.
    assert "Intro prose" not in (extract_entry(SAMPLE, "0.22.0") or "")
    assert "Changelog" not in parse_sections(SAMPLE)
