# Changelog

All notable changes to the Terminus add-on are recorded here. The version
headings match `config.yaml` `version` (the single canonical version bumped on
release). Changelog tracking starts at 0.5.5.

## 0.16.0

- **Optional Langfuse tracing (default off).** A new set of add-on options
  (`langfuse_tracing`, `langfuse_public_key`, `langfuse_secret_key`,
  `langfuse_host`) lets the agent emit traces to a self-hosted Langfuse
  instance. The handler is baked into the compiled graph, so every agent run
  is traced once enabled.
- **Fail-closed, private-LAN only.** Tracing activates only when explicitly
  switched on, fully credentialed, AND pointed at a private-LAN host; a public
  host (or incomplete config) is refused and logged rather than silently
  shipping prompts off-network. Tracing failures never block the agent.
- Adds the `langfuse` (v4) runtime dependency.

## 0.15.0

- Chat no longer dies on a render error. The chat is wrapped in an error
  boundary that shows a recoverable Error screen (reload to recover) instead of
  unmounting the whole app. The agent-server connection error reuses the same
  Error screen.
- Harden the interrupt/tool-call/tool-result render path against
  `Object.entries(null/undefined)`: guard tool-call args, edit-action args,
  generic-interrupt values, tool-result content (non-string content no longer
  crashes), and state-view values (which treated `null` as an object).

## 0.14.0

- Add `control_entity`: turn a single entity on / off / toggle by its entity id
  (e.g. "turn MB: Lamp off"). It maps to the universal
  `homeassistant.turn_on/turn_off/toggle` services and is allowlisted to the
  light, switch, fan, media_player, cover and climate domains. Like run_scene /
  trigger_automation it changes the home, so it pauses for your approval before
  running. (`lock` is intentionally excluded — the universal services don't map
  cleanly to lock/unlock.)
- Add `get_entity_state`: read one entity's current state and attributes to
  check or confirm what a device is doing. It only reads, so it never pauses
  for approval.

## 0.13.0

- Mount terminus-rag's MCP knowledge tools into the agent: semantic search
  (search_ha), full enumeration (list_records / list_kinds), exact lookup
  (get_record), and on-demand history (get_automation_trace / get_logbook /
  get_history). The agent can now discover what exists instead of relying on
  the user to supply exact ids.
