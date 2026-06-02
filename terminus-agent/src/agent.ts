import type { Request, Response } from "express"
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
  BaseMessage,
} from "@langchain/core/messages"
import { v4 as uuidv4 } from "uuid"

type AguiMessage = {
  role: string
  content?: string
  id?: string
  toolCalls?: Array<{ id: string; function: { name: string; arguments: string } }>
  toolCallId?: string
  name?: string
}

type RunAgentInput = {
  threadId: string
  runId: string
  messages: AguiMessage[]
  state?: unknown
  tools?: unknown[]
  context?: unknown[]
  forwardedProps?: unknown
}

const EventType = {
  RUN_STARTED: "RUN_STARTED",
  RUN_FINISHED: "RUN_FINISHED",
  RUN_ERROR: "RUN_ERROR",
  STEP_STARTED: "STEP_STARTED",
  STEP_FINISHED: "STEP_FINISHED",
  TEXT_MESSAGE_START: "TEXT_MESSAGE_START",
  TEXT_MESSAGE_CONTENT: "TEXT_MESSAGE_CONTENT",
  TEXT_MESSAGE_END: "TEXT_MESSAGE_END",
  TOOL_CALL_START: "TOOL_CALL_START",
  TOOL_CALL_ARGS: "TOOL_CALL_ARGS",
  TOOL_CALL_END: "TOOL_CALL_END",
  TOOL_CALL_RESULT: "TOOL_CALL_RESULT",
  STATE_SNAPSHOT: "STATE_SNAPSHOT",
} as const

function aguiToLangchain(messages: AguiMessage[]): BaseMessage[] {
  const result: BaseMessage[] = []
  for (const m of messages) {
    if (m.role === "user") {
      result.push(new HumanMessage(m.content ?? ""))
    } else if (m.role === "assistant") {
      if (m.toolCalls?.length) {
        result.push(
          new AIMessage({
            content: m.content ?? "",
            tool_calls: m.toolCalls.map((tc) => ({
              id: tc.id,
              name: tc.function.name,
              args: JSON.parse(tc.function.arguments || "{}"),
              type: "tool_call" as const,
            })),
          }),
        )
      } else {
        result.push(new AIMessage(m.content ?? ""))
      }
    } else if (m.role === "tool") {
      result.push(
        new ToolMessage({
          content: m.content ?? "",
          tool_call_id: m.toolCallId ?? "",
          name: m.name ?? "tool",
        }),
      )
    } else if (m.role === "system" || m.role === "developer") {
      result.push(new SystemMessage(m.content ?? ""))
    }
  }
  return result
}

function sse(res: Response, event: Record<string, unknown>) {
  res.write(`data: ${JSON.stringify(event)}\n\n`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleAgentRequest(graph: any, req: Request, res: Response) {
  const input = req.body as RunAgentInput
  const { threadId, runId } = input

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()

  const messages = aguiToLangchain(input.messages ?? [])

  sse(res, { type: EventType.RUN_STARTED, threadId, runId })

  try {
    const messageId = uuidv4()
    let textOpen = false
    const openToolCalls = new Map<string, string>()

    const stream = graph.streamEvents({ messages }, { version: "v2" })

    for await (const { event, data, name } of stream) {
      if (event === "on_chain_start" && name !== "LangGraph") {
        sse(res, { type: EventType.STEP_STARTED, stepName: name })
      } else if (event === "on_chain_end" && name !== "LangGraph") {
        sse(res, { type: EventType.STEP_FINISHED, stepName: name })
      } else if (event === "on_chat_model_stream") {
        const chunk = data.chunk
        const content = chunk.content
        let text = ""
        if (typeof content === "string") {
          text = content
        } else if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === "text") text += block.text
          }
        }
        if (text) {
          if (!textOpen) {
            sse(res, { type: EventType.TEXT_MESSAGE_START, messageId, role: "assistant" })
            textOpen = true
          }
          sse(res, { type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: text })
        }
      } else if (event === "on_chat_model_end") {
        if (textOpen) {
          sse(res, { type: EventType.TEXT_MESSAGE_END, messageId })
          textOpen = false
        }
        const output = data.output
        if (output?.tool_calls?.length) {
          for (const tc of output.tool_calls) {
            const toolCallId = tc.id ?? uuidv4()
            openToolCalls.set(tc.name, toolCallId)
            sse(res, {
              type: EventType.TOOL_CALL_START,
              toolCallId,
              toolCallName: tc.name,
              parentMessageId: messageId,
            })
            sse(res, {
              type: EventType.TOOL_CALL_ARGS,
              toolCallId,
              delta: JSON.stringify(tc.args ?? {}),
            })
            sse(res, { type: EventType.TOOL_CALL_END, toolCallId })
          }
        }
      } else if (event === "on_tool_end") {
        const toolCallId = openToolCalls.get(name) ?? uuidv4()
        openToolCalls.delete(name)
        const content =
          typeof data.output?.content === "string"
            ? data.output.content
            : JSON.stringify(data.output ?? "")
        sse(res, { type: EventType.TOOL_CALL_RESULT, toolCallId, content })
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("agent error:", err)
    sse(res, { type: EventType.RUN_ERROR, message, code: "AGENT_ERROR" })
  }

  sse(res, { type: EventType.RUN_FINISHED, threadId, runId })
  res.end()
}
