// Usage: node scripts/render.mjs jobs/<job>.json  ->  out/<id>.mp4
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const jobPath = process.argv[2] ?? "jobs/example.json";
const job = JSON.parse(readFileSync(jobPath, "utf8"));
const args = ["remotion", "render", "src/index.ts", "PodcastClip", `out/${job.id}.mp4`, `--props=${jobPath}`, "--codec=h264", "--crf=18"];
if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
execFileSync("npx", args, { stdio: "inherit" });
