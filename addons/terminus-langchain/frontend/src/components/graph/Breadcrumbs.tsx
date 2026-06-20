import { Fragment } from 'react';

import { useAtom, useAtomValue } from 'jotai';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { graphViewAtom, groupingOf, rootViewFor, topologyAtom, type GraphView } from '@/lib/ha-graph/atoms';
import { UNASSIGNED_AREA_ID } from '@/lib/ha-graph/types';

const ROOT_LABEL = {
  area: 'Areas',
  scenes: 'Scenes',
  automations: 'Automations',
  entities: 'Entities',
} as const;

interface Crumb {
  label: string;
  view: GraphView | null; // null = current page (not clickable)
}

export function Breadcrumbs() {
  const [view, setView] = useAtom(graphViewAtom);
  const topology = useAtomValue(topologyAtom);

  const areaName = (areaId: string) =>
    areaId === UNASSIGNED_AREA_ID ? 'Unassigned' : (topology?.areas.find((a) => a.area_id === areaId)?.name ?? areaId);

  const grouping = groupingOf(view);
  const isRoot =
    view.kind === 'areas' || view.kind === 'scenes' || view.kind === 'automations' || view.kind === 'entities';
  const crumbs: Crumb[] = [
    {
      label: ROOT_LABEL[grouping],
      view: isRoot ? null : rootViewFor(grouping),
    },
  ];

  if (grouping === 'area' && 'areaId' in view) {
    const areaId = view.areaId;
    crumbs.push({
      label: areaName(areaId),
      view: view.kind === 'area' ? null : { kind: 'area', areaId },
    });
  }

  if (view.kind === 'scene') {
    const name = topology?.scenes.find((s) => s.entity_id === view.sceneId)?.name ?? view.sceneId;
    crumbs.push({ label: name, view: null });
  }
  if (view.kind === 'automation') {
    const name = topology?.automations.find((a) => a.entity_id === view.automationId)?.name ?? view.automationId;
    crumbs.push({ label: name, view: null });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {c.view ? (
                <BreadcrumbLink
                  render={<button onClick={() => setView(c.view as GraphView)} />}
                  className="cursor-pointer"
                >
                  {c.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-[200px] truncate">{c.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
