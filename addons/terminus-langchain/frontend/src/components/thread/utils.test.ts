import { describe, expect, it } from 'vitest';

import type { Message } from '@langchain/langgraph-sdk';

import { chatTitleFromMessages } from './utils';

function human(text: string): Message {
  return { type: 'human', content: text } as Message;
}

function ai(text: string): Message {
  return { type: 'ai', content: text } as Message;
}

describe('chatTitleFromMessages', () => {
  it('returns the text of the first human message', () => {
    expect(chatTitleFromMessages([human('Turn on the lights'), ai('Done')])).toBe('Turn on the lights');
  });

  it('skips leading non-human messages', () => {
    expect(chatTitleFromMessages([ai('Hi there'), human('What can you do?')])).toBe('What can you do?');
  });

  it('extracts text from multimodal human content', () => {
    const message = {
      type: 'human',
      content: [
        { type: 'image', source_type: 'base64', data: 'x', mime_type: 'image/png' },
        { type: 'text', text: 'Describe this' },
      ],
    } as unknown as Message;
    expect(chatTitleFromMessages([message])).toBe('Describe this');
  });

  it('returns an empty string when there is no human message', () => {
    expect(chatTitleFromMessages([])).toBe('');
    expect(chatTitleFromMessages([ai('only assistant')])).toBe('');
  });
});
