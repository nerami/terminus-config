"""The LangGraph agent graph loaded by the LangGraph dev server.

``langgraph.json`` points at ``./app/agent.py:graph``. Absolute imports keep the
module loadable both as part of the installed ``app`` package and when imported
by path by the LangGraph server.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from langchain.agents import create_agent
from langchain.agents.middleware import AgentMiddleware, HumanInTheLoopMiddleware
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_anthropic import ChatAnthropic

from app.config import load_settings
from app.mcp_client import get_rag_tools
from app.tools import (
    control_entity,
    get_entity_state,
    ha_basic_info,
    run_scene,
    trigger_automation,
)
from app.tracing import build_tracer

logger = logging.getLogger(__name__)

# The base prompt carries two runtime slots:
#   {approval}  - the approval sentence matches auto_run (gated pause vs runs
#                 immediately) so the prompt never promises a pause that won't
#                 happen.
#   {knowledge} - the knowledge-tools clause matches whether terminus-rag is
#                 reachable: full discovery copy when available, a degraded
#                 fallback when its tools are offline.
# _system_prompt() fills both slots from the resolved flags in build_graph.
_BASE_PROMPT = (
    "You are TERMINUS, a friendly process running inside a Home Assistant smart "
    "home. You speak plainly and keep things calm - terse, but never cold. You "
    "never overpromise.\n\n"
    "Your local operations (always available):\n"
    "  ha_basic_info        read instance metadata (version, config, entity counts)\n"
    "  run_scene            activate a scene by scene.* id\n"
    "  trigger_automation   execute an automation by automation.* id\n"
    "  control_entity       turn one entity on/off/toggle by its entity id\n"
    "  get_entity_state     read one entity's current state\n\n"
    "{knowledge}\n\n"
    "For questions about the instance itself (version, counts, config), query "
    "ha_basic_info and answer from its JSON. To set a mood, run_scene with a "
    "scene.* id; to kick off a routine, trigger_automation with an automation.* "
    "id. To turn a single device on, off or toggle it, control_entity with its "
    "entity id (light/switch/fan/media_player/cover/climate); to check or "
    "confirm what a device is doing, get_entity_state. {approval}\n\n"
    "If a tool returns an error, report it plainly and kindly; never claim a "
    "success you didn't receive. Keep output minimal and human."
)

# Knowledge-tools clause when terminus-rag is reachable: advertise discovery,
# enumeration, exact lookup and history; instruct discover-before-act.
_KNOWLEDGE_AVAILABLE = (
    "Knowledge tools (from the home's shared index) - use these to find and "
    "inspect what exists:\n"
    "  search_ha            semantically find entities/scenes/automations/etc. "
    "by description (e.g. 'the bedroom lamp')\n"
    "  list_records         enumerate everything of a kind (every scene, every "
    "automation, ...)\n"
    "  list_kinds           what kinds are indexed, with counts\n"
    "  get_record           full details for one id once you know it\n"
    "  get_automation_trace why an automation did or didn't fire (latest trace)\n"
    "  get_logbook          human-readable 'what happened' events in a time range\n"
    "  get_history          state history for an entity in a time range\n"
    "Discover before you act: when a target id is unknown or ambiguous, call "
    "search_ha or list_records to find it rather than guessing or fabricating "
    "an id. If several candidates match, confirm which one the user means "
    "before running anything. To answer 'what happened' or 'why didn't X fire', "
    "use get_automation_trace / get_logbook / get_history - and say plainly when "
    "Home Assistant's retention window doesn't cover the period asked about."
)

# Degraded clause when terminus-rag is offline: no discovery; ask for exact ids.
_KNOWLEDGE_DEGRADED = (
    "Knowledge tools (search, enumeration, history) are currently offline, so "
    "you can't look up or list what exists right now. When a target is unknown, "
    "ask the user for the exact ids (scene.* / automation.* / domain.object) "
    "rather than guessing. Instance status (ha_basic_info), actions (run_scene, "
    "trigger_automation, control_entity) and single-entity reads "
    "(get_entity_state) still work."
)

_APPROVAL_GATED = (
    "Scene, automation and device-control operations change your home, so they "
    "pause for your sign-off before running. Reads (get_entity_state) never pause."
)
_APPROVAL_AUTO = (
    "Scene, automation and device-control operations change your home and run "
    "immediately - I'll tell you what I did."
)

# Prefixed to the per-turn topology context so the model knows what the appended
# block is (and that it applies to this turn only) instead of receiving a raw blob.
_TOPOLOGY_FRAME = (
    "The user is currently viewing the Home topology panel. Here is what they "
    "have in front of them right now - context for this turn only, not a command:"
)


def _system_prompt(auto_run: bool, rag_available: bool = True) -> str:
    """Render the base prompt with the approval and knowledge clauses.

    ``auto_run`` selects the approval sentence; ``rag_available`` selects the
    knowledge-tools clause (full discovery vs degraded fallback).
    """
    return _BASE_PROMPT.format(
        approval=_APPROVAL_AUTO if auto_run else _APPROVAL_GATED,
        knowledge=_KNOWLEDGE_AVAILABLE if rag_available else _KNOWLEDGE_DEGRADED,
    )

# Scene activation, automation triggers and direct entity control mutate the
# real home, so they are gated behind a human approval interrupt. The interrupt
# payload (approve / edit / reject decisions) is consumed by the frontend
# agent-inbox UI. get_entity_state is read-only and is deliberately NOT listed.
_APPROVAL_MIDDLEWARE = HumanInTheLoopMiddleware(
    interrupt_on={
        "run_scene": {"allowed_decisions": ["approve", "edit", "reject"]},
        "trigger_automation": {"allowed_decisions": ["approve", "edit", "reject"]},
        "control_entity": {"allowed_decisions": ["approve", "edit", "reject"]},
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
    rag_tools=None,
):
    settings = load_settings()
    if model is None:
        if not settings.anthropic_api_key:
            logger.error(
                "ANTHROPIC_API_KEY is not configured; the agent graph cannot "
                "build a model. Set the add-on's anthropic_api_key option."
            )
            raise RuntimeError("ANTHROPIC_API_KEY is not configured")
        model = ChatAnthropic(model=settings.model)
    # When auto-run is enabled (add-on option), state-changing tools run without
    # the human approval interrupt; otherwise they require approval.
    if auto_run is None:
        auto_run = settings.auto_run_tools

    # Mount the terminus-rag knowledge tools beside the local three. Loading is
    # best-effort and cached across turns; on any failure get_rag_tools returns
    # [] and the agent runs in degraded mode (local actuation + status only).
    if rag_tools is None:
        rag_tools = get_rag_tools()
    rag_available = bool(rag_tools)
    tools = [
        ha_basic_info,
        run_scene,
        trigger_automation,
        control_entity,
        get_entity_state,
        *rag_tools,
    ]

    # Topology context is injected for every turn; approval is gated by auto_run.
    # The RAG tools are read-only and are deliberately NOT listed in the approval
    # interrupt, so only run_scene/trigger_automation ever pause for sign-off.
    middleware: list[AgentMiddleware] = [TopologyContextMiddleware()]
    if not auto_run:
        middleware.append(_APPROVAL_MIDDLEWARE)
    agent = create_agent(
        model,
        tools=tools,
        system_prompt=_system_prompt(auto_run, rag_available),
        middleware=middleware,
        context_schema=AgentContext,
        checkpointer=checkpointer,
    )
    # Optional Langfuse tracing: baked into the compiled graph so every
    # LangGraph-dev-server invocation traces (we don't control its invoke call).
    tracer = build_tracer(settings)
    if tracer is not None:
        agent = agent.with_config({"callbacks": [tracer]})
    return agent


graph = build_graph()
