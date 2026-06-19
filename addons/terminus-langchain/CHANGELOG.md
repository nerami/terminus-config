# Changelog

All notable changes to the Terminus add-on are recorded here. The version
headings match `config.yaml` `version` (the single canonical version bumped on
release). Changelog tracking starts at 0.5.5.

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
