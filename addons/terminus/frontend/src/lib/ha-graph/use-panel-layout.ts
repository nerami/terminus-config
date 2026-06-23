// src/lib/ha-graph/use-panel-layout.ts
import { useCallback, useMemo } from 'react';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

/**
 * The panel layout, sourced directly from the `?layout` URL param — there is no
 * separate store. The value IS the URL token.
 *  - chat:     topology not shown (chat occupies the row; an artifact may still
 *              open the right column — tracked separately).
 *  - split:    chat + topology side by side.
 *  - topology: topology fills the row, chat hidden.
 *
 * This hook owns all the topology-nav URL params (`layout` + the view keys
 * `group/area/scene/automation`) so that closing the topology can clear the view
 * atomically with the layout. The view itself is read/navigated via `useGraphView`;
 * the only place layout transitions touch the view params is the close path here.
 */
export type PanelLayout = 'chat' | 'topology' | 'split';

const LAYOUTS = ['chat', 'topology', 'split'] as const;

/** The view params, all null — written when the topology closes. */
const CLEARED_VIEW = { group: null, area: null, scene: null, automation: null } as const;

export function usePanelLayout(): {
  layout: PanelLayout;
  setLayout: (l: PanelLayout) => void;
  openTopology: () => void;
  closeTopology: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
} {
  const [nav, setNav] = useQueryStates({
    layout: parseAsStringLiteral(LAYOUTS),
    group: parseAsString,
    area: parseAsString,
    scene: parseAsString,
    automation: parseAsString,
  });
  const layout: PanelLayout = nav.layout ?? 'chat';

  const setLayout = useCallback(
    (l: PanelLayout) => void setNav(l === 'chat' ? { layout: 'chat', ...CLEARED_VIEW } : { layout: l }),
    [setNav],
  );

  const actions = useMemo(
    () => ({
      openTopology: () => setNav((cur) => ((cur.layout ?? 'chat') === 'chat' ? { layout: 'split' } : {})),
      closeTopology: () => setNav({ layout: 'chat', ...CLEARED_VIEW }),
      enterFullscreen: () => setNav({ layout: 'topology' }),
      exitFullscreen: () => setNav((cur) => (cur.layout === 'topology' ? { layout: 'split' } : {})),
    }),
    [setNav],
  );

  return { layout, setLayout, ...actions };
}
