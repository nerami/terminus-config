"""Agent wiring tests using a stub chat model (no real Anthropic calls)."""

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.outputs import ChatGeneration, ChatResult

from app import tools
from app.agent import AgentContext, build_graph


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
