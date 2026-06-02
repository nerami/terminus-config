# HA Config Repo

Source-of-truth for HA Green at home. Edit here → commit `git@github.com:nerami/home-assistant.git` → deploy on device.

## Location

- Costa Rica, UTC-6, no DST.
- ~10°N. Sunrise/sunset ~05:30/~17:50 year-round (~30 min swing). Twilight ~25 min — dark arrives fast.
- Wet May–Nov (cloudy afternoons → low indoor light pre-sunset). Dry Dec–Apr (bright through evening).
- **Auto rule**: sun triggers stable here (no high-latitude drift). Illuminance triggers still win wet season — clouds decouple indoor light from elevation. No DST → fixed-time schedules need no compensation.
- Verify `Settings → System → General` lat/long — every sun trigger derives from it.

## Target

- Device: HA Green. Hostname: `terminus.tanuki-mirzam.ts.net` (Tailscale MagicDNS).
- **Network split**:
  - Tailscale Funnel exposes frontend `:443` to public internet (HTTPS only, 443/8443/10000).
  - SSH NOT on Funnel. Tailnet-only, peer-to-peer 100.x.
- SSH: `root@terminus.tanuki-mirzam.ts.net -p 22222`. Add-on: **Advanced SSH & Web Terminal** (Frenck). Has `jq`, `python3`, `curl`, full Alpine apk. Key-auth + command-mode (`ssh root@host 'cmd'`).
- Local env (assume defined, do not re-verify):
  - `HASS_SERVER=https://terminus.tanuki-mirzam.ts.net`
  - `HASS_TOKEN=<long-lived>` — mirrors `secrets.yaml: ha_long_lived_token`. New tokens → `https://terminus.tanuki-mirzam.ts.net/profile/security`.
