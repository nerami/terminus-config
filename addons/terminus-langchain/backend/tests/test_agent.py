"""Agent wiring tests using a stub chat model (no real Anthropic calls)."""

import pytest

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.outputs import ChatGeneration, ChatResult

from app import tools
from app.agent import AgentContext, build_graph


@pytest.fixture(autouse=True)
def _no_real_rag(monkeypatch):
    """Stub get_rag_tools so tests never attempt a real MCP connection.

    Tests that want to exercise the loader pass explicit rag_tools= or override
    the stub themselves. Tests that inject rag_tools=[...] bypass this entirely.
    """
    import app.agent as agent

    monkeypatch.setattr(agent, "get_rag_tools", lambda: [])


class CapturingModel(BaseChatModel):
    """Records the messages (incl. system) it is asked to generate from."""

    captured: list = []

    @property
    def _llm_type(self) -> str:
        return "capturing"

    def bind_tools(self, tools, **kwargs):  # noqa: A002
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.captured = list(messages)
        return ChatResult(
            generations=[ChatGeneration(message=AIMessage(content="ok"))]
        )


def _captured_text(model: CapturingModel) -> str:
    return " ".join(str(getattr(m, "content", "")) for m in model.captured)


def test_topology_context_injected_into_system_prompt():
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)
    graph.invoke(
        {"messages": [HumanMessage(content="hi")]},
        context=AgentContext(topology_context="ZZZ-CTX-TOKEN"),
    )
    assert "ZZZ-CTX-TOKEN" in _captured_text(fake)


def test_topology_context_is_framed():
    """The injected context is labelled so the model knows what it is."""
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)
    graph.invoke(
        {"messages": [HumanMessage(content="hi")]},
        context=AgentContext(topology_context="ZZZ-CTX-TOKEN"),
    )
    text = _captured_text(fake)
    assert "currently viewing the Home topology panel" in text
    assert "ZZZ-CTX-TOKEN" in text


def test_approval_clause_gated_by_default():
    """Without auto-run, the prompt promises an approval pause."""
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=False)
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    text = _captured_text(fake)
    assert "pause for your sign-off" in text
    assert "run immediately" not in text


def test_approval_clause_reflects_auto_run():
    """With auto-run, the prompt must not promise a pause that won't happen."""
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    text = _captured_text(fake)
    assert "run immediately" in text
    assert "pause for your sign-off" not in text


def test_no_topology_context_leaves_prompt_clean():
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "ZZZ-CTX-TOKEN" not in _captured_text(fake)


async def test_topology_context_injected_async():
    """The LangGraph server runs the graph async, so the async hook must work."""
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)
    await graph.ainvoke(
        {"messages": [HumanMessage(content="hi")]},
        context=AgentContext(topology_context="ZZZ-ASYNC-TOKEN"),
    )
    assert "ZZZ-ASYNC-TOKEN" in _captured_text(fake)


class FakeToolThenFinal(BaseChatModel):
    """Requests the ha_basic_info tool once, then returns a final answer."""

    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "fake-tool-then-final"

    def bind_tools(self, tools, **kwargs):  # noqa: A002 - mirror BaseChatModel
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.calls += 1
        if self.calls == 1:
            msg = AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "ha_basic_info",
                        "args": {},
                        "id": "call_1",
                        "type": "tool_call",
                    }
                ],
            )
        else:
            msg = AIMessage(content="Your Home Assistant is running 2026.5.4.")
        return ChatResult(generations=[ChatGeneration(message=msg)])


def test_agent_runs_tool_loop(monkeypatch):
    monkeypatch.setattr(
        tools, "load_settings", lambda: _dev_settings(), raising=True
    )
    monkeypatch.setattr(
        tools, "fetch_basic_info", lambda base, token: {"version": "2026.5.4"}
    )

    graph = build_graph(model=FakeToolThenFinal())
    result = graph.invoke({"messages": [HumanMessage(content="What version?")]})
    messages = result["messages"]

    # The tool was actually executed (a ToolMessage carrying our payload exists).
    tool_messages = [m for m in messages if getattr(m, "type", None) == "tool"]
    assert tool_messages, "expected the ha_basic_info tool to run"
    assert "2026.5.4" in tool_messages[0].content
    # And the agent produced a final answer afterwards.
    assert messages[-1].content == "Your Home Assistant is running 2026.5.4."


