# Self-hosted Langfuse for Terminus tracing

Runs the Langfuse v3 stack **on your laptop** to receive traces from the
Terminus add-on on HA Green. The add-on POSTs traces to `langfuse-web:3000`
over the LAN; everything else stays bound to `127.0.0.1`.

This is laptop/ops tooling — it is **not** part of the add-on Docker image (it
lives outside the `backend/` and `frontend/` paths the Dockerfile copies).

## Prerequisites

- Docker + Docker Compose on the laptop.
- The laptop and HA Green on the **same LAN** (the add-on's Docker bridge can't
  reach Tailscale `100.x` peers — LAN IP only). Laptop LAN IP: `192.168.100.176`.
- Ideally a DHCP reservation for that IP so it doesn't drift.

## 1. Configure secrets

```bash
cd addons/terminus/observability/langfuse
cp .env.example .env
# fill .env — generation commands are in the file comments
```

> **Set the datastore passwords ONCE, before the first `docker compose up`.**
> Postgres (and ClickHouse/MinIO) only apply their `*_PASSWORD` when they
> initialize an *empty* data volume on first boot. If you change a password in
> `.env` afterward, the datastore keeps the **old** one while the app connects
> with the **new** one → `Authentication failed against database server`. To
> change a password later you must re-init the volumes — see
> [Troubleshooting](#troubleshooting).

## 2. Start the stack

```bash
docker compose up -d
docker compose ps          # wait for all services healthy
```

First boot runs DB migrations; give it a minute. The UI is at
<http://localhost:63742> — create an account + project, then copy the project's
**public** (`pk-lf-…`) and **secret** (`sk-lf-…`) keys.

## 3. Confirm the add-on can reach it (the decisive test)

From the Green's SSH add-on shell (same Docker-bridge limitation as Terminus,
so it's a valid proxy):

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://192.168.100.176:63742
# 200/3xx → reachable. hang/timeout → not on the same LAN; tracing won't work.
```

## 4. Point the add-on at it

In the Terminus add-on **Configuration** tab (available since add-on `0.16.0`),
set the options, then **Restart** the add-on — options are read when the agent
graph is built and cached for the process lifetime, so a restart is required
(no rebuild needed):

```yaml
langfuse_tracing: true
langfuse_base_url: http://192.168.100.176:63742   # MUST be a private-LAN address
langfuse_public_key: pk-lf-...
langfuse_secret_key: sk-lf-...
```

`langfuse_base_url` must resolve to a private-LAN / loopback IP — the add-on's
`should_trace` gate is fail-closed and **refuses public hosts** (a non-RFC1918
IP or any hostname) so prompts + HA state never leave the network. That refusal
is the whole point of self-hosting instead of using Langfuse Cloud.

## 5. Verify tracing works

After the restart, check the add-on log (`ha apps logs local_terminus`, or the
add-on **Log** tab). When the gate passes you'll see:

```
Langfuse tracing enabled → http://192.168.100.176:63742
```

Then send a message in the Terminus chat (e.g. "what version of Home Assistant
is this?") and open <http://localhost:63742> → **Tracing → Traces**. A new trace
with the LLM call and any tool calls should appear within a few seconds.

If nothing appears, the gate likely refused the config — the log says why
(see [Troubleshooting](#troubleshooting)). The fail-closed behavior is
deliberate and worth confirming:

- **Public host** (`langfuse_base_url: https://cloud.langfuse.com`) → log warns
  `… is not a private-LAN address; tracing disabled`, and **no traces leave**.
- **Incomplete config** (e.g. blank secret key) → log warns
  `credentials/host are incomplete; tracing disabled`.
- **Sink down** (this stack stopped) → the add-on drops traces in a background
  thread; the agent **never blocks or slows**.

## Troubleshooting

**`Authentication failed against database server … credentials for 'postgres'
are not valid`** (langfuse-web crash-loops, langfuse-worker errors). The
postgres data volume was initialized with a different password than `.env`
currently holds — usually because a datastore password was changed *after* the
first boot (see the caution in [step 1](#1-configure-secrets)). Since this
stack holds only traces (no source of truth), the fix is to wipe the datastore
volumes and re-init so every datastore picks up the current `.env`:

```bash
docker compose down -v     # removes containers AND named volumes — discards all traces
docker compose up -d
docker compose ps          # all 6 healthy after migrations (~1 min)
```

> **Debugging tip:** don't "verify" the password with
> `psql -h 127.0.0.1 -U postgres` *inside* the postgres container — the bundled
> `pg_hba.conf` maps `127.0.0.1` to **trust** auth, so it accepts *any*
> password (a false positive). Test over the service name, which uses
> `scram-sha-256` like the app does:
> `docker compose exec postgres psql -h postgres -U postgres -c 'select 1'`.

**`langfuse not installed; tracing requested but disabled`** in the add-on log —
the `langfuse` Python dep is missing from the image; rebuild the add-on so the
new dependency layer installs.

## Operating notes

- **Laptop-only by design.** Tracing only captures while this stack is up.
  When it's down the add-on drops traces in a background thread — the agent is
  never blocked or slowed.
- **Turn it on to debug, off otherwise** (flip `langfuse_tracing`). No reason
  to leave six containers running on the laptop full time.
- **Never expose `:63742` to the public internet** (no Tailscale Funnel) — it
  holds your prompts and HA state. LAN/tailnet-only.
- Image tags are pinned to the v3 major / datastore majors; bump deliberately.
