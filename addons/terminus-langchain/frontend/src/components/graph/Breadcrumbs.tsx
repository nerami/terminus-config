import { useAtom, useAtomValue } from "jotai";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  graphViewAtom,
  topologyAtom,
  type GraphView,
} from "@/lib/ha-graph/atoms";
import { UNASSIGNED_AREA_ID } from "@/lib/ha-graph/types";

interface Crumb {
  label: string;
  view: GraphView | null; // null = current page (not clickable)
}

export function Breadcrumbs() {
  const [view, setView] = useAtom(graphViewAtom);
  const topology = useAtomValue(topologyAtom);

  const areaName = (areaId: string) =>
    areaId === UNASSIGNED_AREA_ID
      ? "Unassigned"
      : (topology?.areas.find((a) => a.area_id === areaId)?.name ?? areaId);

  const crumbs: Crumb[] = [
    { label: "Areas", view: view.kind === "areas" ? null : { kind: "areas" } },
  ];

  if (view.kind !== "areas") {
    const areaId = view.areaId;
    crumbs.push({
      label: areaName(areaId),
      view: view.kind === "area" ? null : { kind: "area", areaId },
    });
  }

  if (view.kind === "scene") {
    const name =
      topology?.scenes.find((s) => s.entity_id === view.sceneId)?.name ??
      view.sceneId;
    crumbs.push({ label: name, view: null });
  }
  if (view.kind === "automation") {
    const name =
      topology?.automations.find((a) => a.entity_id === view.automationId)
        ?.name ?? view.automationId;
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
                  asChild
                  className="cursor-pointer"
                >
                  <button onClick={() => setView(c.view as GraphView)}>
                    {c.label}
                  </button>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-[200px] truncate">
                  {c.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
