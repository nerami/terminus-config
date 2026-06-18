"""The LangGraph agent graph loaded by the LangGraph dev server.

``langgraph.json`` points at ``./app/agent.py:graph``. Absolute imports keep the
module loadable both as part of the installed ``app`` package and when imported
by path by the LangGraph server.
"""

from __future__ import annotations

from typing import Optional

from langchain.agents import create_agent
from langchain_core.language_models import BaseChatModel
from langchain_anthropic import ChatAnthropic

from app.config import load_settings
from app.tools import ha_basic_info

SYSTEM_PROMPT = (
    "You are Terminus, a helpful assistant embedded in a Home Assistant smart "
    "home. When the user asks about this Home Assistant instance - its version, "
    "configuration, or how many entities/devices it has - call the "
    "ha_basic_info tool and answer from its JSON result. Be concise."
)


def build_graph(model: Optional[BaseChatModel] = None):
    if model is None:
        settings = load_settings()
        model = ChatAnthropic(model=settings.model)
    return create_agent(model, tools=[ha_basic_info], system_prompt=SYSTEM_PROMPT)


graph = build_graph()
