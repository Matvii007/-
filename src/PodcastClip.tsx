import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { PodcastClipProps } from "./schema";
import { CtaBanner } from "./components/CtaBanner";
import { ClipFrame } from "./components/ClipFrame";
import { Hook } from "./components/Hook";
import { Subtitles } from "./components/Subtitles";

export const PodcastClip: React.FC<PodcastClipProps> = (props) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Backdrop accent={props.accent} />
      <ClipFrame {...props} />
      <Hook hook={props.hook} accent={props.accent} />
      <Subtitles words={props.words} accent={props.accent} />
      <CtaBanner cta={props.cta} accent={props.accent} />
    </AbsoluteFill>
  );
};

// Slow drifting glows on black: depth without distracting from the clip.
const Backdrop: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -300 + drift * 120,
          top: 500,
          borderRadius: "50%",
          background: accent,
          opacity: 0.16,
          filter: "blur(160px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          right: -300 + drift * 100,
          top: 1100,
          borderRadius: "50%",
          background: "#BF5AF2",
          opacity: 0.12,
          filter: "blur(160px)",
        }}
      />
    </AbsoluteFill>
  );
};
