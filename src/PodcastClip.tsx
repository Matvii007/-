import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { PodcastClipProps } from "./schema";
import { CtaBanner } from "./components/CtaBanner";
import { ClipFrame } from "./components/ClipFrame";
import { Hook } from "./components/Hook";
import { Subtitles } from "./components/Subtitles";

export const PodcastClip: React.FC<PodcastClipProps> = (props) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {props.sourceVideo ? (
        <VideoBackdrop src={props.sourceVideo} clipStart={props.clipStart} />
      ) : (
        <Backdrop accent={props.accent} />
      )}
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

// Heavily blurred, darkened copy of the clip: the background automatically
// takes on the colours of each video.
const VideoBackdrop: React.FC<{ src: string; clipStart: number }> = ({ src, clipStart }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(clipStart * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(70px) saturate(1.3)", transform: "scale(1.3)", opacity: 0.55 }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.8))" }} />
    </AbsoluteFill>
  );
};
