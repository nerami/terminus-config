import {
  groupingOf,
  rootViewFor,
  type GraphGrouping,
  type GraphView,
} from "./atoms";
import type { Topology } from "./types";
import { UNASSIGNED_AREA_ID } from "./types";

export interface NavOption {
  value: string;
  label: string;
}

/**
 * One floating dropdown in the canvas top-left chain. The first level is always
 * the grouping dimension; deeper levels are the navigation path (sibling
 * switchers). `select` returns the view to navigate to for a chosen option.
 */
export interface NavLevel {
  id: string;
  value: string;
  options: NavOption[];
  select: (value: string) => GraphView;
}

const GROUPING_OPTIONS: NavOption[] = [
  { value: "area", label: "Area" },
  { value: "scenes", label: "Scenes" },
  { value: "automations", label: "Automations" },
  { value: "entities", label: "Entities" },
];

function areaOptions(topology: Topology): NavOption[] {
  const opts = topology.areas.map((a) => ({ value: a.area_id, label: a.name }));
  const hasUnassigned =
    topology.entities.some((e) => e.area_id == null) ||
    topology.scenes.some((s) => s.area_id == null) ||
    topology.automations.some((a) => a.area_id == null);
  if (hasUnassigned) {
    opts.push({ value: UNASSIGNED_AREA_ID, label: "Unassigned" });
  }
  return opts;
}

/**
 * Build the dropdown chain for the current view. Changing the first (grouping)
 * dropdown navigates to that dimension's root, which clears every deeper level.
 */
export function navLevels(topology: Topology, view: GraphView): NavLevel[] {
  const grouping = groupingOf(view);
  const levels: NavLevel[] = [
    {
      id: "grouping",
      value: grouping,
      options: GROUPING_OPTIONS,
      select: (g) => rootViewFor(g as GraphGrouping),
    },
  ];

  if (grouping === "area" && "areaId" in view) {
    const areaId = view.areaId;
    levels.push({
      id: "area",
      value: areaId,
      options: areaOptions(topology),
      select: (id) => ({ kind: "area", areaId: id }),
    });

    if (view.kind === "scene") {
      const scenesHere = topology.scenes.filter(
        (s) => (s.area_id ?? UNASSIGNED_AREA_ID) === areaId,
      );
      levels.push({
        id: "scene",
        value: view.sceneId,
        options: scenesHere.map((s) => ({ value: s.entity_id, label: s.name })),
        select: (sceneId) => ({ kind: "scene", areaId, sceneId, via: "area" }),
      });
    } else if (view.kind === "automation") {
      const autosHere = topology.automations.filter(
        (a) => (a.area_id ?? UNASSIGNED_AREA_ID) === areaId,
      );
      levels.push({
        id: "automation",
        value: view.automationId,
        options: autosHere.map((a) => ({ value: a.entity_id, label: a.name })),
        select: (automationId) => ({
          kind: "automation",
          areaId,
          automationId,
          via: "area",
        }),
      });
    }
  } else if (grouping === "scenes" && view.kind === "scene") {
    levels.push({
      id: "scene",
      value: view.sceneId,
      options: topology.scenes.map((s) => ({
        value: s.entity_id,
        label: s.name,
      })),
      select: (sceneId) => ({ kind: "scene", areaId: "", sceneId, via: "scenes" }),
    });
  } else if (grouping === "automations" && view.kind === "automation") {
    levels.push({
      id: "automation",
      value: view.automationId,
      options: topology.automations.map((a) => ({
        value: a.entity_id,
        label: a.name,
      })),
      select: (automationId) => ({
        kind: "automation",
        areaId: "",
        automationId,
        via: "automations",
      }),
    });
  }

  return levels;
}
