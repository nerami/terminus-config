import { useEffect, useRef } from 'react';

import { useAtom } from 'jotai';
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';

import {
  type GraphView,
  graphViewAtom,
  groupingOf,
  layoutToPanels,
  type PanelName,
  panelLayoutAtom,
  panelsToLayout,
  viewKey,
} from '@/lib/ha-graph/atoms';

/**
 * Derive a `GraphView` from the topology query params. `group` selects the
 * grouping dimension; within it the present ids imply how deep we've navigated.
 */
function viewFromParams(
  group: string | null,
  area: string | null,
  scene: string | null,
  automation: string | null,
): GraphView {
  if (group === 'scenes') {
    if (scene) return { kind: 'scene', areaId: '', sceneId: scene, via: 'scenes' };
    return { kind: 'scenes' };
  }
  if (group === 'automations') {
    if (automation)
      return {
        kind: 'automation',
        areaId: '',
        automationId: automation,
        via: 'automations',
      };
    return { kind: 'automations' };
  }
  if (group === 'entities') return { kind: 'entities' };

  // Default: Area grouping.
  if (scene && area) return { kind: 'scene', areaId: area, sceneId: scene, via: 'area' };
  if (automation && area)
    return {
      kind: 'automation',
      areaId: area,
      automationId: automation,
      via: 'area',
    };
  if (area) return { kind: 'area', areaId: area };
  return { kind: 'areas' };
}

/**
 * Keeps the Home Topology panel state in the URL query string so it survives
 * refresh / new-tab / back-forward. The URL is the source of truth: it hydrates
 * the Jotai atoms (`panelLayoutAtom`, `graphViewAtom`) on mount and on
 * back/forward, and atom changes (toolbar/canvas/breadcrumbs) are mirrored back.
 *
 * Both directions are gated by equality checks so no-op writes are skipped — that
 * stops an update loop. The atoms->URL effect is also skipped on the very first
 * commit (`mounted` ref) so it can't clobber a deep-linked URL before the
 * URL->atoms hydration has applied. The layout param always lists the visible
 * panels (never null) — even the default `chat-full` state is written explicitly.
 *
 * Renders nothing; mount it once inside the chat tree.
 */
export function TopologyUrlSync(): null {
  const [panels, setPanels] = useQueryState(
    'layout',
    parseAsArrayOf(parseAsStringLiteral(['chat', 'topology'] as const)).withDefault([]),
  );
  const [group, setGroup] = useQueryState('group', parseAsString);
  const [area, setArea] = useQueryState('area', parseAsString);
  const [scene, setScene] = useQueryState('scene', parseAsString);
  const [automation, setAutomation] = useQueryState('automation', parseAsString);

  const [layout, setLayout] = useAtom(panelLayoutAtom);
  const [view, setView] = useAtom(graphViewAtom);

  // URL -> atom (mount/deep-link + back/forward navigation).
  //
  // The layout param lists the visible panels; restore it directly (absolute
  // set, not an action). View sync is gated on topology being visible: when the
  // panel closes, atoms→URL clears the topology params, which would otherwise
  // trigger viewFromParams(null,…) and reset graphViewAtom to "areas" as an
  // unintended roundtrip side-effect.
  useEffect(() => {
    const next = panelsToLayout(panels);
    if (next !== layout) setLayout(next);
    if (next !== 'chat-full') {
      const nextView = viewFromParams(group, area, scene, automation);
      if (viewKey(nextView) !== viewKey(view)) setView(nextView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panels, group, area, scene, automation]);

  // atoms -> URL (toolbar open/close, canvas drill-down, breadcrumbs). Skipped
  // on the first commit so it never overwrites the incoming URL before hydration.
  // Exception: if the persisted atom differs from the URL panels on first render,
  // write it now so the URL reflects the actual panel state immediately.
  const mounted = useRef(false);
  useEffect(() => {
    const wantPanels: PanelName[] = layoutToPanels(layout);
    const topologyVisible = layout !== 'chat-full';
    if (!mounted.current) {
      if (panels.join(',') !== wantPanels.join(',')) setPanels(wantPanels);
      return;
    }
    const grouping = groupingOf(view);
    // Keep the default (Area) grouping out of the URL for clean links.
    const wantGroup = topologyVisible && grouping !== 'area' ? grouping : null;
    const wantArea = topologyVisible && 'areaId' in view && view.areaId ? view.areaId : null;
    const wantScene = topologyVisible && view.kind === 'scene' ? view.sceneId : null;
    const wantAuto = topologyVisible && view.kind === 'automation' ? view.automationId : null;
    if (panels.join(',') !== wantPanels.join(',')) setPanels(wantPanels);
    if (group !== wantGroup) setGroup(wantGroup);
    if (area !== wantArea) setArea(wantArea);
    if (scene !== wantScene) setScene(wantScene);
    if (automation !== wantAuto) setAutomation(wantAuto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, view]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return null;
}
