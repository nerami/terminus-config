"""Generate short, human-friendly chat titles from a conversation's first message.

The frontend asks the backend to summarise the user's opening message into a
compact title (e.g. ``"Living Room Lights"``) to label the chat thread. This
module exposes a canonical LCEL chain plus pure helpers, all designed so that:

  * importing the module never constructs a model or needs an API key (the
    default chain is built lazily and cached), and
  * generation is robust: any model error, or an empty model reply, falls back
    to a cleaned/truncated version of the user's own message.
"""

from __future__ import annotations

import logging
import re

from langchain_core.language_models import BaseChatModel
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from .config import load_settings

# Instruct the model to emit a bare title and nothing else. ``clean_title``
# defends against the model ignoring parts of this, but a tight prompt keeps the
# common case clean.
SYSTEM = (
    "You generate a short, specific title for a chat in a smart-home assistant. "
    "Summarize the user's first message in 3 to 6 words. Use Title Case. "
    "Do not wrap the title in quotes. Do not add trailing punctuation. "
    "Return plain text only. Reply with only the title."
)

# Max title length; long replies are clamped on a word boundary when possible.
_MAX_LEN = 60

# Cap how much of the user's message we send to the model / use as a fallback.
_MAX_INPUT = 2000

logger = logging.getLogger(__name__)

_default: object | None = None


def build_title_chain(model: BaseChatModel | None = None):
    """Build the title chain: prompt | model | StrOutputParser.

    When ``model`` is ``None`` a ``ChatAnthropic`` is constructed from the
    configured ``title_model`` (a cheaper/faster model than the agent itself;
    the API key is read from ``ANTHROPIC_API_KEY``).
    """
    if model is None:
        from langchain_anthropic import ChatAnthropic

        model = ChatAnthropic(model=load_settings().title_model)
    prompt = ChatPromptTemplate.from_messages(
        [("system", SYSTEM), ("human", "{message}")]
    )
    return prompt | model | StrOutputParser()


def _default_chain():
    """Return the lazily-built, cached default chain (model built on first use)."""
    global _default
    if _default is None:
        _default = build_title_chain()
    return _default


def clean_title(raw: str) -> str:
    """Normalise raw model output (or a fallback message) into a tidy title.

    Takes the first non-empty line, strips surrounding quotes/whitespace, drops a
    single trailing ``. ! ? :``, collapses internal whitespace, and clamps to
    ``_MAX_LEN`` chars (cutting on a word boundary when possible). Empty in,
    empty out.
    """
    if not raw:
        return ""

    line = ""
    for candidate in raw.splitlines():
        if candidate.strip():
            line = candidate
            break
    if not line:
        return ""

    title = line.strip().strip("\"'").strip()
    title = title.rstrip(".!?:").strip()
    title = re.sub(r"\s+", " ", title)

    if len(title) > _MAX_LEN:
        clipped = title[:_MAX_LEN]
        boundary = clipped.rfind(" ")
        # Only honour the boundary if it leaves a reasonable amount of text.
        if boundary > 0:
            clipped = clipped[:boundary]
        title = clipped.strip()

    return title


async def agenerate_title(message: str, *, chain=None) -> str:
    """Generate a chat title for ``message`` (async).

    Returns ``""`` for an empty/blank message. Otherwise invokes the title chain
    and cleans its output. On any error, or when the cleaned output is empty,
    falls back to a cleaned/truncated version of the user's own message.
    """
    message = message.strip()
    if not message:
        return ""

    runnable = chain
    if runnable is None:
        # Only reach for a model when an Anthropic key is configured; otherwise
        # degrade to a cleaned version of the user's own message.
        if not load_settings().anthropic_api_key:
            return clean_title(message[:_MAX_INPUT])
        runnable = _default_chain()
    try:
        raw = await runnable.ainvoke({"message": message[:_MAX_INPUT]})
        title = clean_title(raw)
        if title:
            return title
    except Exception:  # noqa: BLE001 - any failure degrades to the fallback
        pass

    return clean_title(message[:_MAX_INPUT])
