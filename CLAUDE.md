# Home Assistant Config Repo

Source of truth for the Home Assistant Green at home. Edits happen here in Claude Code, get committed to `git@github.com:nerami/home-assistant.git`, then deployed to the device.

## Target

- Device: Home Assistant Green
- HA Core version: _TBD — fill in after first sync (see `.HA_VERSION` from device)_
- Deploy method: _TBD — Git Pull add-on / SSH / GitHub Actions (pick one, document the command here)_

## Repo Layout

```
configuration.yaml         # root; enables packages/, includes, base settings
automations.yaml           # UI-managed automations (do not hand-edit if HA UI also writes here)
scripts.yaml
scenes.yaml
secrets.yaml.example       # template only; real secrets.yaml stays on the device
packages/                  # one file per feature or room (preferred for new work)
blueprints/                # automation/script blueprints
themes/
custom_components/         # third-party / custom integrations
dashboards/                # lovelace yaml-mode dashboards if used
www/                       # static assets served by HA
```

New automations go in `packages/<area>.yaml` rather than appending to `automations.yaml`. Keeps diffs reviewable and lets a feature span automation + script + sensor + template in one file.

## Conventions

- **Entity IDs**: snake_case, scoped by area where possible (`light.master_bedroom_led_one`, not `light.mb_led_one`). The live device currently has mixed naming (`MB: Led One` friendly-name style). When renaming, do it via the UI so HA migrates references, or grep the whole repo first.
- **Friendly names**: title case, prefix with area abbreviation only if the bare name would collide (`Living` is fine; `MB: Led One` is fine because two bedrooms could each have a "Led One").
- **YAML**: 2-space indent. No tabs. Quote strings only when needed (templates, leading `!`, colons, etc.).
- **Templates**: use Jinja `{% ... %}` with explicit `is defined` / `is not none` guards on entity states — HA returns `unknown`/`unavailable` strings, not `None`.
- **IDs on automations**: every automation must have a stable `id:` so traces and the UI don't lose history across renames.

## Secrets

- Never commit `secrets.yaml`. It lives only on the device.
- Reference via `!secret <key>` in YAML.
- Track the schema in `secrets.yaml.example` with keys + empty values so a fresh clone knows what to fill in.
- API tokens, long-lived access tokens, MQTT passwords, Z-Wave/Zigbee network keys → secrets only.

## Validation

Before committing anything that touches HA YAML:

```bash
# Local check via Docker (no HA install needed)
docker run --rm -v "$PWD":/config ghcr.io/home-assistant/home-assistant:stable \
  python -m homeassistant --script check_config -c /config
```

CI runs the same check on every push (see `.github/workflows/`). A red check blocks deploy.

## Deploy

_Fill in once method is chosen._ Sketch:

```bash
# On the HA Green (via SSH add-on)
ha backup new --name pre-deploy-$(date +%s)
cd /config && git pull --ff-only
ha core check && ha core restart
```

Always snapshot before pulling. Restart only after `ha core check` passes.

## Do Not Touch

- `.storage/` — HA's internal state. Committing it will corrupt the device.
- `home-assistant_v2.db*`, `*.log*`, `tts/`, `deps/` — runtime artifacts.
- `.HA_VERSION`, `.uuid` — device-specific.
- `known_devices.yaml`, `ip_bans.yaml` — populated at runtime, leaking PII.

All listed in `.gitignore`.

## MCP

`.mcp.json` wires up the Home Assistant MCP server. Claude can read live entity state during edits — use it to verify entity IDs exist before referencing them in new YAML. Token scope should be read-only for safety; promote only if intentional service-call use is wanted.

## Working Style

- Small commits per feature. Conventional Commits subject (`feat:`, `fix:`, `chore:`).
- Don't rewrite `automations.yaml` wholesale — diff churn hides intent. Prefer `packages/`.
- After deploying, check `Settings → System → Logs` on the device for warnings even if `check_config` passed; some integrations only fail at runtime.
