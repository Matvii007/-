"""Download (or copy) a long-form source and transcribe it with word timestamps.

Usage:
  python3 scripts/prepare.py <youtube-url | path/to/video.mp4> [--license "clips allowed per description"]

Creates  A_sources/<source_id>/
  source.mp4       the video (best quality up to 4K)
  source.json      url, title, author, license note, date  (source tracking)
  words.json       every word with start/end seconds
  transcript.txt   compact "[mm:ss] text" lines for picking moments
"""
import argparse
import datetime as dt
import json
import shutil
import subprocess
import sys

from common import SOURCES, slug

MODEL = "mlx-community/whisper-large-v3-turbo"


def download(url: str, folder):
    fmt = "bv*[height<=2160][ext=mp4]+ba[ext=m4a]/bv*[height<=2160]+ba/b"
    subprocess.run(
        ["yt-dlp", "-f", fmt, "--merge-output-format", "mp4", "-o", str(folder / "source.%(ext)s"),
         "--write-info-json", "--no-playlist", url],
        check=True,
    )
    info_file = folder / "source.info.json"
    info = json.loads(info_file.read_text()) if info_file.exists() else {}
    info_file.unlink(missing_ok=True)
    return {
        "url": url,
        "title": info.get("title"),
        "author": info.get("uploader") or info.get("channel"),
        "license": info.get("license"),
        "height": info.get("height"),
    }


def transcribe(video, folder):
    import mlx_whisper  # pip install mlx-whisper  (Apple Silicon)

    result = mlx_whisper.transcribe(str(video), path_or_hf_repo=MODEL, word_timestamps=True, verbose=False)
    words, lines = [], []
    for seg in result["segments"]:
        for w in seg.get("words", []):
            words.append({"text": w["word"].strip(), "start": round(w["start"], 2), "end": round(w["end"], 2)})
        m, s = divmod(seg["start"], 60)
        lines.append(f"[{int(m):02d}:{s:04.1f}] {seg['text'].strip()}")
    (folder / "words.json").write_text(json.dumps(words, ensure_ascii=False))
    (folder / "transcript.txt").write_text("\n".join(lines))
    return len(words)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--license", default=None, help="why we may clip this source")
    args = ap.parse_args()

    is_url = args.source.startswith("http")
    name = args.source if is_url else args.source.rsplit("/", 1)[-1].rsplit(".", 1)[0]
    source_id = f"{dt.date.today():%Y%m%d}-{slug(name, 30)}"
    folder = SOURCES / source_id
    folder.mkdir(parents=True, exist_ok=True)

    if is_url:
        meta = download(args.source, folder)
    else:
        shutil.copy(args.source, folder / "source.mp4")
        meta = {"url": None, "title": name, "author": None, "license": None}
    meta.update(
        id=source_id,
        use_status=args.license or meta.get("license") or "UNVERIFIED - check before publishing",
        fetched=dt.datetime.now().isoformat(timespec="seconds"),
    )
    (folder / "source.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))

    n = transcribe(folder / "source.mp4", folder)
    print(f"\n✓ {source_id}: {n} words -> {folder}")


if __name__ == "__main__":
    sys.exit(main())