class FakeRunsScene(BaseChatModel):
    """Requests the state-changing run_scene tool once, then answers."""

    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "fake-runs-scene"

    def bind_tools(self, tools, **kwargs):  # noqa: A002
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.calls += 1
        if self.calls == 1:
            msg = AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "run_scene",
                        "args": {"scene_id": "scene.evening"},
                        "id": "call_scene",
                        "type": "tool_call",
                    }
                ],
            )
        else:
            msg = AIMessage(content="Done, the evening scene is on.")
        return ChatResult(generations=[ChatGeneration(message=msg)])


def test_run_scene_requires_human_approval(monkeypatch):
    """State-changing tools must interrupt for approval before executing."""
    from langgraph.checkpoint.memory import InMemorySaver

    called = {"ran": False}
    monkeypatch.setattr(
        tools, "load_settings", lambda: _dev_settings(), raising=True
    )
    monkeypatch.setattr(
        tools,
        "call_service",
        lambda *a, **k: called.update(ran=True),
        raising=True,
    )

    graph = build_graph(model=FakeRunsScene(), checkpointer=InMemorySaver())
    config = {"configurable": {"thread_id": "t1"}}
    result = graph.invoke(
        {"messages": [HumanMessage(content="Run the evening scene")]}, config
    )

    # The graph paused for approval instead of running the scene.
    assert result.get("__interrupt__"), "expected an approval interrupt"
    assert called["ran"] is False


def test_run_scene_auto_runs_without_approval(monkeypatch):
    """With auto-run enabled the scene executes immediately (no interrupt)."""
    called = {"ran": False}
    monkeypatch.setattr(
        tools, "load_settings", lambda: _dev_settings(), raising=True
    )
    monkeypatch.setattr(
        tools,
        "call_service",
        lambda *a, **k: called.update(ran=True),
        raising=True,
    )

    graph = build_graph(model=FakeRunsScene(), auto_run=True)
    result = graph.invoke(
        {"messages": [HumanMessage(content="Run the evening scene")]}
    )

    assert not result.get("__interrupt__"), "auto-run should not interrupt"
    assert called["ran"] is True


