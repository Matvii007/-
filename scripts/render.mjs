// Usage: node scripts/render.mjs jobs/<job>.json [outDir]  ->  <outDir>/<id>.mp4 (default outDir: out)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const jobPath = process.argv[2] ?? "jobs/example.json";
const outDir = process.argv[3] ?? "out";
const job = JSON.parse(readFileSync(jobPath, "utf8"));

const args = [
  "remotion",
  "render",
  "src/index.ts",
  "PodcastClip",
  join(outDir, `${job.id}.mp4`),
  `--props=${jobPath}`,
  "--codec=h264",
  // PNG frames + low CRF + slow preset: no JPEG artifacts, crisp text after TikTok re-encode
  "--image-format=png",
  "--crf=15",
  "--x264-preset=slow",
  "--pixel-format=yuv420p",
  "--color-space=bt709",
  "--audio-bitrate=320k",
];
if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
execFileSync("npx", args, { stdio: "inherit" });
