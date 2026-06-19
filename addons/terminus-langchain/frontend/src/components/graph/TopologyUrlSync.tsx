import { useAtom } from "jotai";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";

import {
  graphPanelOpenAtom,
  graphViewAtom,
  viewKey,
  type GraphView,
} from "@/lib/ha-graph/atoms";

/**
 * Derive a `GraphView` from the topology query params. The view kind is implied
 * by which ids are present: scene/automation require an area for breadcrumbs.
 */
function viewFromParams(
  area: string | null,
  scene: string | null,
  automation: string | null,
): GraphView {
  if (scene && area) return { kind: "scene", areaId: area, sceneId: scene };
  if (automation && area)
    return { kind: "automation", areaId: area, automationId: automation };
  if (area) return { kind: "area", areaId: area };
  return { kind: "areas" };
}

/**
 * Keeps the Home Topology panel state in the URL query string so it survives
 * refresh / new-tab / back-forward. The URL is the source of truth: it hydrates
 * the Jotai atoms (`graphPanelOpenAtom`, `graphViewAtom`) on mount and on
 * back/forward, and atom changes (toolbar/canvas/breadcrumbs) are mirrored back.
 *
 * Both directions are gated by equality checks so no-op writes are skipped — that
 * stops an update loop. The atoms->URL effect is also skipped on the very first
 * commit (`mounted` ref) so it can't clobber a deep-linked URL before the
 * URL->atoms hydration has applied. Clearing a param (writing `null`) keeps
 * closed-panel URLs clean.
 *
 * Renders nothing; mount it once inside the chat tree.
 */
export function TopologyUrlSync(): null {
  const [open, setOpenParam] = useQueryState(
    "topology",
    parseAsBoolean.withDefault(false),
  );
  const [area, setArea] = useQueryState("area", parseAsString);
  const [scene, setScene] = useQueryState("scene", parseAsString);
  const [automation, setAutomation] = useQueryState("automation", parseAsString);

  const [panelOpen, setPanelOpen] = useAtom(graphPanelOpenAtom);
  const [view, setView] = useAtom(graphViewAtom);

  // URL -> atoms (mount/deep-link restore + back/forward navigation).
  useEffect(() => {
    if (panelOpen !== open) setPanelOpen(open);
    const next = viewFromParams(area, scene, automation);
    if (viewKey(next) !== viewKey(view)) setView(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, area, scene, automation]);

  // atoms -> URL (toolbar open/close, canvas drill-down, breadcrumbs). Skipped
  // on the first commit so it never overwrites the incoming URL before hydration.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) return;
    const wantArea = panelOpen && "areaId" in view ? view.areaId : null;
    const wantScene = panelOpen && view.kind === "scene" ? view.sceneId : null;
    const wantAuto =
      panelOpen && view.kind === "automation" ? view.automationId : null;
    if (open !== panelOpen) setOpenParam(panelOpen || null);
    if (area !== wantArea) setArea(wantArea);
    if (scene !== wantScene) setScene(wantScene);
    if (automation !== wantAuto) setAutomation(wantAuto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen, view]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return null;
}
