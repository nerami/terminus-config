import React from 'react';

import { addons } from 'storybook/manager-api';
import { styled } from 'storybook/theming';

import { FONT_MONO, MIST, resolveTheme } from './theme';

import type { API_ComponentEntry } from 'storybook/internal/types';

const ShadcnBadge = styled.div`
  background-color: ${MIST.teal};
  padding: 4px;
  border-radius: 0;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  text-transform: lowercase;
  font-family: ${FONT_MONO};
`;

const shadcnComponents = [
  'Accordion',
  'Alert',
  'AlertDialog',
  'AspectRatio',
  'Avatar',
  'Badge',
  'Breadcrumb',
  'Button',
  'ButtonGroup',
  'Calendar',
  'Card',
  'Carousel',
  'Chart',
  'Checkbox',
  'Collapsible',
  'Combobox',
  'Command',
  'ContextMenu',
  'DataTable',
  'DatePicker',
  'Dialog',
  'Direction',
  'Drawer',
  'DropdownMenu',
  'Empty',
  'Field',
  'HoverCard',
  'Input',
  'InputGroup',
  'InputOTP',
  'Item',
  'Kbd',
  'Label',
  'Menubar',
  'NativeSelect',
  'NavigationMenu',
  'Pagination',
  'Popover',
  'Progress',
  'RadioGroup',
  'Resizable',
  'ScrollArea',
  'Select',
  'Separator',
  'Sheet',
  'Sidebar',
  'Skeleton',
  'Slider',
  'Sonner',
  'Spinner',
  'Switch',
  'Table',
  'Tabs',
  'Textarea',
  'Toast',
  'Toggle',
  'ToggleGroup',
  'Tooltip',
  'Typography',
];

// Re-apply the full manager config so the theme tracks the OS light/dark setting,
// mirroring the preview's system-theme sync.
const applyConfig = () => {
  addons.setConfig({
    theme: resolveTheme(),
    sidebar: {
      renderLabel: (item) => {
        if ((item as API_ComponentEntry).parent === 'ui' && shadcnComponents.includes(item.name)) {
          return (
            <>
              {item.name}
              <ShadcnBadge>shadcn/ui</ShadcnBadge>
            </>
          );
        }

        return item.name;
      },
    },
  });
};

applyConfig();

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyConfig);
}
