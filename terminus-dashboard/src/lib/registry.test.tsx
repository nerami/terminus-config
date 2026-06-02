import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import { RegistryProvider, useRegistryEntry, useRegistryStatus } from "./registry"
import entityFixture from "../../__fixtures__/registry/entity.json"
import areaFixture from "../../__fixtures__/registry/area.json"
import labelFixture from "../../__fixtures__/registry/label.json"
import exposureFixture from "../../__fixtures__/registry/exposure.json"

const sendMessagePromise = vi.fn()
const fakeConn = { sendMessagePromise, close: vi.fn() }

vi.mock("@/lib/ha", () => ({
  connectHA: () => Promise.resolve(fakeConn),
  watchEntities: () => () => {},
}))

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  sendMessagePromise.mockReset()
  sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
    if (msg.type === "config/entity_registry/list") return entityFixture
    if (msg.type === "config/area_registry/list") return areaFixture
    if (msg.type === "config/label_registry/list") return labelFixture
    if (msg.type === "homeassistant/expose_entity/list") return exposureFixture
    throw new Error("unexpected message: " + msg.type)
  })
})

function StatusProbe() {
  const status = useRegistryStatus()
  return <span data-testid="status">{status}</span>
}

function EntryProbe({ id }: { id: string }) {
  const entry = useRegistryEntry(id)
  if (!entry) return <span data-testid="missing">missing</span>
  return (
    <div>
      <span data-testid="area">{entry.areaName ?? "none"}</span>
      <span data-testid="enabled">{String(entry.enabled)}</span>
      <span data-testid="visible">{String(entry.visible)}</span>
      <span data-testid="labels">{entry.labels.join(",")}</span>
      <span data-testid="exposure">{JSON.stringify(entry.exposure)}</span>
      <span data-testid="in-registry">{String(entry.inRegistry)}</span>
    </div>
  )
}

describe("RegistryProvider", () => {
  it("transitions from loading to ready and exposes merged entry", async () => {
    render(
      <RegistryProvider>
        <StatusProbe />
        <EntryProbe id="light.lr_lamp" />
      </RegistryProvider>
    )

    expect(screen.getByTestId("status").textContent).toBe("loading")

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready")
    })

    expect(screen.getByTestId("area").textContent).toBe("Living Room")
    expect(screen.getByTestId("enabled").textContent).toBe("true")
    expect(screen.getByTestId("visible").textContent).toBe("true")
    expect(screen.getByTestId("labels").textContent).toBe("Climate")
    expect(screen.getByTestId("exposure").textContent).toBe('{"conversation":true}')
    expect(screen.getByTestId("in-registry").textContent).toBe("true")
  })

  it("reflects disabled_by as enabled=false", async () => {
    render(
      <RegistryProvider>
        <EntryProbe id="switch.mb_disabled" />
      </RegistryProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId("enabled").textContent).toBe("false")
    })
  })

  it("returns inRegistry=false for entities not in registry", async () => {
    render(
      <RegistryProvider>
        <StatusProbe />
        <EntryProbe id="sensor.unknown_template" />
      </RegistryProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready")
    })
    expect(screen.getByTestId("in-registry").textContent).toBe("false")
    expect(screen.getByTestId("area").textContent).toBe("none")
    expect(screen.getByTestId("exposure").textContent).toBe("{}")
  })

  it("transitions to error when a registry call rejects", async () => {
    sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
      if (msg.type === "config/area_registry/list") throw new Error("boom")
      if (msg.type === "config/entity_registry/list") return entityFixture
      if (msg.type === "config/label_registry/list") return labelFixture
      if (msg.type === "homeassistant/expose_entity/list") return exposureFixture
      throw new Error("unexpected: " + msg.type)
    })

    render(
      <RegistryProvider>
        <StatusProbe />
      </RegistryProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("error")
    })
  })

  it("tolerates exposure call failure and stays ready with empty exposure", async () => {
    sendMessagePromise.mockImplementation(async (msg: { type: string }) => {
      if (msg.type === "homeassistant/expose_entity/list")
        throw new Error("unknown_command")
      if (msg.type === "config/entity_registry/list") return entityFixture
      if (msg.type === "config/area_registry/list") return areaFixture
      if (msg.type === "config/label_registry/list") return labelFixture
      throw new Error("unexpected: " + msg.type)
    })

    render(
      <RegistryProvider>
        <StatusProbe />
        <EntryProbe id="light.lr_lamp" />
      </RegistryProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready")
    })
    expect(screen.getByTestId("exposure").textContent).toBe("{}")
  })
})
