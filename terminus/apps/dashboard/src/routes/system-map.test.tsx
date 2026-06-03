import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { SystemMap } from "./system-map"
import type { Manifest } from "@/types/manifest"
import { LiveStateProvider } from "@/lib/live-state"

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
    {
      id: "light.lr_lamp",
      kind: "entity",
      label: "light.lr_lamp",
      area: "lr",
      source: { file: "packages/sample.yaml", line: 10 },
      position: { x: 200, y: 0 },
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
  afterEach(() => cleanup())

  it("renders automation node label from manifest", async () => {
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} onSelect={() => {}} />
      </LiveStateProvider>
    )
    expect(await screen.findByText("MB: Lamp on when dark")).toBeTruthy()
  })

  it("calls onSelect for non-automation node clicks", async () => {
    const onSelect = vi.fn()
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} onSelect={onSelect} />
      </LiveStateProvider>
    )
    const entityLabel = await screen.findByText("light.lr_lamp")
    fireEvent.click(entityLabel)
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0].id).toBe("light.lr_lamp")
  })

  it("does NOT call onSelect for automation node clicks (handled by drill-in)", async () => {
    const onSelect = vi.fn()
    render(
      <LiveStateProvider>
        <SystemMap manifest={manifest} onSelect={onSelect} />
      </LiveStateProvider>
    )
    const autoLabel = await screen.findByText("MB: Lamp on when dark")
    fireEvent.click(autoLabel)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
