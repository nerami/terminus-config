import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { SystemMap } from "./SystemMap"
import type { Manifest } from "@/types/manifest"
import { LiveStateProvider } from "@/lib/liveState"

vi.mock("@/lib/ha", () => ({
  connectHA: () => new Promise(() => {}),
  watchEntities: () => () => {},
}))

const manifest: Manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  nodes: [
    {
      id: "auto:mb_lamp_on_dark",
      kind: "automation",
      label: "MB: Lamp on when dark",
      area: "mb",
      source: { file: "packages/sample.yaml", line: 2 },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  automations: {
    mb_lamp_on_dark: {
      id: "mb_lamp_on_dark",
      alias: "MB: Lamp on when dark",
      mode: "single",
      triggers: [],
      conditions: [],
      actions: [],
      flowNodes: [],
      flowEdges: [],
    },
  },
}

describe("SystemMap", () => {
  it("renders automation node label from manifest", async () => {
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} />
      </LiveStateProvider>
    )
    expect(await screen.findByText("MB: Lamp on when dark")).toBeTruthy()
  })
})