- `hass-cli` installed locally, auto-reads env. Prefer over raw curl. Common: `hass-cli state list|get`, `service call <domain>.<service>`, `template '{{ ... }}'`.
- HA Core: **2026.5.4** (`ssh root@... 'cat /config/.HA_VERSION'`).
- Deploy: `ha-deploy` on device (see [Deploy](#deploy)).
- **Two CLIs — do not confuse**: `hass-cli` = local laptop, REST via `HASS_TOKEN`. `ha` = on-device, Supervisor token, for add-ons/backups/OS, SSH only.
- **`ha` CLI — use current subcommands** (HA OS 2026.x): canonical is `ha apps` (plural). Aliases `app/addon/addons` still work but noisy. Subcommands: `install|start|stop|restart|rebuild|uninstall|info|logs <slug>`. No `list`/`reload` on `ha apps` — use `ha supervisor reload` to refresh after syncing local add-ons.

### Remote ops decision tree

- **Device shell / file access** (e.g. `.storage/`): SSH via Tailnet. Funnel won't carry it.
- **Entity state / service / template / registry**: `hass-cli` first. Fallback REST over Funnel: `/api/states`, `/api/services/<domain>/<service>`, `/api/template` (POST Jinja), `/api/websocket` (e.g. `config/device_registry/list`).
- **device_id → entity_id**: `hass-cli template '{{ device_entities("<id>") }}'` or REST `/api/template`. Skips SSH.

## Installed Integrations

Refresh: `hass-cli integration list`.

| Domain | Title |
|---|---|
| sun | Sun |
| hassio | Supervisor |
| go2rtc | go2rtc |
| backup | Backup |
| homeassistant_green | Home Assistant Green |
| shopping_list | Shopping list |
| google_translate | Google Translate TTS |
| met | Home |
| dlna_dmr | La Samsung |
| tuya | nerami.h@gmail.com |
| mobile_app | Norman's iPhone ++ |
| cast | Google Cast |
| samsungtv | La Samsung (UN43DU7000PXPA) |
| smartthings | My home |
| cloud | Home Assistant Cloud |
| group | Sockets |
| playstation_network | nerami_h |
| ps4 | PlayStation 4 |
| mobile_app | Norman's iPad |
| anthropic | Claude |
| mcp_server | Assist |
| mobile_app | Nanis' iPhone |
| local_calendar | Reminders |
| telegram_bot | Terminus |

## Installed Add-ons

Refresh: `ha apps info <slug>` (SSH, Supervisor). Canonical: `ha apps` — `addon`/`addons` are aliases.

| Slug | Name | Version |
|---|---|---|
| a0d7b954_vscode | Studio Code Server | 6.0.1 |
| a0d7b954_tailscale | Tailscale | 0.28.1 |
| a0d7b954_ssh | Advanced SSH & Web Terminal | 23.0.9 |
| local_terminus_copilot | Terminus Copilot | 0.1.0 |

Local add-ons live in `addons/<dir>/` in this repo. Sync to `/addons/`
on device via `bin/deploy-addons.sh` (called by `bin/deploy.sh` when
the pull diff touches `addons/`; or directly via `bin/deploy-addons-ssh.sh`
for addon-only pushes). Source changes need `ha app rebuild local_<slug>`
on device after sync.

## Repo Layout

```
configuration.yaml         # enables packages/, includes, base
automations.yaml           # UI write target — hand-managed lives in packages/
scripts.yaml               # UI write target — same
scenes.yaml                # UI write target — same
secrets.yaml.example       # schema only; real secrets.yaml lives on device
packages/                  # source-of-truth for hand-written work
blueprints/                # automation/script blueprints
addons/                    # local Supervisor add-ons (synced to /addons/)
terminus/                  # custom HA panel — own CLAUDE.md
bin/                       # deploy.sh, deploy-ssh.sh, deploy-addons*.sh
# themes/, custom_components/, dashboards/, www/ — absent, create when needed
```

**All hand-written automation / script / scene / template / sensor work → `packages/<area>.yaml`.** One file per room/feature. One package can declare any mix of top-level domains (`automation:`, `scene:`, `script:`, `template:`, `sensor:`) — single reviewable diff per feature.

`automations.yaml` / `scripts.yaml` / `scenes.yaml` stay empty (`[]` / `{}`) so HA UI editor has somewhere to write. **UI-editing a package-managed entity writes a duplicate id into root file** — undefined precedence. Pick one source per entity:

- UI-managed → leave in root file.
- Repo-managed → edit package YAML, never touch via UI.

### Packages on disk

| File | Scope |
|---|---|
| `illuminance.yaml` | Lux sensor + derived helpers |
| `light_sensing.yaml` | Sun/illuminance-driven light autos |
| `living_room.yaml` | LR scenes + autos |
| `master_bedroom.yaml` | MB scenes + autos |
| `night_walk.yaml` | Hall/bath low-light walk autos |
| `notifications.yaml` | Telegram + persistent_notification (calendar reminder) |
| `presence.yaml` | `group.family_trackers` + presence autos |
| `schedule.yaml` | Fixed-time schedules |

## Conventions

- **Entity IDs**: snake_case with short area prefix matching live device (`light.mb_led_one`, `switch.lr_lamp`, `scene.lr_dim`). Aliases: MB = Master Bedroom (`mb_*`), LR = Living Room (`lr_*`), Abi/Abril = `abi_*`. Exceptions exist (e.g. `scene.bluish`/`scene.redish` are MB scenes with bare slugs — friendly name "MB: Bluish" lies). Grep repo + verify with `hass-cli state get <id>` before referencing a new slug.
- **Friendly names**: title case. Area prefix only on collision (`Living` fine; `MB: Led One` fine — two bedrooms could each have "Led One").
- **YAML**: 2-space indent, no tabs. Quote only when needed (templates, leading `!`, colons).
- **Templates**: Jinja with explicit `is defined` / `is not none` guards — HA returns `unknown`/`unavailable` strings, not `None`.
- **Automations**: every one needs stable `id:` — traces + UI history survive renames.

## Secrets

- Never commit `secrets.yaml` — device-only.
- Reference via `!secret <key>`.
- Track schema in `secrets.yaml.example` (keys + empty values) so fresh clone knows what to fill.
- Tokens, MQTT pw, Z-Wave/Zigbee keys → secrets only.

## Validation

Run before every commit touching HA YAML:

```bash
docker run --rm -v "$PWD":/config ghcr.io/home-assistant/home-assistant:stable \
  python -m homeassistant --script check_config -c /config
```

No CI yet — local docker check is the only gate before push.

## Deploy

On-device script: [`bin/deploy.sh`](bin/deploy.sh). Runs on terminus via Advanced SSH. Steps:

1. `ha backup new --name pre-deploy-<ts>` — bails if backup fails (no pull).
2. `git fetch` + `git pull --ff-only` — refuses merges + dirty trees.
3. `ha core check`. On fail → prompts: `git reset --hard` back to pre-pull SHA (HA keeps running old in-memory config) OR restore snapshot.
4. Prompts before `ha core restart` — passing check ≠ forced downtime.

Laptop wrapper: [`bin/deploy-ssh.sh`](bin/deploy-ssh.sh). One-shot SSH into terminus and runs `./bin/deploy.sh`. Allocates TTY (`ssh -t`) so prompts/colors work. Defaults `root@terminus.tanuki-mirzam.ts.net:22222`; override via `HA_SSH_HOST` / `HA_SSH_PORT`.

Workflow:

```bash
# local
git push
bin/deploy-ssh.sh   # SSH in, run deploy.sh, answer prompts live
```

Alt (already on device, e.g. via SSH add-on web shell):

```bash
ha-deploy   # zsh fn in SSH add-on shell → /config/bin/deploy.sh
```

Never ad-hoc `git pull` / `ha core restart` on device — always go through `deploy.sh` (via wrapper or `ha-deploy`) so snapshot+check+rollback fires.

## Do Not Touch

- `.storage/` — internal state. Commit = corruption.
- `home-assistant_v2.db*`, `*.log*`, `tts/`, `deps/` — runtime artifacts.
- `.HA_VERSION`, `.uuid` — device-specific.
- `known_devices.yaml`, `ip_bans.yaml` — runtime-populated, leaks PII.

All in `.gitignore`.

## MCP

`.mcp.json` wires HA MCP server. Claude reads live entity state during edits — verify entity IDs exist before referencing in new YAML. Token should be read-only; promote only for intentional service-call use.

## Working Style

- Small per-feature commits. Conventional Commits (`feat:`, `fix:`, `chore:`).
- Don't rewrite `automations.yaml` wholesale — diff churn hides intent. Use `packages/`.
- After deploy, check `Settings → System → Logs` even on passing `check_config` — some integrations only fail at runtime.
