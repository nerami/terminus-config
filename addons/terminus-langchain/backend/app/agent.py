"""The LangGraph agent graph loaded by the LangGraph dev server.

``langgraph.json`` points at ``./app/agent.py:graph``. Absolute imports keep the
module loadable both as part of the installed ``app`` package and when imported
by path by the LangGraph server.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from langchain.agents import create_agent
from langchain.agents.middleware import AgentMiddleware, HumanInTheLoopMiddleware
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_anthropic import ChatAnthropic

from app.config import load_settings
from app.tools import ha_basic_info, run_scene, trigger_automation

SYSTEM_PROMPT = (
    "You are Terminus, a helpful assistant embedded in a Home Assistant smart "
    "home. When the user asks about this Home Assistant instance - its version, "
    "configuration, or how many entities/devices it has - call the "
    "ha_basic_info tool and answer from its JSON result. To apply a scene use "
    "the run_scene tool; to run an automation use the trigger_automation tool. "
    "These two actions change the state of the home and will be paused for the "
    "user's approval before they execute. Be concise."
)

# Scene activation and automation triggers mutate the real home, so they are
# gated behind a human approval interrupt. The interrupt payload (approve /
# edit / reject decisions) is consumed by the frontend agent-inbox UI.
_APPROVAL_MIDDLEWARE = HumanInTheLoopMiddleware(
    interrupt_on={
        "run_scene": {"allowed_decisions": ["approve", "edit", "reject"]},
        "trigger_automation": {"allowed_decisions": ["approve", "edit", "reject"]},
    },
    description_prefix="Terminus wants to run an action on your home",
)


@dataclass
class AgentContext:
    """Per-run runtime context supplied by the frontend at submit time.

    ``topology_context`` carries what the user is looking at in the Home
    topology panel (selected node / current page). It is injected into the
    model's system prompt for that turn only and is never added to the
    conversation transcript.
    """

    topology_context: str = ""


class TopologyContextMiddleware(AgentMiddleware):
    """Inject the per-run topology context into the system prompt (only).

    The transform is pure/synchronous, but both the sync and async hooks are
    implemented over it so the middleware works regardless of how the graph is
    invoked - tests use ``invoke`` while the LangGraph server uses ``ainvoke``.
    """

    def _with_context(self, request):
        ctx = getattr(request.runtime.context, "topology_context", "") or ""
        if not ctx.strip():
            return request
        base = request.system_message.content if request.system_message else ""
        combined = f"{base}\n\n{ctx}".strip() if base else ctx.strip()
        return request.override(system_message=SystemMessage(content=combined))

    def wrap_model_call(self, request, handler):
        return handler(self._with_context(request))

    async def awrap_model_call(self, request, handler):
        return await handler(self._with_context(request))


def build_graph(
    model: Optional[BaseChatModel] = None,
    *,
    checkpointer=None,
    auto_run: Optional[bool] = None,
):
    settings = load_settings()
    if model is None:
        model = ChatAnthropic(model=settings.model)
    # When auto-run is enabled (add-on option), state-changing tools run without
    # the human approval interrupt; otherwise they require approval.
    if auto_run is None:
        auto_run = settings.auto_run_tools
    # Topology context is injected for every turn; approval is gated by auto_run.
    middleware: list[AgentMiddleware] = [TopologyContextMiddleware()]
    if not auto_run:
        middleware.append(_APPROVAL_MIDDLEWARE)
    return create_agent(
        model,
        tools=[ha_basic_info, run_scene, trigger_automation],
        system_prompt=SYSTEM_PROMPT,
        middleware=middleware,
        context_schema=AgentContext,
        checkpointer=checkpointer,
    )


graph = build_graph()
