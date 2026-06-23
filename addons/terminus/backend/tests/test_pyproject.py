import tomllib
from pathlib import Path

PYPROJECT = Path(__file__).resolve().parents[1] / "pyproject.toml"


def test_requires_python_floor_is_312():
    data = tomllib.loads(PYPROJECT.read_text())
    assert data["project"]["requires-python"] == ">=3.12"


def test_version_stays_frozen():
    # The canonical version lives in config.yaml; pyproject stays 0.0.0 to
    # preserve the Docker pip-cache layer.
    data = tomllib.loads(PYPROJECT.read_text())
    assert data["project"]["version"] == "0.0.0"
