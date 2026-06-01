import { describe, expect, it } from "vitest"
import { inferArea } from "./area"

describe("inferArea", () => {
  it.each([
    ["light.mb_led_one", "mb"],
    ["switch.lr_lamp", "lr"],
    ["scene.lr_dim", "lr"],
    ["light.abi_ceiling", "abi"],
    ["sensor.light_sensor_samsung_illuminance", "common"],
    ["binary_sensor.is_dark", "common"],
    ["sun.sun", "common"],
    ["bluish", "common"],
    ["mb_bluish", "mb"],
  ])("maps %s -> %s", (input, expected) => {
    expect(inferArea(input)).toBe(expected)
  })
})
