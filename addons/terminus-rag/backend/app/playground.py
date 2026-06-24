"""Browser-facing playground routes: list the MCP tool schemas and execute a
tool in-process via the same ``build_tools(state)`` callables the MCP server
wraps. Mounted on the existing Starlette app; access control is handled by
``BearerAuthMiddleware`` (ingress-guarded)."""

from __future__ import annotations

import inspect
import logging

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route

from .mcp_app import AppState, build_tools

logger = logging.getLogger(__name__)


def build_playground_routes(state: AppState, mcp) -> list[Route]:
    tools = build_tools(state)

    async def list_tools_route(request: Request) -> JSONResponse:
        defs = await mcp.list_tools()
        return JSONResponse({
            "tools": [
                {"name": t.name, "description": t.description, "inputSchema": t.inputSchema}
                for t in defs
            ]
        })

    async def call_tool_route(request: Request) -> JSONResponse:
        try:
            body = await request.json()
        except Exception:
            return JSONResponse({"error": "invalid JSON body"}, status_code=400)

        name = body.get("tool")
        args = body.get("args") or {}
        if not isinstance(args, dict):
            return JSONResponse({"error": "'args' must be an object"}, status_code=400)
        fn = tools.get(name)
        if fn is None:
            return JSONResponse({"error": f"unknown tool: {name!r}"}, status_code=400)

        try:
            result = fn(**args)
            if inspect.isawaitable(result):
                result = await result
        except Exception as exc:  # tool-level failure → render in the UI, not a 500
            logger.info("playground tool %s failed: %s", name, exc)
            return JSONResponse({"error": str(exc)})
        return JSONResponse({"result": result})

    return [
        Route("/playground/tools", list_tools_route, methods=["GET"]),
        Route("/playground/call", call_tool_route, methods=["POST"]),
    ]
