# Abi — Automations

Source: [`packages/abi.yaml`](../../packages/abi.yaml)

## Abi: Auto Scene

Same pattern as Kitchen's Auto Scene, applied to `light.abi_led_one` /
`light.abi_led_two`. `binary_sensor.abi_is_dark` (defined in
[`light_sensing.yaml`](../../packages/light_sensing.yaml)) computes its own
hysteresis via the shared
[`lux_is_dark` macro](README.md#shared-is_dark-macro), fed MB's lux sensor
as input since Abi has no illuminance sensor of its own.

Instance of the [Auto Scene blueprint](README.md#auto-scene-blueprint),
with `tv_players` left empty (Abi has no TV) — `packages/abi.yaml` only
supplies inputs, not the automation logic.

```mermaid
flowchart TD
    T1["trigger: light.abi_led_one / light.abi_led_two off→on"]
    T2["trigger: binary_sensor.abi_is_dark (any change)"]
    T1 --> C
    T2 --> C
    C{"abi_led_one on OR abi_led_two on?"}
    C -- no --> X["stop"]
    C -- yes --> D["delay 3s"]
    D --> S{"binary_sensor.abi_is_dark"}
    S -- on --> DIM["scene.turn_on scene.abi_dim"]
    S -- off --> DAY["scene.turn_on scene.abi_day_light"]
```

### Caveats / recommendations

- **`binary_sensor.abi_is_dark` computes its own state from MB's lux
  reading — it's not an independent measurement.** Same coupling caveat as
  [Kitchen's sensor sharing LR's lux input](kitchen.md#kitchen-auto-scene).
  Abi's actual light level isn't measured; a future dedicated Abi lux
  sensor is a one-line change to the macro call's first argument in
  `light_sensing.yaml`.
- **`light.abi_pixoo_light` is intentionally excluded** from both this
  automation and the Abi scenes — it only supports `brightness` (no
  `color_temp`/`hs_color`), so it can't represent Day Light / Dim / Redish /
  Bluish the way the two LED lights can. If Abi's Pixoo panel should track
  ambient brightness too, it needs separate handling (e.g. a
  brightness-only companion action), not inclusion in these scenes.
- **No TV Scene equivalent** — Abi has no `media_player`.
- Same 3s-delay / undebounced-`is_dark` notes as
  [`LR: Auto Scene`](living_room.md#lr-auto-scene) apply here.
