import os
import re
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ROOT = Path(os.environ.get("CLIPS_ROOT", Path.home() / "Desktop" / "SaaS Clips"))
SOURCES = ROOT / "A_sources"
CLIPS = ROOT / "B_clips"


def ffmpeg() -> str:
    exe = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if not exe:
        raise SystemExit("ffmpeg not found: brew install ffmpeg (or set FFMPEG=/path/to/ffmpeg)")
    return exe


def slug(text: str, limit: int = 40) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:limit].strip("-") or "source"
