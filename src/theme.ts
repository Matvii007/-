import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so renders never depend on the network.
for (const weight of ["400", "500", "600", "700", "800"]) {
  loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight });
}

export const FONT = "Inter, -apple-system, sans-serif";
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Layout keeps text out of TikTok/Reels UI: top tabs (~150px), right action
// rail (~140px), bottom caption block (~380px).
export const LAYOUT = {
  side: 60,
  banner: { top: 170, height: 150 },
  hook: { top: 360, height: 170 },
  frame: { top: 560, height: 800 },
  subtitles: { top: 1390, height: 150 },
} as const;
