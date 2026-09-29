import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Cta } from "../schema";
import { FONT, LAYOUT } from "../theme";

// Frames each rotating line stays on screen. The whole banner loops every
// LINE_FRAMES * lines.length frames, so every animation below is expressed
// relative to that period to stay seamless.
const LINE_FRAMES = 84;
// Blue hairline with a soft white highlight travelling around it.
const glow = (deg: number) =>
  `conic-gradient(from ${deg}deg, #0A84FF 0deg, #7CC4FF 40deg, #FFFFFF 70deg, #7CC4FF 100deg, #0A84FF 140deg, #0A5BD6 250deg, #0A84FF 360deg)`;

const RotatingLine: React.FC<{ text: string; local: number; fps: number }> = ({ text, local, fps }) => {
  const enter = spring({ frame: local, fps, config: { damping: 200, mass: 0.6 } });
  const exit = interpolate(local, [LINE_FRAMES - 12, LINE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(enter, [0, 1], [26, 0]) - exit * 22;
  const blur = interpolate(enter, [0, 1], [10, 0]) + exit * 10;
  const opacity = enter * (1 - exit);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        opacity,
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: -0.8,
        color: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const CtaBanner: React.FC<{ cta: Cta; accent: string }> = ({ cta, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const period = LINE_FRAMES * cta.lines.length;
  const t = frame % period;
  const lineIndex = Math.floor(t / LINE_FRAMES);
  const local = t % LINE_FRAMES;
  const angle = (t / period) * 360;

  // Button: a gentle "breath" plus a shimmer sweep once per line.
  const breath = 1 + 0.03 * Math.sin((t / period) * Math.PI * 2 * cta.lines.length);
  const shimmer = interpolate(local, [20, 50], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bannerWidth = width - LAYOUT.side * 2;
  const { top, height } = LAYOUT.banner;
  const radius = height / 2;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* soft outer glow */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.side,
          top,
          width: bannerWidth,
          height,
          borderRadius: radius,
          background: glow(angle),
          filter: "blur(28px)",
          opacity: 0.3,
        }}
      />
      {/* gradient hairline border */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.side,
          top,
          width: bannerWidth,
          height,
          borderRadius: radius,
          padding: 2.5,
          background: glow(angle),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: radius,
            background: "linear-gradient(180deg, rgba(28,28,32,0.96), rgba(12,12,14,0.96))",
            display: "flex",
            alignItems: "center",
            padding: "0 22px 0 22px",
            gap: 24,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Avatar cta={cta} accent={accent} />
          <div style={{ flex: 1, position: "relative", height: "100%" }}>
            <div
              style={{
                position: "absolute",
                top: 26,
                left: 0,
                fontSize: 26,
                fontWeight: 500,
                color: "rgba(235,235,245,0.6)",
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
              }}
            >
              {cta.name} · {cta.role}
            </div>
            <div style={{ position: "absolute", top: 58, left: 0, right: 0, height: 64 }}>
              <RotatingLine text={cta.lines[lineIndex]} local={local} fps={fps} />
            </div>
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: 72,
              padding: "0 30px",
              borderRadius: 36,
              background: "#fff",
              color: "#000",
              fontSize: 30,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              transform: `scale(${breath})`,
              whiteSpace: "nowrap",
            }}
          >
            {cta.button}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: shimmer,
                width: 60,
                transform: "skewX(-20deg)",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                mixBlendMode: "overlay",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Avatar: React.FC<{ cta: Cta; accent: string }> = ({ cta, accent }) => {
  const size = 104;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        flexShrink: 0,
        background: `linear-gradient(135deg, ${accent}, #BF5AF2)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 3px rgba(255,255,255,0.08)",
      }}
    >
      {cta.avatar ? (
        <Img src={staticFile(cta.avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: 48, fontWeight: 800, color: "#fff" }}>{cta.name.slice(0, 1)}</span>
      )}
    </div>
  );
};
