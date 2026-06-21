import tomllib
from pathlib import Path

import yaml

ADDON = Path(__file__).resolve().parents[2]


def test_pyproject_pins_version_and_python_floor():
    data = tomllib.loads((ADDON / "backend" / "pyproject.toml").read_text())
    assert data["project"]["version"] == "0.0.0"
    assert data["project"]["requires-python"] == ">=3.12"
    ini = data["tool"]["pytest"]["ini_options"]
    assert ini["asyncio_mode"] == "auto"
    assert any("slow" in m for m in ini["markers"])


def test_config_yaml_manifest_invariants():
    cfg = yaml.safe_load((ADDON / "config.yaml").read_text())
    assert cfg["slug"] == "terminus_rag"
    assert cfg["homeassistant_api"] is True
    assert "ports" not in cfg
    assert cfg["init"] is False
    assert cfg["startup"] == "application"
    assert cfg["options"]["refresh_interval"] == 600
    assert cfg["schema"]["api_token"] == "password?"


def test_changelog_has_first_release_heading():
    text = (ADDON / "CHANGELOG.md").read_text()
    cfg = yaml.safe_load((ADDON / "config.yaml").read_text())
    assert f"## {cfg['version']}" in text


def test_app_package_importable():
    import app  # noqa: F401
