import { describe, expect, it } from "vitest";

import { buildAutomationFlow, type FlowModel } from "./automation-flow";

const ROOT = "automation.test";

function ids(model: FlowModel): Set<string> {
  return new Set(model.nodes.map((n) => n.id));
}
function hasEdge(model: FlowModel, source: string, target: string): boolean {
  return model.edges.some((e) => e.source === source && e.target === target);
}
function nodeKind(model: FlowModel, id: string): string | undefined {
  return model.nodes.find((n) => n.id === id)?.kind;
}

describe("triggers + top-level conditions", () => {
  it("feeds each trigger into the root and chains conditions, then actions", () => {
    const model = buildAutomationFlow(
      {
        trigger: [
          { platform: "state", entity_id: "binary_sensor.door", to: "on" },
          { platform: "time", at: "07:00" },
        ],
        condition: [
          { condition: "state", entity_id: "input_boolean.home", state: "on" },
          { condition: "numeric_state", entity_id: "sensor.temp", below: 20 },
        ],
        action: [{ service: "light.turn_on", target: { entity_id: "light.lamp" } }],
      },
      ROOT,
    );

    expect(hasEdge(model, "trigger/0", ROOT)).toBe(true);
    expect(hasEdge(model, "trigger/1", ROOT)).toBe(true);
    // condition chain root -> 0 -> 1 -> action
    expect(hasEdge(model, ROOT, "condition/0")).toBe(true);
    expect(hasEdge(model, "condition/0", "condition/1")).toBe(true);
    expect(hasEdge(model, "condition/1", "action/0")).toBe(true);
    // condition carries its referenced entity (rendered as a leaf in build.ts)
    expect(
      model.nodes.find((n) => n.id === "condition/0")?.entities,
    ).toContain("input_boolean.home");
  });

  it("supports plural trigger/condition/action keys", () => {
    const model = buildAutomationFlow(
      {
        triggers: [{ trigger: "state", entity_id: "binary_sensor.x" }],
        conditions: [{ condition: "state", entity_id: "a.b", state: "on" }],
        actions: [{ action: "light.turn_on", target: { entity_id: "light.y" } }],
      },
      ROOT,
    );
    // path roots are always singular regardless of key spelling
    expect(ids(model).has("trigger/0")).toBe(true);
    expect(ids(model).has("condition/0")).toBe(true);
    expect(ids(model).has("action/0")).toBe(true);
  });
});

describe("compound conditions (and/or/not)", () => {
  it("nests children under <path>/conditions/<j>", () => {
    const model = buildAutomationFlow(
      {
        condition: [
          {
            condition: "and",
            conditions: [
              { condition: "state", entity_id: "a.b", state: "on" },
              {
                condition: "or",
                conditions: [
                  { condition: "state", entity_id: "c.d", state: "on" },
                  "{{ true }}",
                ],
              },
            ],
          },
        ],
        action: [],
      },
      ROOT,
    );

    expect(nodeKind(model, "condition/0")).toBe("logic");
    expect(ids(model).has("condition/0/conditions/0")).toBe(true);
    expect(nodeKind(model, "condition/0/conditions/1")).toBe("logic");
    expect(ids(model).has("condition/0/conditions/1/conditions/0")).toBe(true);
    // shorthand string template condition
    expect(nodeKind(model, "condition/0/conditions/1/conditions/1")).toBe("condition");
    // children feed their parent group
    expect(hasEdge(model, "condition/0/conditions/0", "condition/0")).toBe(true);
  });
});

describe("choose", () => {
  it("paths options' conditions/sequence and the default sibling correctly", () => {
    const model = buildAutomationFlow(
      {
        action: [
          {
            choose: [
              {
                conditions: [{ condition: "state", entity_id: "a.b", state: "on" }],
                sequence: [
                  { service: "light.turn_on", target: { entity_id: "light.lamp" } },
                  { delay: "00:00:05" },
                ],
              },
            ],
            default: [{ service: "light.turn_off", target: { entity_id: "light.lamp" } }],
          },
        ],
      },
      ROOT,
    );

    expect(nodeKind(model, "action/0")).toBe("choose");
    expect(ids(model).has("action/0/choose/0/conditions/0")).toBe(true);
    expect(ids(model).has("action/0/choose/0/sequence/0")).toBe(true);
    expect(ids(model).has("action/0/choose/0/sequence/1")).toBe(true);
    // default is a sibling of choose, not nested under it
    expect(ids(model).has("action/0/default/0")).toBe(true);
    expect(ids(model).has("action/0/choose/0/default/0")).toBe(false);
    // option 1: choose -> condition -> sequence
    expect(hasEdge(model, "action/0", "action/0/choose/0/conditions/0")).toBe(true);
    expect(
      hasEdge(model, "action/0/choose/0/conditions/0", "action/0/choose/0/sequence/0"),
    ).toBe(true);
    // delay precedence: a step with delay is a delay action, not a service call
    expect(nodeKind(model, "action/0/choose/0/sequence/1")).toBe("action");
  });
});

