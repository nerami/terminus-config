import type { HITLRequest } from '@/components/thread/agent-inbox/types';
import type { ContextItem } from '@/lib/chat-context';
import type { Topology } from '@/lib/ha-graph/types';
import type { ContentBlock } from '@langchain/core/messages';
import type { AIMessage, Interrupt, Message, ToolMessage } from '@langchain/langgraph-sdk';

export const FIXTURE_TOPOLOGY: Topology = {
  areas: [
    { area_id: 'living_room', name: 'Living Room' },
    { area_id: 'master_bedroom', name: 'Master Bedroom' },
  ],
  entities: [
    {
      entity_id: 'light.lr_led_strip',
      name: 'LED Strip',
      domain: 'light',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'switch.lr_lamp',
      name: 'Floor Lamp',
      domain: 'switch',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'sensor.lr_illuminance',
      name: 'Illuminance',
      domain: 'sensor',
      area_id: 'living_room',
      device_id: null,
      device_name: null,
    },
    {
      entity_id: 'light.mb_led_one',
      name: 'Led One',
      domain: 'light',
      area_id: 'master_bedroom',
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [
    {
      entity_id: 'scene.lr_dim',
      name: 'Dim',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
    {
      entity_id: 'scene.lr_bright',
      name: 'Bright',
      area_id: 'living_room',
      entities: ['light.lr_led_strip', 'switch.lr_lamp'],
    },
  ],
  automations: [
    {
      entity_id: 'automation.lr_sunset_dim',
      name: 'Sunset Dim',
      area_id: 'living_room',
      numeric_id: '1',
      references: { entities: ['light.lr_led_strip'], scenes: ['scene.lr_dim'], devices: [] },
    },
    {
      entity_id: 'automation.lr_morning_bright',
      name: 'Morning Bright',
      area_id: 'living_room',
      numeric_id: '2',
      references: { entities: ['light.lr_led_strip'], scenes: ['scene.lr_bright'], devices: [] },
    },
  ],
};

export const EMPTY_TOPOLOGY: Topology = { areas: [], entities: [], scenes: [], automations: [] };

export const SAMPLE_TOOL_CALLS: AIMessage['tool_calls'] = [
  { id: 'call-1', name: 'HassTurnOn', args: { entity_id: 'light.lr_led_strip' }, type: 'tool_call' },
  {
    id: 'call-2',
    name: 'HassLightSet',
    args: { entity_id: 'light.lr_led_strip', brightness_pct: 60, color_temp: 370 },
    type: 'tool_call',
  },
];

export const SAMPLE_TOOL_MESSAGE: ToolMessage = {
  id: 'msg-3',
  type: 'tool',
  content: 'light.lr_led_strip turned on successfully.',
  tool_call_id: 'call-1',
  name: 'HassTurnOn',
};

export const FIXTURE_MESSAGES: Message[] = [
  { id: 'msg-1', type: 'human', content: 'Turn on the living room lights and set them to warm white at 60%.' },
  { id: 'msg-2', type: 'ai', content: '', tool_calls: SAMPLE_TOOL_CALLS },
  {
    id: 'msg-3',
    type: 'tool',
    content: 'light.lr_led_strip turned on successfully.',
    tool_call_id: 'call-1',
    name: 'HassTurnOn',
  },
  {
    id: 'msg-4',
    type: 'tool',
    content: 'Brightness set to 60 %, color temperature 370 K.',
    tool_call_id: 'call-2',
    name: 'HassLightSet',
  },
  {
    id: 'msg-5',
    type: 'ai',
    content: 'Done — the living room lights are on at **60% brightness**, warm white (370 K).',
  },
];

export const SAMPLE_MARKDOWN = `# Heading 1
## Heading 2

A paragraph with **bold**, _italic_, \`inline code\`, and a [link](https://example.com).

- bullet one
- bullet two
  - nested

1. first
2. second

> A blockquote.

| Entity | State |
| --- | --- |
| light.lr_led_strip | on |
| switch.lr_lamp | off |

\`\`\`python
def greet(name: str) -> str:
    return f"hello {name}"
\`\`\`
`;

export const SAMPLE_INTERRUPT: Record<string, unknown> = {
  action_request: { action: 'HassLightSet', args: { entity_id: 'light.lr_led_strip', brightness_pct: 80 } },
  description: 'Confirm before changing the living-room brightness.',
};

export const FIXTURE_HITL_INTERRUPT: Interrupt<HITLRequest> = {
  id: 'interrupt-1',
  value: {
    action_requests: [
      {
        name: 'HassLightSet',
        args: { entity_id: 'light.lr_led_strip', brightness_pct: 80 },
        description: 'Confirm before changing the living-room brightness.',
      },
    ],
    review_configs: [
      {
        action_name: 'HassLightSet',
        allowed_decisions: ['approve', 'reject', 'edit'],
      },
    ],
  },
};

export const SAMPLE_CONTEXT_ITEMS: ContextItem[] = [
  { id: 'page:areas', kind: 'page', label: 'Areas overview', detail: 'All rooms and their devices' },
  { id: 'node:light.lr_led_strip', kind: 'node', label: 'LED Strip', detail: 'light · Living Room' },
];

export const SAMPLE_IMAGE_BLOCK: ContentBlock.Multimodal.Data = {
  type: 'image',
  mimeType: 'image/png',
  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
} as unknown as ContentBlock.Multimodal.Data;

export const SAMPLE_FILE_BLOCK: ContentBlock.Multimodal.Data = {
  type: 'file',
  mimeType: 'application/pdf',
  name: 'automation-notes.pdf',
  data: '',
} as unknown as ContentBlock.Multimodal.Data;
