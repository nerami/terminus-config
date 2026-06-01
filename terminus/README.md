# my-dashboard

Custom Home Assistant frontend panel. Vite + React 19 + shadcn/ui + Tailwind v4. Built
bundle is served from `/local/my-dashboard/` and registered via `panel_custom` in the
repo-root `configuration.yaml`.

## Install

```bash
cd dashboard
pnpm install
```

## Develop

```bash
pnpm dev
```

Dev mode runs Vite outside Home Assistant, so there is no `window.hassConnection`. The
app falls back to a long-lived token from `.env`:

1. Copy the example: `cp .env.example .env`
2. Generate a long-lived access token in HA: **Profile → Security → Long-Lived Access
   Tokens → Create Token**
3. Paste the token into `VITE_HA_TOKEN`. The HA instance is reachable over Tailscale
   Funnel at `https://terminus.tanuki-mirzam.ts.net/`, so the default `VITE_HA_URL`
   already points there.

`.env` is gitignored — never commit it.

## Build & deploy

```bash
pnpm build
```

Output goes to `../www/my-dashboard/` (i.e. `<repo>/www/my-dashboard/`) so it lands at
the HA-served path automatically. Two files are emitted:

- `index.js` — the panel bundle, loaded by HA via `module_url`
- `style.css` — sibling stylesheet, injected by `index.js` on connect

After building, deploy the repo to the device (`git push` + `bin/deploy-ssh.sh`). HA
must be **restarted** or the browser cache cleared to pick up changes — `panel_custom`
registrations are read at startup.

## How it plugs into HA

`configuration.yaml` declares:

```yaml
panel_custom:
  - name: my-dashboard
    sidebar_title: My Dashboard
    sidebar_icon: mdi:view-dashboard
    url_path: my-dashboard
    module_url: /local/my-dashboard/index.js
```

The bundle defines a `<my-dashboard>` custom element, which HA instantiates inside its
frame. React mounts into that element. In production the panel reuses HA's existing
auth via `window.hassConnection`, so no token is needed in the browser.
