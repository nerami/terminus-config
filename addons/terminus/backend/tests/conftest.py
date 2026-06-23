import os

# Importing app.agent runs `graph = build_graph()` at module load, which now
# requires ANTHROPIC_API_KEY (the Task 9 startup guard). Provide a dummy key
# for test collection so the import succeeds; tests that exercise the missing-key
# path inject Settings(anthropic_api_key="") directly and are unaffected.
os.environ.setdefault("ANTHROPIC_API_KEY", "test-anthropic-key-not-real")
