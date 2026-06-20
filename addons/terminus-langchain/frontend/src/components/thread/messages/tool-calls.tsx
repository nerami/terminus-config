import { useState } from 'react';

import { AIMessage, ToolMessage } from '@langchain/langgraph-sdk';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemContent, ItemGroup } from '@/components/ui/item';

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === 'object' && value !== null);
}

function ArgRow({ name, value }: { name: React.ReactNode; value: any }) {
  return (
    <div className="border-border flex min-w-0 flex-col gap-1 border-b py-2 last:border-b-0 sm:flex-row sm:gap-4">
      <div className="text-foreground shrink-0 text-sm font-medium sm:w-40 sm:whitespace-nowrap">{name}</div>
      <div className="text-muted-foreground min-w-0 text-sm break-words">
        {isComplexValue(value) ? (
          <code className="bg-muted/50 block px-2 py-1 font-mono text-sm break-all whitespace-pre-wrap">
            {JSON.stringify(value, null, 2)}
          </code>
        ) : (
          String(value)
        )}
      </div>
    </div>
  );
}

function ToolCallItem({ toolCall }: { toolCall: NonNullable<AIMessage['tool_calls']>[number] }) {
  const [open, setOpen] = useState(false);
  const args = toolCall.args as Record<string, any>;
  const hasArgs = Object.keys(args).length > 0;

  return (
    <Item variant="outline" className="min-w-0 flex-col items-stretch p-0">
      <Collapsible className="min-w-0" open={open} onOpenChange={setOpen}>
        {/* The tool name is the trigger; the call's details stay collapsed so a
            tool reads as a single line until the user opens it. */}
        <CollapsibleTrigger className="hover:bg-muted/50 data-[panel-open]:bg-muted/50 flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left transition-colors">
          <span className="text-foreground min-w-0 flex-1 truncate font-medium">{toolCall.name}</span>
          <div className="flex shrink-0 items-center gap-2">
            {toolCall.id && <code className="bg-muted px-2 py-1 text-sm">{toolCall.id}</code>}
            {open ? (
              <ChevronUp className="text-muted-foreground size-4" />
            ) : (
              <ChevronDown className="text-muted-foreground size-4" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ItemContent className="border-border min-w-0 gap-0 border-t px-4 py-2">
            {hasArgs ? (
              Object.entries(args).map(([key, value], argIdx) => <ArgRow key={argIdx} name={key} value={value} />)
            ) : (
              <code className="text-muted-foreground text-sm">{'{}'}</code>
            )}
          </ItemContent>
        </CollapsibleContent>
      </Collapsible>
    </Item>
  );
}

export function ToolCalls({ toolCalls }: { toolCalls: AIMessage['tool_calls'] }) {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <ItemGroup className="min-w-0 gap-2">
      {toolCalls.map((tc, idx) => (
        <ToolCallItem key={idx} toolCall={tc} />
      ))}
    </ItemGroup>
  );
}

export function ToolResult({ message }: { message: ToolMessage }) {
  const [open, setOpen] = useState(false);

  let parsedContent: any;
  let isJsonContent = false;

  try {
    if (typeof message.content === 'string') {
      parsedContent = JSON.parse(message.content);
      isJsonContent = isComplexValue(parsedContent);
    }
  } catch {
    // Content is not JSON, use as is
    parsedContent = message.content;
  }

  const contentStr = isJsonContent ? JSON.stringify(parsedContent, null, 2) : String(message.content);
  const isArray = isJsonContent && Array.isArray(parsedContent);

  const rows = isArray
    ? (parsedContent as any[]).map((value, argIdx) => <ArgRow key={argIdx} name={argIdx} value={value} />)
    : Object.entries(parsedContent).map(([key, value], argIdx) => <ArgRow key={argIdx} name={key} value={value} />);

  return (
    <Item variant="outline" className="min-w-0 flex-col items-stretch p-0">
      <Collapsible className="min-w-0" open={open} onOpenChange={setOpen}>
        {/* Like a tool call, the result reads as a single line until opened. */}
        <CollapsibleTrigger className="hover:bg-muted/50 data-[panel-open]:bg-muted/50 flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left transition-colors">
          <span className="text-foreground min-w-0 flex-1 truncate font-medium">
            Tool Result{message.name ? ': ' : ''}
            {message.name && <code className="bg-muted px-2 py-1">{message.name}</code>}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            {message.tool_call_id && <code className="bg-muted px-2 py-1 text-sm">{message.tool_call_id}</code>}
            {open ? (
              <ChevronUp className="text-muted-foreground size-4" />
            ) : (
              <ChevronDown className="text-muted-foreground size-4" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {isJsonContent ? (
            <ItemContent className="border-border min-w-0 gap-0 border-t px-4 py-2">{rows}</ItemContent>
          ) : (
            <ItemContent className="bg-muted border-border min-w-0 border-t px-4 py-2">
              <code className="text-foreground block text-sm break-all whitespace-pre-wrap">{contentStr}</code>
            </ItemContent>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Item>
  );
}
