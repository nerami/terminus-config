# Kitchen — Automations

Source: [`packages/kitchen.yaml`](../../packages/kitchen.yaml)

## Kitchen: Auto Scene

Applies Day Light or Dim when a Kitchen light turns on, or when ambient
light crosses the `is_dark` hysteresis band. Kitchen has no illuminance
sensor of its own, so `binary_sensor.kitchen_is_dark` (defined in
[`light_sensing.yaml`](../../packages/light_sensing.yaml)) is a template
alias of LR's `binary_sensor.lr_is_dark` — see caveats.

Instance of the [Auto Scene blueprint](README.md#auto-scene-blueprint),
with `tv_players` left empty (Kitchen has no TV) — `packages/kitchen.yaml`
only supplies inputs, not the automation logic.

```mermaid
flowchart TD
    T1["trigger: kitchen_lobby / kitchen_counter / kitchen_led_one / kitchen_led_two off→on"]
    T2["trigger: binary_sensor.kitchen_is_dark (any change)"]
    T1 --> C
    T2 --> C
    C{"any kitchen light on?"}
    C -- no --> X["stop"]
    C -- yes --> D["delay 3s"]
    D --> S{"binary_sensor.kitchen_is_dark"}
    S -- on --> DIM["scene.turn_on scene.kitchen_dim"]
    S -- off --> DAY["scene.turn_on scene.kitchen_day_light"]
```

### Caveats / recommendations

- **`binary_sensor.kitchen_is_dark` is a named alias, not an independent
  reading.** It's a template binary_sensor in `light_sensing.yaml` that
  mirrors `binary_sensor.lr_is_dark` 1:1 (including `unavailable`/`unknown`
  via its `availability` template) — Kitchen still has no illuminance
  sensor of its own. The alias exists to give automations/docs a
  Kitchen-named entity to depend on instead of reaching directly into LR's
  sensor, so a future dedicated Kitchen lux sensor can be swapped in by
  editing `light_sensing.yaml` alone, without touching
  `packages/kitchen.yaml`. The underlying light-level-divergence risk is
  unchanged: if Kitchen and LR ever diverge in natural light (e.g. Kitchen
  gets direct afternoon sun that LR doesn't), the scene applied to Kitchen
  still reflects LR's actual light level.
- **No TV Scene equivalent** — Kitchen has no `media_player`, so there's no
  Redish-on-TV-on automation here, unlike LR/MB.
- Same 3s-delay / undebounced-`is_dark` notes as
  [`LR: Auto Scene`](living_room.md#lr-auto-scene) apply here.
