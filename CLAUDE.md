# SaaS clips engine — agent instructions

Goal: turn long founder / startup / SaaS / AI podcasts into 20–35 s vertical
clips that get views from founders, marketers and product people. Every clip
carries a CTA banner for Matvii's SaaS demo video service. We optimise for
leads, not raw views.

## Workflow (run on the Mac)

1. `python3 scripts/prepare.py <url-or-file> --license "<why clipping is allowed>"`
   → `~/Desktop/SaaS Clips/A_sources/<source_id>/` with `transcript.txt` and `words.json`.
2. Read `transcript.txt` fully and write `clips.json` in the same folder (format below).
3. `python3 scripts/build.py <source_id>` → `~/Desktop/SaaS Clips/B_clips/<id>.mp4` + `<id>.txt` caption.
4. Show the list of rendered clips to the user for approval. Never publish on your own.

## Picking moments

Pick 5–8 moments per hour of podcast. Each must:
- be 20–35 s (hard limit 15–45 s), start and end on sentence boundaries;
- make sense with zero context — no "as I said", "that thing", unnamed "he";
- open strong: a claim, number, conflict or surprise in the first sentence;
- have a payoff: insight, lesson, twist or punchline before it ends;
- matter to SaaS / startup people: first customers, pricing, growth, launches,
  mistakes, pivots, fundraising, revenue, AI, product, marketing, hiring.

Score each 0–100 on viral potential, audience relevance (would a SaaS founder
stop scrolling?), standalone clarity; keep only the ones that are strong on all three.

## clips.json

```json
[
  {
    "start": 1234.5,
    "end": 1262.0,
    "hook": "He got his first *100 customers* from one Reddit post",
    "speaker": {"name": "Full Name", "title": "Founder, Company"},
    "focusX": 0.5,
    "caption": "One or two natural sentences of context. Sometimes a question?",
    "hashtags": ["#saas", "#startup", "#founder"]
  }
]
```

- `start`/`end`: seconds, from the transcript timestamps (check `words.json` for exact word times).
- `hook`: max ~8 words, must be delivered by the clip itself — no fake clickbait.
  Wrap 1–3 key words in `*asterisks*` to highlight them.
- `focusX`: 0 = speaker on the left of the 16:9 frame, 1 = right, 0.5 = centre.
- `speaker`: only when you are sure who is talking; otherwise null.
- `caption`: short, human, no emoji spam, 3–5 hashtags.

## Sources and rights

Only use sources the user confirmed may be clipped (creator allows clips,
permission given, or licensed). If `source.json` says UNVERIFIED, tell the
user before building. Always keep the source credit on screen (done automatically).
