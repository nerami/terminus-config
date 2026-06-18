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


def _upstream_transport():
    """A real streaming stand-in for the LangGraph server."""

    async def threads_search(request):
        body = await request.json()
        assert body == {"limit": 10}
        return StarletteJSON([{"thread_id": "t1"}])

    async def runs_stream(_request):
        async def gen():
            yield b"event: messages\ndata: {\"x\":1}\n\n"

        return StreamingResponse(gen(), media_type="text/event-stream")

    app = Starlette(
        routes=[
            Route("/threads/search", threads_search, methods=["POST"]),
            Route("/runs/stream", runs_stream, methods=["POST"]),
        ]
    )
    return httpx.ASGITransport(app=app)


def test_proxy_forwards_and_strips_api_prefix():
    app = create_app(
        settings=_settings(), client=None, proxy_transport=_upstream_transport()
    )
    with TestClient(app) as tc:
        resp = tc.post("/api/threads/search", json={"limit": 10})
        assert resp.status_code == 200
        assert resp.json() == [{"thread_id": "t1"}]


def test_proxy_streams_sse_body():
    app = create_app(
        settings=_settings(), client=None, proxy_transport=_upstream_transport()
    )
    with TestClient(app) as tc:
        resp = tc.post("/api/runs/stream", json={})
        assert resp.status_code == 200
        assert "text/event-stream" in resp.headers["content-type"]
        assert b"event: messages" in resp.content
