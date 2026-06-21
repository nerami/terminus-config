import httpx
from fastapi.testclient import TestClient
from starlette.applications import Starlette
from starlette.responses import JSONResponse as StarletteJSON
from starlette.responses import StreamingResponse
from starlette.routing import Route

from app.config import Settings
from app.web import create_app


def _settings():
    return Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


def _recording_upstream():
    """Streaming stand-in for LangGraph that records every path it is asked to serve."""
    calls: list[tuple[str, str]] = []

    async def record(request):
        calls.append((request.method, request.url.path))
        return StarletteJSON({"ok": True})

    async def runs_stream(request):
        calls.append((request.method, request.url.path))

        async def gen():
            yield b"event: messages\ndata: {\"x\":1}\n\n"

        return StreamingResponse(gen(), media_type="text/event-stream")

    app = Starlette(
        routes=[
            Route("/threads", record, methods=["POST"]),
            Route("/threads/search", record, methods=["POST"]),
            Route("/threads/t1", record, methods=["GET", "PATCH"]),
            Route("/threads/t1/state", record, methods=["GET"]),
            Route("/threads/t1/runs/stream", runs_stream, methods=["POST"]),
            Route("/threads/t1/runs/r1/cancel", record, methods=["POST"]),
        ]
    )
    return httpx.ASGITransport(app=app), calls


def test_proxy_forwards_and_strips_api_prefix():
    transport, _calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/search", json={"limit": 10})
        assert resp.status_code == 200
        assert resp.json() == {"ok": True}


def test_proxy_streams_sse_body():
    transport, _calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/t1/runs/stream", json={})
        assert resp.status_code == 200
        assert "text/event-stream" in resp.headers["content-type"]
        assert b"event: messages" in resp.content


def test_proxy_allows_thread_search():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/search", json={"limit": 10})
        assert resp.status_code == 200
    assert ("POST", "/threads/search") in calls


def test_proxy_rejects_thread_delete_without_upstream_call():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        resp = tc.request("DELETE", "/api/threads/t1")
        assert resp.status_code == 403
    # The whole point: a rejected request never touches the upstream.
    assert calls == []


def test_proxy_rejects_thread_prune_and_store_and_crons():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        assert tc.post("/api/threads/prune").status_code == 403
        assert tc.post("/api/threads/count").status_code == 403
        assert tc.get("/api/store/items").status_code == 403
        assert tc.get("/api/runs/crons").status_code == 403
        assert tc.get("/api/assistants/agent").status_code == 403
    assert calls == []


def test_proxy_allows_run_stream_and_cancel():
    transport, calls = _recording_upstream()
    app = create_app(settings=_settings(), client=None, proxy_transport=transport)
    with TestClient(app) as tc:
        assert tc.post("/api/threads/t1/runs/stream", json={}).status_code == 200
        assert tc.post("/api/threads/t1/runs/r1/cancel").status_code == 200
    assert ("POST", "/threads/t1/runs/stream") in calls
    assert ("POST", "/threads/t1/runs/r1/cancel") in calls


def _header_echo_upstream():
    async def echo(request):
        # Echo the headers the proxy actually forwarded.
        return StarletteJSON({"headers": dict(request.headers)})

    app = Starlette(routes=[Route("/threads/search", echo, methods=["POST"])])
    return httpx.ASGITransport(app=app)


def test_proxy_strips_sensitive_request_headers():
    app = create_app(
        settings=_settings(), client=None, proxy_transport=_header_echo_upstream()
    )
    with TestClient(app) as tc:
        resp = tc.post(
            "/api/threads/search",
            json={"limit": 10},
            headers={
                "Authorization": "Bearer leak-me",
                "Connection": "keep-alive",
                "X-Api-Key": "keep-me",
            },
        )
        assert resp.status_code == 200
        fwd = {k.lower(): v for k, v in resp.json()["headers"].items()}
    # Sensitive + hop-by-hop request headers are gone...
    assert "authorization" not in fwd
    assert "host" not in fwd or fwd.get("host") != "testserver"
    assert "connection" not in fwd
    # ...but a benign app header is preserved, and httpx recomputed the body length.
    assert fwd.get("x-api-key") == "keep-me"
    assert fwd.get("content-length") is not None  # recomputed by httpx, not desynced


def test_proxy_bounded_timeout_configured():
    """Verify proxy httpx client has bounded timeouts for all phases."""
    from app import web

    # The _PROXY_TIMEOUT must exist and configure finite bounds on all phases.
    # This prevents a stalled upstream from hanging the proxy indefinitely.
    assert hasattr(web, "_PROXY_TIMEOUT")
    timeout = web._PROXY_TIMEOUT
    assert timeout.connect == 10.0  # Connect timeout
    assert timeout.read == 120.0    # Read timeout (per-chunk inactivity bound)
    assert timeout.write == 30.0    # Write timeout
    assert timeout.pool == 10.0     # Pool timeout


