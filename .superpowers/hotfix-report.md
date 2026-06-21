# terminus-rag Hotfix Report

## Bug 1 — FastMCP rejects internal Host header with 421

### TransportSecuritySettings API (verified)

```
TransportSecuritySettings(
    *,
    enable_dns_rebinding_protection: bool = True,
    allowed_hosts: list[str] = [],
    allowed_origins: list[str] = []
) -> None
```

FastMCP `__init__` accepts a `transport_security` parameter (confirmed in parameter list).

### Fix applied

`addons/terminus-rag/backend/app/mcp_app.py` — `build_app()` now passes:

```python
transport_security=TransportSecuritySettings(
    allowed_hosts=[
        "local-terminus-rag",
        "local-terminus-rag:*",
        "127.0.0.1:*",
        "localhost",
        "localhost:*",
        "[::1]:*",
    ],
)
```

Wildcard-port patterns like `local-terminus-rag:*` are supported by the installed version (confirmed `localhost:*` behavior in existing tests; `local-terminus-rag:*` verified by running the test suite).

### RED → GREEN evidence

- **RED**: `test_mcp_accepts_internal_addon_host` — `Host: local-terminus-rag:9000` → 421 + log `WARNING mcp.server.transport_security: Invalid Host header: local-terminus-rag:9000`. Assertion `r.status_code != 421` failed.
- **GREEN**: same test passes (200 response from tools/list after fix).

---

## Bug 2 — blueprints don't index (`blueprint/list` needs `domain`)

### Root cause

`ha_source.py::fetch_all` sent `{"type": "blueprint/list"}` without `domain` → HA returned `required key not provided @ data['domain']. Got None`.

### Fix applied

`addons/terminus-rag/backend/app/ha_source.py` — `fetch_all()` now iterates over both domains:

```python
for _domain in ("automation", "script"):
    result = await _command(
        ws, _mid, {"type": "blueprint/list", "domain": _domain}
    ) or {}
    blueprints[_domain] = result
    _mid += 1
```

Results are merged into `blueprints = {"automation": {...}, "script": {...}}` which `build_blueprint_records` already handles correctly (it iterates `blueprints.items()`).

### RED → GREEN evidence

- **RED**: `test_fetch_all_assembles_all_kinds` — `FakeWS` no longer receives `blueprint/list` (new `FakeWSDomainBlueprints` expects domain-keyed calls); blueprints missing from `kinds`. Test failed with `'blueprint' not in kinds`.
- **GREEN**: test passes; both `blueprint:automation:motion/light.yaml` and `blueprint:script:bedtime/routine.yaml` appear in indexed records; `ws._blueprint_domains_seen == ["automation", "script"]`.

---

## Full suite

74 passed, 1 deselected (slow embed test) — all green before each commit.
