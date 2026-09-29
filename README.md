# SaaS clips engine

Template-based renderer for 9:16 short-form clips (TikTok / Reels): a podcast
clip in a rounded frame, a hook headline, word-highlighted subtitles and a
looping CTA banner that advertises SaaS demo video services.

## Render

```bash
npm install
npm run studio                          # live preview / tweak in the browser
node scripts/render.mjs jobs/example.json   # -> out/example-001.mp4
```

Each video is a JSON job (see `jobs/example.json`, schema in `src/schema.ts`):
hook, source file in `public/`, clip start/end, word timestamps, speaker,
credit and CTA settings. Wrap words in the hook with `*asterisks*` to
highlight them.

## Roadmap (MVP)

1. Template + render (this commit)
2. Source intake: local file / permitted URL -> `public/sources/`
3. Transcription with word timestamps (local Whisper, free)
4. Claude picks the 5 best 20–35 s moments + 3 hooks each -> job JSON
5. Preview + manual approve
6. Publishing and analytics
