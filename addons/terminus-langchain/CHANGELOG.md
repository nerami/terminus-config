# Changelog

All notable changes to the Terminus add-on are recorded here. The version
headings match `config.yaml` `version` (the single canonical version bumped on
release). Changelog tracking starts at 0.5.5.

## 0.5.6

- Add `dev.sh` to run the full local hot-reload stack (LangGraph + uvicorn +
  Vite) with one command, plus a `.env.example` template. Developer tooling
  only — no change to the add-on's runtime behavior.

## 0.5.5

- Optimize Docker build caching: backend Python dependencies now install in a
  separate layer keyed only on `pyproject.toml`, so source-only edits (and
  version bumps) no longer trigger a full dependency reinstall. Faster rebuilds
  with no change to runtime behavior.
