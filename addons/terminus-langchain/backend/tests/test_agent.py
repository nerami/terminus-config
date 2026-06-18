"""Agent wiring tests using a stub chat model (no real Anthropic calls)."""

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.outputs import ChatGeneration, ChatResult

from app import tools
from app.agent import build_graph


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


def _dev_settings():
    from app.config import Settings

    return Settings(
        ws_url="wss://hass.local:8123/api/websocket",
        ha_token="llt",
        anthropic_api_key="k",
        model="claude-sonnet-4-6",
        use_supervisor=False,
    )
