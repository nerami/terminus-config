"""Tests for chat-title generation (``app.title``) and its HTTP route.

No real Anthropic calls happen: titles are produced by injected fake chains
(``RunnableLambda``) and the route is exercised with ``fastapi.testclient``.
"""

from fastapi.testclient import TestClient
from langchain_core.runnables import RunnableLambda

from app.config import Settings
from app.title import agenerate_title, clean_title
from app.web import create_app


def _settings():
    return Settings(
        ws_url="",
        ha_token="t",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


# --- clean_title --------------------------------------------------------


def test_clean_title_strips_wrapping_quotes():
    assert clean_title('"Living Room Lights"') == "Living Room Lights"
    assert clean_title("'Living Room Lights'") == "Living Room Lights"


def test_clean_title_strips_trailing_punctuation():
    assert clean_title("Living Room Lights.") == "Living Room Lights"
    assert clean_title("Living Room Lights!") == "Living Room Lights"
    assert clean_title("Living Room Lights?") == "Living Room Lights"
    assert clean_title("Living Room Lights:") == "Living Room Lights"


def test_clean_title_strips_quotes_and_punctuation_together():
    assert clean_title('"Living Room Lights."') == "Living Room Lights"


def test_clean_title_collapses_internal_whitespace():
    assert clean_title("Living   Room\tLights") == "Living Room Lights"


def test_clean_title_uses_first_nonempty_line():
    assert clean_title("\n\nKitchen Lights\nsecond line") == "Kitchen Lights"


def test_clean_title_empty_returns_empty():
    assert clean_title("") == ""
    assert clean_title("   \n  ") == ""


def test_clean_title_clamps_long_input_on_word_boundary():
    long = "word " * 40  # 200 chars
    out = clean_title(long)
    assert len(out) <= 60
    assert out != ""
    # Clamped on a word boundary => no partial/cut word at the end.
    assert not out.endswith("wor")
    assert out.split()[-1] == "word"


def test_clean_title_no_space_in_clip_keeps_full_clip():
    # A 70-char run with no spaces: boundary == -1 (rfind returns -1), so the
    # 60-char clip is kept verbatim (the `boundary > 0` guard is not taken).
    raw = "a" * 70
    out = clean_title(raw)
    assert out == "a" * 60
    assert len(out) == 60


def test_clean_title_all_punctuation_collapses_to_empty():
    # rstrip(".!?:") then strip() removes everything -> empty title.
    assert clean_title("?!.:") == ""
    assert clean_title("'.'") == ""


def test_clean_title_trailing_punctuation_only_strips_one_run():
    # A single trailing run of .!?: is stripped; interior punctuation stays.
    assert clean_title("Lights On!!!") == "Lights On"
    assert clean_title("A.B.") == "A.B"


# --- agenerate_title ----------------------------------------------------


async def test_agenerate_title_cleans_model_output():
    chain = RunnableLambda(lambda _: '"Living Room Lights."')
    assert await agenerate_title("turn on the lights", chain=chain) == (
        "Living Room Lights"
    )


async def test_agenerate_title_empty_message_returns_empty():
    chain = RunnableLambda(lambda _: "Should Not Be Used")
    assert await agenerate_title("", chain=chain) == ""
    assert await agenerate_title("   ", chain=chain) == ""


async def test_agenerate_title_falls_back_when_chain_raises():
    def _boom(_):
        raise RuntimeError("model down")

    chain = RunnableLambda(_boom)
    out = await agenerate_title("turn on the kitchen lights please", chain=chain)
    assert out == clean_title("turn on the kitchen lights please")
    assert out != ""


async def test_agenerate_title_falls_back_when_output_empty():
    chain = RunnableLambda(lambda _: "   ")
    out = await agenerate_title("dim the bedroom lamp", chain=chain)
    assert out == clean_title("dim the bedroom lamp")
    assert out != ""


async def test_agenerate_title_skips_model_without_api_key(monkeypatch):
    # No chain injected and no API key configured => no model is built/called;
    # degrade to a cleaned version of the user's own message.
    no_key = Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="",
        model="m",
        use_supervisor=False,
    )
    monkeypatch.setattr("app.title.load_settings", lambda: no_key)
    out = await agenerate_title("turn on the porch light")
    assert out == clean_title("turn on the porch light")
    assert out != ""


# --- POST /api/title route ----------------------------------------------


def test_title_route_returns_title():
    chain = RunnableLambda(lambda _: '"Kitchen Lights."')
    app = create_app(settings=_settings(), client=None, title_chain=chain)
    with TestClient(app) as tc:
        resp = tc.post(
            "/api/title", json={"message": "turn on the kitchen lights please"}
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["title"] == "Kitchen Lights"
        assert body["title"]


def test_title_route_not_shadowed_by_proxy():
    """``/api/title`` is intercepted locally, not forwarded to LangGraph."""
    chain = RunnableLambda(lambda _: "Movie Night")
    app = create_app(settings=_settings(), client=None, title_chain=chain)
    with TestClient(app) as tc:
        resp = tc.post("/api/title", json={"message": "start movie night"})
        assert resp.status_code == 200
        assert resp.json()["title"] == "Movie Night"


def test_title_route_rejects_non_str_message():
    # The _TitleRequest model is the caller's guard: a non-str message never
    # reaches agenerate_title / clean_title; the route 422s instead.
    chain = RunnableLambda(lambda _: "X")
    app = create_app(settings=_settings(), client=None, title_chain=chain)
    with TestClient(app) as tc:
        resp = tc.post("/api/title", json={"message": {"not": "a string"}})
        assert resp.status_code == 422
