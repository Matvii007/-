"""Render the moments picked in A_sources/<source_id>/clips.json into B_clips/.

Usage:
  python3 scripts/build.py <source_id> [--only 1,3]

clips.json is a list of:
  {"start": 123.4, "end": 151.8, "hook": "... *highlight* ...",
   "speaker": {"name": "...", "title": "..."} | null, "focusX": 0.5,
   "caption": "...", "hashtags": ["#saas", ...]}

For every clip: cuts the segment into public/sources, picks a subtitle accent
from the clip's colours, writes jobs/<id>.json, renders B_clips/<id>.mp4 and
B_clips/<id>.txt (caption to paste into TikTok).
"""
import argparse
import colorsys
import json
import subprocess
import sys

from common import CLIPS, REPO, SOURCES, ffmpeg

PAD = 0.15  # seconds kept around the cut so the first/last word isn't clipped


def cut(src, start, end, dst):
    subprocess.run(
        [ffmpeg(), "-y", "-loglevel", "error", "-ss", f"{start:.3f}", "-i", str(src), "-t", f"{end - start:.3f}",
         "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "320k", str(dst)],
        check=True,
    )


def accent_from(video, fallback):
    """Average colour of the middle frame, pushed to a vivid, readable tone."""
    out = subprocess.run(
        [ffmpeg(), "-loglevel", "error", "-ss", "3", "-i", str(video), "-vf", "scale=1:1:flags=area",
         "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True,
    ).stdout
    if len(out) < 3:
        return fallback
    h, l, s = colorsys.rgb_to_hls(*(c / 255 for c in out[:3]))
    if s < 0.12:  # grey/black studio: keep the brand blue
        return fallback
    r, g, b = colorsys.hls_to_rgb(h, 0.62, 0.95)
    return "#{:02X}{:02X}{:02X}".format(int(r * 255), int(g * 255), int(b * 255))


def words_in(words, start, end):
    return [
        {"text": w["text"], "start": round(w["start"] - start, 2), "end": round(w["end"] - start, 2)}
        for w in words
        if w["start"] >= start - 0.05 and w["end"] <= end + 0.1 and w["text"]
    ]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source_id")
    ap.add_argument("--only", help="comma-separated clip numbers (1-based)")
    args = ap.parse_args()

    folder = SOURCES / args.source_id
    meta = json.loads((folder / "source.json").read_text())
    words = json.loads((folder / "words.json").read_text())
    clips = json.loads((folder / "clips.json").read_text())
    brand = json.loads((REPO / "config" / "brand.json").read_text())
    avatar = brand["cta"]["avatar"]
    cta = {**brand["cta"], "avatar": avatar if avatar and (REPO / "public" / avatar).exists() else None}
    only = {int(x) for x in args.only.split(",")} if args.only else None

    CLIPS.mkdir(parents=True, exist_ok=True)
    (REPO / "public" / "sources").mkdir(parents=True, exist_ok=True)

    for n, clip in enumerate(clips, 1):
        if only and n not in only:
            continue
        clip_id = f"{args.source_id}-{n:02d}"
        start, end = clip["start"] - PAD, clip["end"] + PAD
        segment = REPO / "public" / "sources" / f"{clip_id}.mp4"
        cut(folder / "source.mp4", start, end, segment)

        job = {
            "id": clip_id,
            "format": "podcast_clip",
            "hook": clip["hook"],
            "sourceVideo": f"sources/{clip_id}.mp4",
            "clipStart": 0,
            "clipEnd": round(end - start, 2),
            "focusX": clip.get("focusX", 0.5),
            "speaker": clip.get("speaker"),
            "credit": meta.get("author"),
            "words": words_in(words, start, end),
            "cta": cta,
            "accent": accent_from(segment, brand["fallbackAccent"]),
        }
        job_path = REPO / "jobs" / f"{clip_id}.json"
        job_path.write_text(json.dumps(job, indent=2, ensure_ascii=False))

        subprocess.run(["node", "scripts/render.mjs", str(job_path), str(CLIPS)], cwd=REPO, check=True)
        segment.unlink(missing_ok=True)

        tags = " ".join(clip.get("hashtags") or brand["hashtags"])
        credit = f"\n\n🎙 {meta['author']}" if meta.get("author") else ""
        (CLIPS / f"{clip_id}.txt").write_text(f"{clip.get('caption', '')}{credit}\n\n{tags}\n")
        print(f"✓ {clip_id}  ({job['clipEnd']}s, accent {job['accent']})")


if __name__ == "__main__":
    sys.exit(main())
