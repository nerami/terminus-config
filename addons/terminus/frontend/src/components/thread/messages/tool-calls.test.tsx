import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ToolMessage } from '@langchain/langgraph-sdk';

import { ToolCalls, ToolResult } from './tool-calls';

describe('ToolCalls', () => {
  it('shows the tool name but keeps the args collapsed until expanded', () => {
    render(
      <ToolCalls
        toolCalls={[
          {
            name: 'get_weather',
            id: 'call_1',
            args: { city: 'Paris' },
            type: 'tool_call',
          },
        ]}
      />,
    );

    // The tool name is always visible...
    expect(screen.getByText('get_weather')).toBeInTheDocument();
    // ...but the details stay hidden until the user opens the tool.
    expect(screen.queryByText('city')).not.toBeInTheDocument();
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /get_weather/i }));

    expect(screen.getByText('city')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('exposes the tool call id through its own button without expanding the call', () => {
    render(
      <ToolCalls
        toolCalls={[
          {
            name: 'get_weather',
            id: 'call_1',
            args: { city: 'Paris' },
            type: 'tool_call',
          },
        ]}
      />,
    );

    // The id lives in a dedicated button (labelled with the id), separate from
    // the collapsible trigger that opens the call.
    const idButton = screen.getByRole('button', { name: 'call_1' });
    expect(idButton).toBeInTheDocument();

    // Activating the id button reveals the id but does NOT expand the args.
    fireEvent.click(idButton);
    expect(screen.queryByText('city')).not.toBeInTheDocument();
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
  });

  it('renders without crashing when args are empty', () => {
    render(
      <ToolCalls
        toolCalls={[
          {
            name: 'no_args_tool',
            id: 'call_2',
            args: {},
            type: 'tool_call',
          },
        ]}
      />,
    );

    expect(screen.getByText('no_args_tool')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /no_args_tool/i }));

    expect(screen.getByText('{}')).toBeInTheDocument();
  });

  it('returns null when there are no tool calls', () => {
    const { container } = render(<ToolCalls toolCalls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

function toolMessage(content: string, overrides: Partial<ToolMessage> = {}): ToolMessage {
  return {
    type: 'tool',
    content,
    tool_call_id: 'tc_1',
    name: 'my_tool',
    ...overrides,
  } as ToolMessage;
}

describe('ToolResult', () => {
  it('shows the tool name but keeps the result collapsed until expanded', () => {
    render(<ToolResult message={toolMessage('all good')} />);

    // The tool name is always visible...
    expect(screen.getByText('my_tool')).toBeInTheDocument();
    // ...but the result content stays hidden until the user opens it.
    expect(screen.queryByText('all good')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /tool result/i }));

    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('reveals long content on trigger click', () => {
    const longContent = Array.from({ length: 20 }, (_, i) => `line ${i}`).join('\n');
    render(<ToolResult message={toolMessage(longContent)} />);

    // Collapsed: the last line is not visible yet.
    expect(screen.queryByText(/line 19/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /tool result/i }));

    // Expanded: full content is revealed.
    expect(screen.getByText(/line 19/)).toBeInTheDocument();
  });

  it('reveals multi-item array content on trigger click', () => {
    const arrayContent = JSON.stringify(Array.from({ length: 8 }, (_, i) => `item ${i}`));
    render(<ToolResult message={toolMessage(arrayContent)} />);

    expect(screen.queryByText('item 7')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /tool result/i }));

    expect(screen.getByText('item 7')).toBeInTheDocument();
  });

  it('renders without crashing when content is not a string (array of blocks)', () => {
    // Anthropic can deliver tool-result content as an array of content blocks
    // rather than a plain string; parsedContent then stays undefined and the
    // unguarded Object.entries(parsedContent) used to throw.
    const message = toolMessage('', {
      content: [{ type: 'text', text: 'block' }] as unknown as ToolMessage['content'],
    });
    expect(() => render(<ToolResult message={message} />)).not.toThrow();
    expect(screen.getByText('my_tool')).toBeInTheDocument();
  });
});
