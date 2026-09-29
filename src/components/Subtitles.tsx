import React, { useMemo } from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../schema";
import { FONT, LAYOUT } from "../theme";

const MAX_WORDS = 3;
const MAX_CHARS = 18;
const MAX_GAP = 0.6; // seconds of silence that forces a new page

type Page = { words: Word[]; start: number; end: number };

// Group word-level timestamps into short pages: few words, no long lines,
// and a new page after a pause so captions never hang over silence.
export const paginate = (words: Word[]): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) pages.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const w of words) {
    const chars = cur.map((c) => c.text).join(" ").length + w.text.length + 1;
    const prev = cur[cur.length - 1];
    if (cur.length >= MAX_WORDS || chars > MAX_CHARS || (prev && w.start - prev.end > MAX_GAP)) flush();
    cur.push(w);
  }
  flush();
  return pages;
};

export const Subtitles: React.FC<{ words: Word[]; accent: string }> = ({ words, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pages = useMemo(() => paginate(words), [words]);
  const page = pages.find((p, i) => t >= p.start && t < (pages[i + 1]?.start ?? p.end + 0.3));
  if (!page) return null;

  const pop = spring({ frame: frame - Math.round(page.start * fps), fps, config: { damping: 14, mass: 0.5 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: LAYOUT.subtitles.top,
          left: 140,
          right: 140,
          height: LAYOUT.subtitles.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          columnGap: 18,
          transform: `scale(${0.9 + 0.1 * pop})`,
          textAlign: "center",
        }}
      >
        {page.words.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.05;
          return (
            <span
              key={i}
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: -1.2,
                lineHeight: 1.1,
                color: active ? accent : "#fff",
                textShadow: "0 4px 24px rgba(0,0,0,0.6)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