describe("if / then / else", () => {
  it("paths if-test, then and else", () => {
    const model = buildAutomationFlow(
      {
        action: [
          {
            if: [{ condition: "state", entity_id: "a.b", state: "on" }],
            then: [{ service: "light.turn_on", target: { entity_id: "light.lamp" } }],
            else: [{ service: "light.turn_off", target: { entity_id: "light.lamp" } }],
          },
        ],
      },
      ROOT,
    );

    expect(nodeKind(model, "action/0")).toBe("if");
    expect(ids(model).has("action/0/if/0")).toBe(true);
    expect(ids(model).has("action/0/then/0")).toBe(true);
    expect(ids(model).has("action/0/else/0")).toBe(true);
    // true path goes through the if-test condition into then
    expect(hasEdge(model, "action/0", "action/0/if/0")).toBe(true);
    expect(hasEdge(model, "action/0/if/0", "action/0/then/0")).toBe(true);
    expect(hasEdge(model, "action/0/if/0", "action/0/else/0")).toBe(true);
  });
});

describe("repeat", () => {
  it("paths the body sequence and while/until conditions, with a loop-back", () => {
    const model = buildAutomationFlow(
      {
        action: [
          {
            repeat: {
              while: [{ condition: "state", entity_id: "a.b", state: "on" }],
              sequence: [{ service: "light.toggle", target: { entity_id: "light.lamp" } }],
            },
          },
        ],
      },
      ROOT,
    );

    expect(nodeKind(model, "action/0")).toBe("repeat");
    expect(ids(model).has("action/0/repeat/while/0")).toBe(true);
    expect(ids(model).has("action/0/repeat/sequence/0")).toBe(true);
    // loop-back edge from the body to the repeat node (dashed)
    const back = model.edges.find(
      (e) => e.source === "action/0/repeat/sequence/0" && e.target === "action/0",
    );
    expect(back?.dashed).toBe(true);
  });

  it("renders the body once for a count loop", () => {
    const model = buildAutomationFlow(
      {
        action: [
          { repeat: { count: 3, sequence: [{ service: "light.toggle" }] } },
        ],
      },
      ROOT,
    );
    const bodySteps = [...ids(model)].filter((id) =>
      id.startsWith("action/0/repeat/sequence/"),
    );
    expect(bodySteps).toEqual(["action/0/repeat/sequence/0"]);
  });
});

describe("parallel", () => {
  it("paths each branch as parallel/<idx>/sequence/<i>", () => {
    const model = buildAutomationFlow(
      {
        action: [
          {
            parallel: [
              { service: "light.turn_on", target: { entity_id: "light.a" } },
              { sequence: [{ service: "light.turn_on", target: { entity_id: "light.b" } }] },
            ],
          },
        ],
      },
      ROOT,
    );

    expect(nodeKind(model, "action/0")).toBe("parallel");
    expect(ids(model).has("action/0/parallel/0/sequence/0")).toBe(true);
    expect(ids(model).has("action/0/parallel/1/sequence/0")).toBe(true);
    expect(hasEdge(model, "action/0", "action/0/parallel/0/sequence/0")).toBe(true);
    expect(hasEdge(model, "action/0", "action/0/parallel/1/sequence/0")).toBe(true);
  });

  it("handles a branch given as a raw list of steps", () => {
    const model = buildAutomationFlow(
      {
        action: [
          { parallel: [[{ service: "x.a" }, { service: "x.b" }], { service: "x.c" }] },
        ],
      },
      ROOT,
    );
    expect(ids(model).has("action/0/parallel/0/sequence/0")).toBe(true);
    expect(ids(model).has("action/0/parallel/0/sequence/1")).toBe(true);
    expect(ids(model).has("action/0/parallel/1/sequence/0")).toBe(true);
  });
});

describe("sequence + stop + inline condition", () => {
  it("paths a nested sequence block", () => {
    const model = buildAutomationFlow(
      { action: [{ sequence: [{ service: "x.y" }, { service: "x.z" }] }] },
      ROOT,
    );
    expect(nodeKind(model, "action/0")).toBe("sequence");
    expect(ids(model).has("action/0/sequence/0")).toBe(true);
    expect(ids(model).has("action/0/sequence/1")).toBe(true);
  });

  it("treats an inline condition as a gate and stop as a terminator", () => {
    const model = buildAutomationFlow(
      {
        action: [
          { condition: "state", entity_id: "a.b", state: "on" },
          { stop: "done" },
          { service: "never.reached" },
        ],
      },
      ROOT,
    );
    expect(nodeKind(model, "action/0")).toBe("condition");
    expect(nodeKind(model, "action/1")).toBe("stop");
    // stop terminates: nothing flows out of it to action/2
    expect(hasEdge(model, "action/1", "action/2")).toBe(false);
    // inline condition gates into the stop
    expect(hasEdge(model, "action/0", "action/1")).toBe(true);
  });
});

describe("action type precedence + leaf references", () => {
  it("classifies scene and service references as relationship leaves", () => {
    const model = buildAutomationFlow(
      {
        action: [
          { scene: "scene.movie" },
          { service: "scene.turn_on", target: { entity_id: "scene.away" } },
        ],
      },
      ROOT,
    );
    expect(model.nodes.find((n) => n.id === "action/0")?.scenes).toContain("scene.movie");
    expect(model.nodes.find((n) => n.id === "action/1")?.scenes).toContain("scene.away");
  });

  it("honors ACTIONS_MAP precedence (delay before service)", () => {
    const model = buildAutomationFlow(
      { action: [{ delay: "00:00:01", service: "light.turn_on" }] },
      ROOT,
    );
    expect(model.nodes.find((n) => n.id === "action/0")?.sublabel).toBe("delay");
  });
});
