import { useCallback, useMemo } from 'react';

import { useSetAtom } from 'jotai';
import { parseAsString, useQueryStates } from 'nuqs';

import { type GraphView, groupingOf, selectedNodeAtom } from './atoms';

/**
 * Derive a `GraphView` from the topology query params. `group` selects the
 * grouping dimension; within it the present ids imply how deep we've navigated.
 */
export function viewFromParams(
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
    if (automation) return { kind: 'automation', areaId: '', automationId: automation, via: 'automations' };
    return { kind: 'automations' };
  }
  if (group === 'entities') return { kind: 'entities' };

  // Default: Area grouping.
  if (scene && area) return { kind: 'scene', areaId: area, sceneId: scene, via: 'area' };
  if (automation && area) return { kind: 'automation', areaId: area, automationId: automation, via: 'area' };
  if (area) return { kind: 'area', areaId: area };
  return { kind: 'areas' };
}

/** The inverse: the URL params for a view. Default (Area) grouping is omitted for clean links. */
export function viewToParams(view: GraphView): {
  group: string | null;
  area: string | null;
  scene: string | null;
  automation: string | null;
} {
  const grouping = groupingOf(view);
  return {
    group: grouping !== 'area' ? grouping : null,
    area: 'areaId' in view && view.areaId ? view.areaId : null,
    scene: view.kind === 'scene' ? view.sceneId : null,
    automation: view.kind === 'automation' ? view.automationId : null,
  };
}

/**
 * The topology graph view, sourced directly from the `?group/area/scene/automation`
 * URL params — there is no separate store. Navigating writes the inverse params and
 * clears the node selection (so the new canvas starts all-dimmed). Returns the
 * `[view, setView]` tuple shape of `useAtom`.
 */
export function useGraphView(): [GraphView, (view: GraphView) => void] {
  const [params, setParams] = useQueryStates({
    group: parseAsString,
    area: parseAsString,
    scene: parseAsString,
    automation: parseAsString,
  });
  const setSelectedNode = useSetAtom(selectedNodeAtom);

  const view = useMemo(
    () => viewFromParams(params.group, params.area, params.scene, params.automation),
    [params.group, params.area, params.scene, params.automation],
  );

  const setView = useCallback(
    (next: GraphView) => {
      void setParams(viewToParams(next));
      setSelectedNode(null);
    },
    [setParams, setSelectedNode],
  );

  return [view, setView];
}
