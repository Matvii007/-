# SaaS clips engine

Turns long podcasts into 9:16 clips for TikTok / Reels: the clip in a rounded
frame, a hook headline, word-highlighted subtitles tinted to the video's colours
and a looping CTA banner that advertises SaaS demo videos.

## Setup on the Mac (Apple Silicon)

```bash
brew install ffmpeg yt-dlp node python
pip3 install mlx-whisper          # local transcription with word timestamps, free
git clone <this repo> && cd <repo> && npm install
```

Put your photo at `public/brand/avatar.jpg` (square). Banner texts, handle and
hashtags live in `config/brand.json`.

## Use

```bash
python3 scripts/prepare.py "https://youtube.com/watch?v=..." --license "creator allows clips"
# -> ~/Desktop/SaaS Clips/A_sources/<source_id>/transcript.txt
# Claude Code reads the transcript and writes clips.json (see CLAUDE.md)
python3 scripts/build.py <source_id>
# -> ~/Desktop/SaaS Clips/B_clips/<id>.mp4 + <id>.txt (caption)
```

`npm run studio` opens a live preview of the template.
Set `CLIPS_ROOT` to use a different folder than `~/Desktop/SaaS Clips`.

## Render quality

1080×1920 (TikTok's native size), PNG frames, H.264 High CRF 15, BT.709,
AAC 320 kbps. Sources are downloaded up to 4K, so the clip is only ever
downscaled inside the frame.
