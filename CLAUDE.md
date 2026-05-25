# Home Assistant Config Repo

Source of truth for the Home Assistant Green at home. Edits happen here in Claude Code, get committed to `git@github.com:nerami/home-assistant.git`, then deployed to the device.

## Location

- Country: Costa Rica (UTC-6, no DST)
- Latitude: ~10°N (near-equator)
- Sunrise / sunset: ~05:30 / ~17:50 year-round, only ~30 min seasonal swing
- Twilight: short (~25 min) — full dark arrives quickly after sunset
- Seasons: wet (May–Nov, cloudy afternoons → low indoor light pre-sunset) / dry (Dec–Apr, bright through evening)
- **Automation implication**: sun events (`sun: sunset`) are highly stable here, so sun-based triggers don't suffer the seasonal drift they would at higher latitudes. Illuminance-sensor triggers still win during wet season because cloud cover decouples indoor light from sun elevation. No DST means fixed-time schedules don't need seasonal compensation.
- Confirm `Settings → System → General` on the HA Green has the correct lat/long — every sun-based automation derives from it.

## Target

- Device: Home Assistant Green
- Hostname: `terminus.tanuki-mirzam.ts.net` (Tailscale MagicDNS — use as `<ha-green-api>` in all examples).
- Network access: **Tailscale Funnel** exposes the HA frontend (`https://terminus.tanuki-mirzam.ts.net`, port 443) to the **public internet**. SSH is **not** carried by Funnel — Funnel is HTTPS-only on 443/8443/10000. SSH only works from a device logged into the same Tailnet (peer-to-peer 100.x routing).
- SSH add-on: **Advanced SSH & Web Terminal** (Frenck). Ships with `jq`, `python3`, `curl`, full Alpine apk repos. Supports key-based auth and command-mode SSH (`ssh root@host 'cmd'`).
- SSH user: `root`
- SSH port: `22222` (Advanced SSH default). Requires Tailnet membership — not reachable via Funnel.
- Local env (assume always defined — do not re-verify):
  - `HASS_SERVER=https://terminus.tanuki-mirzam.ts.net`
  - `HASS_TOKEN=<long-lived access token>` (same value lives in `secrets.yaml` as `ha_long_lived_token` on the device; create new tokens at `https://terminus.tanuki-mirzam.ts.net/profile/security`)
- `hass-cli` is installed locally and auto-reads `HASS_SERVER` / `HASS_TOKEN`. Prefer it over raw `curl` for entity lookups, state reads, service calls, and template eval. Examples: `hass-cli state list`, `hass-cli state get <entity_id>`, `hass-cli service call <domain>.<service>`, `hass-cli template '{{ ... }}'`.

### Remote ops decision tree

- **Need device shell / file access (e.g. read `.storage/`)**: SSH via Tailnet only. Won't work from a non-Tailnet machine even with Funnel up.
- **Need entity state / service calls / template eval / registry dumps**: prefer `hass-cli` (already authenticated via `HASS_SERVER`/`HASS_TOKEN`); fall back to REST over Funnel HTTPS when `hass-cli` lacks the verb. Endpoints: `/api/states`, `/api/services/<domain>/<service>`, `/api/template` (POST a Jinja body), `/api/websocket` (for `config/device_registry/list` etc).
- **Need device_id → entity_id mapping**: `hass-cli template '{{ device_entities("<device_id>") }}'` or REST `/api/template` with `device_entities(...)` — bypasses SSH entirely.
- HA Core version: _TBD — fill in after first sync (see `.HA_VERSION` from device)_
- Deploy method: _TBD — Git Pull add-on / SSH / GitHub Actions (pick one, document the command here)_

## Repo Layout

```
configuration.yaml         # root; enables packages/, includes, base settings
automations.yaml           # UI write target only; hand-managed automations live in packages/
scripts.yaml               # UI write target only; hand-managed scripts live in packages/
scenes.yaml                # UI write target only; hand-managed scenes live in packages/
secrets.yaml.example       # template only; real secrets.yaml stays on the device
packages/                  # one file per feature or room — source of truth for hand-written work
blueprints/                # automation/script blueprints
themes/
custom_components/         # third-party / custom integrations
dashboards/                # lovelace yaml-mode dashboards if used
www/                       # static assets served by HA
```

**All hand-written automation / script / scene / template / sensor work lives in `packages/<area>.yaml`** — one file per room or feature. A single package file can declare multiple top-level domains (`automation:`, `scene:`, `script:`, `template:`, `sensor:`, etc.), so a feature can span trigger + scene + helper sensor in one reviewable diff.

`automations.yaml`, `scripts.yaml`, and `scenes.yaml` are kept as empty containers (`[]` or `{}`) so the HA UI editor still has a place to write new entries. **Editing a package-managed entity via the UI will write a duplicate id back into one of those root files** — undefined precedence. Pick one source per entity:

- UI-managed → leave it in the root file.
- Repo-managed → edit the package YAML directly, do not touch it via the UI.

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

The deploy script lives at [`bin/deploy.sh`](bin/deploy.sh) and is executed **on the device** (via the Advanced SSH add-on). It:

1. Snapshots HA (`ha backup new --name pre-deploy-<ts>`) — bails on backup failure before pulling.
2. `git fetch` + `git pull --ff-only` (refuses merges and dirty trees).
3. Runs `ha core check`. On failure, prompts to either `git reset --hard` back to the pre-pull SHA (HA stays running with old in-memory config) or restore from the snapshot.
4. Prompts before `ha core restart` so a passing check doesn't force downtime.

Workflow:

```bash
# 1. Locally: commit + push
git push

# 2. On the device (SSH in via Tailnet, port 22222)
ha-deploy   # zsh function in the SSH add-on's shell — already points at /config/bin/deploy.sh, no sourcing needed
```

Do not invoke `git pull` / `ha core restart` ad-hoc on the device — always go through `ha-deploy` so the snapshot + check + rollback path is exercised.

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
