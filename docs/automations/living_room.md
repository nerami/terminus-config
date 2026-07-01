# Living Room — Automations

Source: [`packages/living_room.yaml`](../../packages/living_room.yaml)

## LR: Auto Scene

Applies Bright or Dim when an LR light turns on, or when ambient light
crosses the `is_dark` hysteresis band — but only while the TV isn't playing,
so `LR: TV Scene` keeps control during playback.

Instance of the [Auto Scene blueprint](README.md#auto-scene-blueprint) —
`packages/living_room.yaml` only supplies inputs, not the automation logic.

```mermaid
flowchart TD
    T1["trigger: light.lr_living / light.lr_dining off→on"]
    T2["trigger: binary_sensor.lr_is_dark (any change)"]
    T1 --> C
    T2 --> C
    C{"lr_living on OR lr_dining on\nAND NOT (lr_tv playing OR lr_tv_hub_cast playing)"}
    C -- no --> X["stop"]
    C -- yes --> D["delay 3s"]
    D --> S{"binary_sensor.lr_is_dark"}
    S -- on --> DIM["scene.turn_on scene.lr_dim"]
    S -- off --> DAY["scene.turn_on scene.lr_bright"]
```

### Caveats

- **The 3s delay is now a named, configurable blueprint input** (`delay` in
  [`terminus/auto_scene.yaml`](../../blueprints/automation/terminus/auto_scene.yaml)),
  not a bare hardcoded number — but it's still a race-avoidance wait, not a
  true debounce: if `is_dark` flips again inside that window, the scene
  applied may not match the sensor's final state. No visible symptoms
  currently, but worth knowing if scene mismatches with reality are ever
  reported.
- **`is_dark` has no built-in debounce** on this trigger (unlike
  [`illuminance.yaml`](illuminance.md)'s `for: 10s`), so brief lux flicker
  during transitional weather can cause the scene to reapply more often than
  necessary. Harmless (scene.turn_on is idempotent) but worth knowing if
  automation traces look noisy.

## LR: TV Scene

Applies Redish when the TV turns on, or Dim when it turns off for 30s —
only between sunset and sunrise, no other time restriction.

Instance of the [TV Scene blueprint](README.md#tv-scene-blueprint) —
`packages/living_room.yaml` only supplies inputs, not the automation logic.

```mermaid
flowchart TD
    T1["trigger: lr_tv / lr_tv_hub_cast off→(anything but unavailable/unknown) [tv_on]"]
    T2["trigger: lr_tv / lr_tv_hub_cast (not from unavailable/unknown)→off for 30s [tv_off]"]
    T1 --> C
    T2 --> C
    C{"sun: after sunset, before sunrise?"}
    C -- no --> X["stop"]
    C -- yes --> W{"which trigger?"}
    W -- tv_on --> RED["scene.turn_on scene.lr_redish"]
    W -- tv_off --> DIM["scene.turn_on scene.lr_dim"]
```

### Caveats

- **Daytime TV on/off never changes the scene** — by design (LR: Auto Scene
  handles daytime light instead), but worth remembering when testing during
  the day: nothing will visibly happen.
