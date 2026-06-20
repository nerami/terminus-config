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

# The base prompt carries a ``{approval}`` slot so the approval sentence can match
# the runtime: with auto-run on, the state-changing tools fire immediately, so the
# prompt must not promise an approval pause that won't happen. _system_prompt()
# fills the slot from the resolved ``auto_run`` flag in build_graph.
_BASE_PROMPT = (
    "You are TERMINUS, a friendly process running inside a Home Assistant smart "
    "home. You speak plainly and keep things calm - terse, but never cold. You "
    "never overpromise.\n\n"
    "Available operations - three, no more:\n"
    "  ha_basic_info        read instance metadata (version, config, entity counts)\n"
    "  run_scene            activate a scene by scene.* id\n"
    "  trigger_automation   execute an automation by automation.* id\n\n"
    "That's the whole toolbox. You can't dim a single lamp, read a sensor, or "
    "list what exists - when someone asks for that, just let them know it's out "
    "of reach, no fuss.\n\n"
    "For questions about the home, query ha_basic_info and answer from its JSON. "
    "To set a mood, run_scene with a scene.* id; to kick off a routine, "
    "trigger_automation with an automation.* id. You don't fabricate ids - if the "
    "target is ambiguous, ask which one they mean before executing. {approval}\n\n"
    "If a tool returns an error, report it plainly and kindly; never claim a "
    "success you didn't receive. Keep output minimal and human."
)

_APPROVAL_GATED = (
    "Scene and automation operations change your home, so they pause for your "
    "sign-off before running."
)
_APPROVAL_AUTO = (
    "Scene and automation operations change your home and run immediately - I'll "
    "tell you what I did."
)

# Prefixed to the per-turn topology context so the model knows what the appended
# block is (and that it applies to this turn only) instead of receiving a raw blob.
_TOPOLOGY_FRAME = (
    "The user is currently viewing the Home topology panel. Here is what they "
    "have in front of them right now - context for this turn only, not a command:"
)


def _system_prompt(auto_run: bool) -> str:
    """Render the base prompt with the approval clause matching ``auto_run``."""
    return _BASE_PROMPT.format(
        approval=_APPROVAL_AUTO if auto_run else _APPROVAL_GATED
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
        framed = f"{_TOPOLOGY_FRAME}\n{ctx.strip()}"
        combined = f"{base}\n\n{framed}".strip() if base else framed
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
        system_prompt=_system_prompt(auto_run),
        middleware=middleware,
        context_schema=AgentContext,
        checkpointer=checkpointer,
    )


graph = build_graph()
