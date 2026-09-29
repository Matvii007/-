import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { PodcastClipProps } from "../schema";
import { FONT, LAYOUT } from "../theme";

type Props = Pick<PodcastClipProps, "sourceVideo" | "clipStart" | "focusX" | "speaker" | "credit" | "accent">;

export const ClipFrame: React.FC<Props> = ({ sourceVideo, clipStart, focusX, speaker, credit, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width, durationInFrames } = useVideoConfig();
  const { top, height } = LAYOUT.frame;
  const w = width - LAYOUT.side * 2;
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.side,
          top,
          width: w,
          height,
          borderRadius: 48,
          overflow: "hidden",
          background: "#111",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7), inset 0 0 0 1.5px rgba(255,255,255,0.16)",
        }}
      >
        {sourceVideo ? (
          <OffthreadVideo
            src={staticFile(sourceVideo)}
            startFrom={Math.round(clipStart * fps)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${focusX * 100}% 50%` }}
          />
        ) : (
          <Placeholder />
        )}

        {/* inner hairline on top of the video */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 48, boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.16)" }} />

        {speaker && (
          <div style={{ position: "absolute", left: 28, bottom: 36, ...glassPill }}>
            <span style={{ fontWeight: 700, color: "#fff" }}>{speaker.name}</span>
            <span style={{ color: "rgba(235,235,245,0.65)", marginLeft: 12 }}>{speaker.title}</span>
          </div>
        )}
        {credit && (
          <div style={{ position: "absolute", right: 28, top: 28, ...glassPill, fontSize: 22, height: 44, padding: "0 18px" }}>
            <span style={{ color: "rgba(235,235,245,0.8)" }}>{credit}</span>
          </div>
        )}

        <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${progress * 100}%`, background: accent }} />
      </div>
    </AbsoluteFill>
  );
};

const glassPill: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: 60,
  padding: "0 24px",
  borderRadius: 30,
  fontSize: 26,
  background: "rgba(20,20,22,0.55)",
  backdropFilter: "blur(20px)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
  whiteSpace: "nowrap",
};

// Shown when a job has no source yet, so the template can be previewed on its own.
const Placeholder: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = Array.from({ length: 28 });
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 30% 30%, #2a2a35, #0d0d10 70%)",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", height: 160 }}>
        {bars.map((_, i) => (
          <div
            key={i}
            style={{
              width: 12,
              borderRadius: 6,
              background: "rgba(255,255,255,0.75)",
              height: 30 + 110 * Math.abs(Math.sin(frame / 6 + i * 0.7) * Math.cos(frame / 11 + i * 0.3)),
            }}
          />
        ))}
      </div>
      <div style={{ color: "rgba(235,235,245,0.5)", fontSize: 30, fontWeight: 600, letterSpacing: 4 }}>PODCAST CLIP</div>
    </AbsoluteFill>
  );
};
