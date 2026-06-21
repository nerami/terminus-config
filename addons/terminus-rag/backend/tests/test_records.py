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