def _dev_settings():
    from app.config import Settings

    return Settings(
        ws_url="wss://hass.local:8123/api/websocket",
        ha_token="llt",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


import logging

import pytest

from app.config import Settings
from app import agent as agent_mod


def _no_key_settings():
    return Settings(
        ws_url="",
        ha_token=None,
        anthropic_api_key="",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )


def test_build_graph_raises_clear_error_without_key(monkeypatch, caplog):
    monkeypatch.setattr(agent_mod, "load_settings", _no_key_settings)
    with caplog.at_level(logging.ERROR, logger="app.agent"):
        with pytest.raises(RuntimeError, match="ANTHROPIC_API_KEY"):
            agent_mod.build_graph()  # no model injected -> would construct ChatAnthropic
    assert any("ANTHROPIC_API_KEY" in r.message for r in caplog.records)


def test_build_graph_with_injected_model_skips_key_check(monkeypatch):
    # An injected model must never trigger the key guard (tests rely on this).
    monkeypatch.setattr(agent_mod, "load_settings", _no_key_settings)
    graph = agent_mod.build_graph(model=CapturingModel(), auto_run=True)
    assert graph is not None


def test_approval_middleware_resume_approve(monkeypatch):
    """Resuming the approval interrupt with `approve` runs the gated tool."""
    from langgraph.checkpoint.memory import InMemorySaver
    from langgraph.types import Command

    called = {"ran": False}
    monkeypatch.setattr(tools, "load_settings", lambda: _dev_settings(), raising=True)
    monkeypatch.setattr(
        tools, "call_service", lambda *a, **k: called.update(ran=True), raising=True
    )

    graph = build_graph(model=FakeRunsScene(), checkpointer=InMemorySaver())
    config = {"configurable": {"thread_id": "resume-approve"}}
    first = graph.invoke(
        {"messages": [HumanMessage(content="Run the evening scene")]}, config
    )
    # The graph must have paused for approval and not yet fired the tool.
    assert first.get("__interrupt__"), "expected an approval interrupt on first invoke"
    assert called["ran"] is False, "call_service must not fire before approval"

    # The middleware calls interrupt(hitl_request) and reads ["decisions"] off the
    # resume value, so the payload must be {"decisions": [{"type": "approve"}]}.
    resumed = graph.invoke(
        Command(resume={"decisions": [{"type": "approve"}]}), config
    )
    assert called["ran"] is True, "call_service must fire after approve decision"
    assert not resumed.get("__interrupt__"), "no pending interrupt after resume"


def test_approval_middleware_resume_reject(monkeypatch):
    """Resuming the approval interrupt with `reject` continues without running the tool."""
    from langgraph.checkpoint.memory import InMemorySaver
    from langgraph.types import Command

    called = {"ran": False}
    monkeypatch.setattr(tools, "load_settings", lambda: _dev_settings(), raising=True)
    monkeypatch.setattr(
        tools, "call_service", lambda *a, **k: called.update(ran=True), raising=True
    )

    graph = build_graph(model=FakeRunsScene(), checkpointer=InMemorySaver())
    config = {"configurable": {"thread_id": "resume-reject"}}
    first = graph.invoke(
        {"messages": [HumanMessage(content="Run the evening scene")]}, config
    )
    assert first.get("__interrupt__"), "expected an approval interrupt on first invoke"
    assert called["ran"] is False

    # A reject decision injects an artificial ToolMessage telling the model the
    # tool was not executed; call_service must never be called.
    resumed = graph.invoke(
        Command(resume={"decisions": [{"type": "reject"}]}), config
    )
    assert called["ran"] is False, "call_service must NOT fire after reject decision"
    assert not resumed.get("__interrupt__"), "no pending interrupt after resume"


from app.agent import _system_prompt
from langchain_core.tools import tool


@tool
def rag_search_ha(query: str) -> str:
    """Injected fake terminus-rag search tool."""
    return "[]"


def test_build_graph_mounts_rag_tools_alongside_local(monkeypatch):
    """When RAG tools load, the agent binds local three + RAG tools."""
    bound = {}

    class BindCapture(CapturingModel):
        def bind_tools(self, tools, **kwargs):  # noqa: A002
            bound["names"] = [t.name for t in tools]
            return self

    fake = BindCapture()
    graph = build_graph(
        model=fake, auto_run=True, rag_tools=[rag_search_ha]
    )
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "ha_basic_info" in bound["names"]
    assert "run_scene" in bound["names"]
    assert "trigger_automation" in bound["names"]
    assert "rag_search_ha" in bound["names"]


def test_build_graph_degrades_to_local_three_when_rag_empty(monkeypatch):
    """RAG mount failure -> agent keeps exactly the local three tools."""
    bound = {}

    class BindCapture(CapturingModel):
        def bind_tools(self, tools, **kwargs):  # noqa: A002
            bound["names"] = [t.name for t in tools]
            return self

    fake = BindCapture()
    graph = build_graph(model=fake, auto_run=True, rag_tools=[])
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert sorted(bound["names"]) == [
        "ha_basic_info",
        "run_scene",
        "trigger_automation",
    ]


def test_build_graph_prompt_is_degraded_when_no_rag(monkeypatch):
    """No RAG tools -> degraded-mode prompt copy is sent to the model."""
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True, rag_tools=[])
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "offline" in _captured_text(fake).lower()


def test_build_graph_prompt_advertises_tools_when_rag_present(monkeypatch):
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True, rag_tools=[rag_search_ha])
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "search_ha" in _captured_text(fake)


