# terminus-config

Source-of-truth for **Home Assistant Green** at home (Costa Rica, UTC-6).
Edit here → commit → deploy on device.

- **Device:** HA Green, `terminus.tanuki-mirzam.ts.net` (Tailscale MagicDNS), HA Core **2026.x**.
- **Hand-written config** lives in `packages/<area>.yaml`. Root `automations.yaml` / `scripts.yaml` / `scenes.yaml` are UI write targets only.
- **Deploy:** `bin/deploy-ssh.sh` from the laptop (SSH in → backup → pull → check → restart).
- **Areas reference:** [`docs/areas.md`](docs/areas.md) — devices/entities per area, regenerate with `bin/update-areas-doc.py`. A snapshot, not source of truth — see caveat in `CLAUDE.md`.

> Full conventions, repo layout, deploy flow, and remote-ops notes are in **[`CLAUDE.md`](CLAUDE.md)**.

## HACS

[HACS](https://hacs.xyz) (Home Assistant Community Store) **is installed** — use it
to add community **custom integrations** and **Lovelace/frontend cards** that aren't
built into HA Core.

- Installed via the HACS **add-on repository** `https://github.com/hacs/addons`
  (third-party app repo), bootstrapped by the **Get HACS** add-on (since
  uninstalled — the repo stays registered for re-download/repair).
- The integration lives in `custom_components/hacs/` **on the device** and is
  **gitignored** — HACS self-updates, so it stays out of version control. Anything
  you install through HACS (`custom_components/`, `www/community/`) likewise lives
  on-device and is **not** tracked here.
- Browse/install from the **HACS** sidebar panel in the UI. Self-updates surface
  under *Settings → Updates* (`update.hacs_update`).

**Rule of thumb:** need a component HA Core doesn't ship? Check HACS before
hand-rolling YAML. The result is managed through the UI, not this repo.