- Add `rag_url` (default http://local-terminus-rag:9000/mcp) and `rag_token`
  options for the terminus-rag connection.
- Graceful degradation: if terminus-rag is unreachable, the agent keeps
  actuation (run_scene / trigger_automation) and instance status
  (ha_basic_info) and tells you knowledge tools are offline.

## 0.12.0

### Security & hardening — proxy & endpoints (Spec B)

- **H1 — LangGraph proxy allowlist.** `/api/*` now forwards only the explicit
  `(method, path)` pairs the frontend actually calls (thread create/get/update/
  search/state/history; run stream/get/cancel/join/joinStream; `GET /info`).
  Everything else — thread delete/prune/count, store, crons, assistants — is
  rejected with `403` **before** any upstream call.
- **H2 — request hygiene + bounded timeouts.** Forwarded requests now strip
  `authorization`, `content-length`, `host`, `connection`, and other hop-by-hop
  headers. The proxy `httpx.AsyncClient` replaces `timeout=None` with a bounded
  `httpx.Timeout` (finite connect/read), so a wedged upstream can't pin a
  connection forever.
- **M1 — topology cache single-flight.** Concurrent `/ha/topology` misses now
  run `fetch_topology` exactly once behind an `asyncio.Lock` instead of each
  opening its own websocket and running the full 4-call + enrichment fetch.
- **M2 — websocket command timeouts.** Each Home Assistant websocket command is
  wrapped in `asyncio.wait_for` (raises `HARegistryError` on timeout instead of
  hanging), and the per-automation enrichment loop is bounded by a wall-clock
  budget so a slow Core can't stall the topology request indefinitely.

## 0.11.0

- **Observability:** the backend now logs to stdout (captured by
  `ha apps logs local_terminus`) at every degradation point. A new `log_level`
  add-on option (debug|info|warning|error, default info) sets the root level.
- **P0 fix:** the agent tools (`ha_basic_info`, `run_scene`, `trigger_automation`)
  now catch malformed-body (`json.JSONDecodeError`) and bad-URL
  (`httpx.InvalidURL`) failures and return a structured error instead of
  crashing the agent loop on the state-changing path.
- **Empty ≠ failed:** an automation drill-down now propagates a real
  websocket/auth failure as a 502 (surfaced in the UI) instead of returning an
  empty-but-successful 200; the REST 404→trace→related fallback ladder is each
  logged.
- **Hardening:** `referenced_ids` recursion is depth-bounded; the topology area
  sort tolerates non-string names; ws/REST URL parsing tolerates uppercase
  schemes and credentials; a corrupt `/data/options.json` is now logged.
- **Startup:** a missing `ANTHROPIC_API_KEY` now fails the agent graph with a
  clear, logged error instead of opaque proxy 502s.
- Python floor raised to `>=3.12` (matches the `3.12-alpine3.18` runtime).

## 0.10.0

- The **3D topology** nodes are now kind-specific, slowly-rotating Platonic
  solids — areas are icosahedrons, automations dodecahedrons, scenes octahedrons,
  and entities tetrahedrons — instead of uniform spheres, so each kind reads apart
  at a glance.
- The 3D scene now sits inside a soft, procedurally-shaded gradient "room" that
  follows the light/dark theme, and the camera's zoom-out is clamped so you stay
  inside it.
- Each 3D node's name, metadata, and kind icon are combined into a single label
  chip that always faces the camera, depth-sorts so nearer labels sit on top
  (updating as you rotate), and is clipped to the panel.
- Roomier layout: wider spacing between nodes and a larger gap between a node and
  its label, plus tuned node sizes (automations and scenes match; entities a touch
  larger).
- The 2D and 3D views now share one color palette, so a node's color is the same
  in both.

## 0.9.0

- New **3D home topology** view (beta), toggleable from Settings → Appearance.
  It renders the same topology data as the 2D diagram but as an interactive,
  force-directed 3D graph (reagraph/WebGL) with a rotating camera and curved
  edges. Both renderers are lazy-loaded, so three.js only downloads when 3D is
  enabled; the existing 2D React Flow view is unchanged.
- The 3D view mirrors the 2D interactions: click a node to drill in / navigate /
  open its detail modal, with the same selection + automation upstream-path
  highlighting, and per-view dragged-node positions persist.
- Each kind is distinguishable in 3D: per-kind colored nodes with the same lucide
  glyph icons as 2D, a kind-colored ring, JetBrains Mono labels, directional
  lighting, and a corner legend. Node sizes vary by kind (areas largest).
- Shared zoom-in / zoom-out / fit-to-view controls now appear in both the 2D and
  3D views (bottom-left) for visual consistency; the 3D wheel/pinch zoom is
  faster.

## 0.8.0

- Terminus has a new voice: a "warm terminal" persona — plain, calm, structured
  output (an aligned three-operation table) that stays friendly rather than cold.
  The system prompt now also states its capability boundary (it only reports
  basic instance info and runs existing scenes/automations — it can't control
  individual entities), tells the model not to invent entity ids (ask when the
  target is ambiguous), and to surface tool errors plainly instead of claiming a
  success it didn't receive.
- Fixed a prompt/runtime mismatch: the approval sentence is now built from the
  same `auto_run` flag that decides whether the approval interrupt is attached.
  With auto-run enabled the prompt no longer promises a pause that won't happen;
  it says actions run immediately instead.
- The per-turn topology context injected from the Home panel is now labelled
  ("context for this turn only, not a command") so the model knows what the
  appended block is instead of receiving an unframed blob.

## 0.7.1

- Tool calls and their results now collapse to a single line, expanding on click
  to reveal the arguments/output (built on the shadcn **Item** + **Collapsible**
  components). They are left-aligned with the rest of the chat, a long tool name
  in the header truncates with an ellipsis, and wide argument/result values wrap
  to the chat width instead of stretching it (no horizontal scrolling).
- The full-width chat input bar now carries a translucent page background, so
  messages no longer bleed through it while scrolling.
- The chat top bar shows the conversation title next to the sidebar toggle, with
  a three-dot **Rename** / **Archive** menu in place of the new-chat button.
- Conversations get an auto-generated title: after the first exchange the backend
  summarises the opening message into a short title via a LangChain LCEL chain
  (`POST /api/title`), stored on the thread's metadata. Title generation uses a
  cheaper/faster model (Haiku) by default — configurable via the new
  `title_model` add-on option — and falls back to a trimmed first message when no
  Anthropic key is set. Titles can also be renamed by hand.
- Add-on options now show friendly names and descriptions in the configuration
  UI (via `translations/en.yaml`), clarifying that `ha_url`/`ha_token` are
  dev-only fallbacks ignored under the Supervisor.
- Icon sizing is standardised on Tailwind's `size-*` utility (shadcn convention)
  instead of mixed `h-*/w-*` classes.
- Topology UX: opening the diagram from the sidebar shows it full screen, while
  opening it from the chat top-bar button shows it as a side panel (split view).
  An icon button with a tooltip (top-left, with a divider
  before the "Home Topology" heading) returns to the split view on larger screens,
  or back to the chat on small screens; in split view a **Close** button in the
  chat panel re-expands the diagram to full screen. The topology header keeps
  refresh and close controls — the breadcrumbs are gone (navigation is via the
  grouping selectors) — and the chat top bar now matches the topology header.
  Opening/closing the panel is instant (no width transition). The panel's
  open/full-screen state persists across reloads, so leaving and returning to the
  tab restores the same view.
- The sidebar now uses the shadcn **inset** variant: the main content sits in a
  rounded, inset card on desktop. The chat fills the inset via `h-full` (instead
  of `h-screen`) so the inset margins don't push the page into an extra scrollbar.
- Sidebar settings now persist in **localStorage** and are grouped by category
  (**Chatbot**, **Appearance**). The tool-call toggle is relabelled **Show tool
  calls**, and a new **Font size** stepper adjusts the base document size
  (10–20px, default 16). The Home Assistant status dot sits next to the Settings
  button in the footer.
- Top-bar icon buttons across the chat and topology headers share one ghost style
  and size. The sidebar toggle reflects open/closed state (`panel-left-open` /
  `panel-left-close`), the topology "open chat" control uses a `bot-message-square`
  icon, and `TooltipIconButton` no longer hard-codes its size.
- The Terminus logo is tinted with the theme **primary** colour (passed as a
  Tailwind class from each call site), and the error/glitch variant uses the
  **destructive** colour.
- On a cold load (opening Terminus from elsewhere, or refreshing), a loading
  screen is shown until the backend `/ha/status` check returns — success or
  error — then the app renders.

## 0.7.0

- Chat UI: introduce a shadcn **Sidebar** as the home for navigation and global
  controls. The Terminus logo, **New Session**, the **Topology** toggle, and the
  **Recent Sessions** list all move there, decluttering the chat column (the
  Session/History tabs are gone). On mobile the sidebar collapses to a drawer.
- The sidebar footer holds the Home Assistant status dot and a new **Settings**
  dropdown whose **View tools** toggle replaces the old in-input "Hide Tool
  Calls" switch (persisted in the URL as `viewTools`, defaulting to on).
- Prompt input: context chips now use the shadcn **Badge** component, and the
  input container uses a translucent page background.
- Tool-call messages are rebuilt on the shadcn **Item** and **Collapsible**
  components.
- Topology: scene/entity/automation group nodes get a flat, distinct treatment
  and all border-radius is removed to match the radius-free theme; edges now
  render as **smooth step**.
- Conventions: the frontend source is refactored to kebab-case file/folder
  names with no index files and no default exports, enforced via
  `eslint-plugin-unicorn` (`unicorn/filename-case`) and
  `import-x/no-default-export`. Vendored shadcn `ui/` components are left
  untouched.

## 0.6.2

- Dev tooling: adopt the `terminus-ui` ESLint setup in the frontend
  (`eslint.config.js` + `.prettierrc`, plus `lint`/`format` scripts) and run
  `eslint --fix` across the source. Rules existing source still violates are
  temporarily relaxed in a `TODO(lint)` block listing each offender. No change
  to the add-on's runtime behavior.

## 0.6.1

- Error states now render the **glitch** logo variant instead of wave, signalling
  an agent-server problem visually. The shared StatusCard shell is extracted into
  its own module so `Stream.tsx` and the LoadingScreen story render from one
  source and can't drift.
- Fix: the glitch hot-flash frame flashed to a hardcoded white, invisible in dark
  mode where the foreground is already near-white. It now flashes to
  `var(--background)`, so the pixel pops in both light and dark themes.

## 0.6.0

- Refactor the Terminus logo into a variant architecture (`base-layer`,
  `glitch`, `phosphor`, `wave`) with 16-bit glyphs and a hover-triggered
  `animationMode`.
- Add the animated **wave** logo variant — a height-based traveling wave with a
  contour-following runner — and use it on the startup/loading screen in place
  of the spinner.
- Topology panel now persists across reloads and new tabs: panel open/close and
  the active view are stored locally, and the toolbar toggle no longer resets to
  the areas overview. URL deep-links still restore the view.
- Scene and automation root nodes are interactive: double-clicking the root node
  inside a detail view opens the entity modal instead of re-navigating.
- Dev tooling: `dev.sh` backend bootstrap switched to `uv sync` (adds
  `backend/uv.lock`). No change to the add-on's runtime behavior.

## 0.5.6

- Add `dev.sh` to run the full local hot-reload stack (LangGraph + uvicorn +
  Vite) with one command, plus a `.env.example` template. Developer tooling
  only — no change to the add-on's runtime behavior.

## 0.5.5

- Optimize Docker build caching: backend Python dependencies now install in a
  separate layer keyed only on `pyproject.toml`, so source-only edits (and
  version bumps) no longer trigger a full dependency reinstall. Faster rebuilds
  with no change to runtime behavior.