def test_build_graph_loads_rag_tools_when_not_injected(monkeypatch):
    """With rag_tools=None, build_graph pulls them from get_rag_tools()."""
    import app.agent as agent

    monkeypatch.setattr(agent, "get_rag_tools", lambda: [rag_search_ha])
    fake = CapturingModel()
    graph = build_graph(model=fake, auto_run=True)  # rag_tools defaults to None
    graph.invoke({"messages": [HumanMessage(content="hi")]})
    assert "search_ha" in _captured_text(fake)


def test_prompt_advertises_knowledge_tools_when_available():
    text = _system_prompt(auto_run=True, rag_available=True)
    # Advertises discovery / enumeration capability...
    assert "search_ha" in text
    assert "list_records" in text
    # ...and the old apology is gone.
    assert "can't" not in text.lower() or "list what exists" not in text.lower()
    assert "list what exists" not in text.lower()


def test_prompt_instructs_discover_before_act():
    text = _system_prompt(auto_run=True, rag_available=True)
    lower = text.lower()
    assert "search_ha" in text and "list_records" in text
    # Discover-before-act + confirm ambiguous matches.
    assert "ambiguous" in lower
    assert "before" in lower


def test_prompt_has_history_guidance():
    text = _system_prompt(auto_run=True, rag_available=True)
    assert "get_automation_trace" in text
    assert "get_logbook" in text
    assert "get_history" in text
    assert "retention" in text.lower()


def test_prompt_degraded_mode_text_when_rag_unavailable():
    text = _system_prompt(auto_run=True, rag_available=False)
    lower = text.lower()
    # Tells the model knowledge tools are offline and to ask for exact ids.
    assert "offline" in lower or "unavailable" in lower
    assert "exact id" in lower or "exact ids" in lower
    # Actuation + instance status still work.
    assert "ha_basic_info" in text


def test_prompt_keeps_approval_and_error_clauses():
    gated = _system_prompt(auto_run=False, rag_available=True)
    assert "pause for your sign-off" in gated
    auto = _system_prompt(auto_run=True, rag_available=True)
    assert "run immediately" in auto
    # "report errors plainly" guidance survives.
    assert "report it plainly" in gated.lower() or "plainly" in gated.lower()


from langgraph.checkpoint.memory import InMemorySaver


_rag_list_records_state = {"ran": False}


@tool
def rag_list_records(kind: str) -> str:
    """Injected fake terminus-rag enumeration tool that records calls."""
    _rag_list_records_state["ran"] = True
    return '[{"id": "scene.evening"}]'


class FakeCallsRagTool(BaseChatModel):
    """Calls the mounted read tool once, then answers."""

    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "fake-calls-rag"

    def bind_tools(self, tools, **kwargs):  # noqa: A002
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.calls += 1
        if self.calls == 1:
            msg = AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "rag_list_records",
                        "args": {"kind": "scene"},
                        "id": "call_rag",
                        "type": "tool_call",
                    }
                ],
            )
        else:
            msg = AIMessage(content="There is one scene: scene.evening.")
        return ChatResult(generations=[ChatGeneration(message=msg)])


def test_approval_interrupt_only_lists_local_actuation_tools():
    """The approval middleware gates exactly run_scene + trigger_automation."""
    from app.agent import _APPROVAL_MIDDLEWARE

    assert set(_APPROVAL_MIDDLEWARE.interrupt_on) == {
        "run_scene",
        "trigger_automation",
    }


def test_mounted_read_tool_does_not_interrupt():
    """A mounted RAG read tool runs without pausing for approval (gated mode)."""
    _rag_list_records_state["ran"] = False
    graph = build_graph(
        model=FakeCallsRagTool(),
        auto_run=False,  # approval ON for actuation
        rag_tools=[rag_list_records],
        checkpointer=InMemorySaver(),
    )
    config = {"configurable": {"thread_id": "rag-t1"}}
    result = graph.invoke(
        {"messages": [HumanMessage(content="list the scenes")]}, config
    )
    # No approval interrupt for a read tool, and it actually ran.
    assert not result.get("__interrupt__"), "read tools must not interrupt"
    assert _rag_list_records_state["ran"] is True
    assert result["messages"][-1].content == "There is one scene: scene.evening."
