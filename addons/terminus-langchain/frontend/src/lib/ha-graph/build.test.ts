import { describe, expect, it } from "vitest";

import {
  automationHasStructure,
  buildAreaGraph,
  buildAreasGraph,
  buildAutomationGraph,
} from "./build";
import type { AutomationDetail, HaAutomation, Topology } from "./types";

const topology: Topology = {
  areas: [{ area_id: "living", name: "Living Room" }],
  entities: [
    {
      entity_id: "light.lamp",
      name: "Lamp",
      domain: "light",
      area_id: "living",
      device_id: null,
      device_name: null,
    },
  ],
  scenes: [
    {
      entity_id: "scene.movie",
      name: "Movie",
      area_id: "living",
      entities: ["light.lamp"],
    },
  ],
  automations: [
    {
      entity_id: "automation.night",
      name: "Night",
      area_id: "living",
      numeric_id: "1",
      references: { entities: ["light.lamp"], scenes: ["scene.movie"], devices: [] },
    },
  ],
};

describe("buildAreasGraph", () => {
  it("creates one node per area with counts", () => {
    const { nodes, edges } = buildAreasGraph(topology);
    expect(edges).toHaveLength(0);
    const living = nodes.find((n) => n.id === "area:living");
    expect(living?.data.kind).toBe("area");
    expect(living?.data.sublabel).toContain("1 entities");
  });

  it("adds an Unassigned area when items have no area", () => {
    const t: Topology = {
      ...topology,
      entities: [
        { ...topology.entities[0], area_id: null },
      ],
    };
    const { nodes } = buildAreasGraph(t);
    expect(nodes.some((n) => n.data.label === "Unassigned")).toBe(true);
  });
});

describe("buildAreaGraph", () => {
  it("links scenes and automations to the entities they use", () => {
    const { nodes, edges } = buildAreaGraph(topology, "living");

    // three group headers + entity + scene + automation
    expect(nodes.filter((n) => n.data.kind === "group")).toHaveLength(3);

    const ids = edges.map((e) => `${e.source}->${e.target}`);
    expect(ids).toContain("scene.movie->light.lamp");
    expect(ids).toContain("automation.night->light.lamp");
    expect(ids).toContain("automation.night->scene.movie");
  });

  it("rotates the triangle left: automations & entities share the left column, scenes is right-centered", () => {
    const { nodes } = buildAreaGraph(topology, "living");
    const aut = nodes.find((n) => n.id === "group:automations")!;
    const ent = nodes.find((n) => n.id === "group:entities")!;
    const scn = nodes.find((n) => n.id === "group:scenes")!;

    // Automations (top) and Entities (bottom) are aligned on the same left x.
    expect(aut.position.x).toBe(ent.position.x);
    // Scenes sits to the right of that left column.
    expect(scn.position.x).toBeGreaterThan(aut.position.x);
    // Scenes is vertically centered between automations and entities.
    expect(scn.position.y).toBeGreaterThan(aut.position.y);
    expect(scn.position.y).toBeLessThan(ent.position.y);
  });
});

describe("buildAutomationGraph", () => {
  it("parses trigger/condition/action structure into a flow graph", () => {
    const automation: HaAutomation = topology.automations[0];
    const detail: AutomationDetail = {
      config: {
        trigger: [{ platform: "state", entity_id: "binary_sensor.door" }],
        condition: [{ condition: "state", entity_id: "input_boolean.home" }],
        action: [
          { service: "light.turn_on", target: { entity_id: "light.lamp" } },
        ],
      },
      referenced: { entities: [], scenes: [], devices: [] },
    };

    const { nodes, edges } = buildAutomationGraph(topology, automation, detail);

    // Node ids are the exact HA trace paths (runtime-ready).
    expect(nodes.some((n) => n.id === "trigger/0")).toBe(true);
    expect(nodes.some((n) => n.id === "condition/0")).toBe(true);
    expect(nodes.some((n) => n.id === "action/0")).toBe(true);
    // the action links to the entity it controls (relationship leaf)
    expect(
      edges.some((e) => e.source === "action/0" && e.target === "light.lamp"),
    ).toBe(true);
    // trigger feeds the automation root
    expect(
      edges.some(
        (e) => e.source === "trigger/0" && e.target === "automation.night",
      ),
    ).toBe(true);
    // the gating flow: root -> condition -> action
    expect(
      edges.some(
        (e) => e.source === "automation.night" && e.target === "condition/0",
      ),
    ).toBe(true);
    expect(
      edges.some((e) => e.source === "condition/0" && e.target === "action/0"),
    ).toBe(true);
  });

  it("detects whether an automation has a parsable structure", () => {
    expect(
      automationHasStructure({
        config: { trigger: [], action: [] },
        referenced: { entities: [], scenes: [], devices: [] },
      }),
    ).toBe(true);
    // Empty config => never run / not editable => no structure (show hint).
    expect(
      automationHasStructure({
        config: {},
        referenced: { entities: ["light.lamp"], scenes: [], devices: [] },
      }),
    ).toBe(false);
  });

  it("falls back to referenced ids when config is empty", () => {
    const automation: HaAutomation = topology.automations[0];
    const detail: AutomationDetail = {
      config: {},
      referenced: { entities: ["light.lamp"], scenes: ["scene.movie"], devices: [] },
    };
    const { edges } = buildAutomationGraph(topology, automation, detail);
    const ids = edges.map((e) => `${e.source}->${e.target}`);
    expect(ids).toContain("automation.night->light.lamp");
    expect(ids).toContain("automation.night->scene.movie");
  });
});
