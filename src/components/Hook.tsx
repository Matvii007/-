import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, LAYOUT } from "../theme";

// "Most founders *price* too low" -> highlight the words wrapped in asterisks.
const parts = (hook: string) => hook.split(/(\*[^*]+\*)/).filter(Boolean);

export const Hook: React.FC<{ hook: string; accent: string }> = ({ hook, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Short entrance: the headline must be readable within the first ~0.3s.
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.4 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: LAYOUT.hook.top,
          left: LAYOUT.side + 10,
          right: LAYOUT.side + 10,
          height: LAYOUT.hook.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -1.5,
          color: "#fff",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 16}px)`,
        }}
      >
        <span>
          {parts(hook).map((p, i) =>
            p.startsWith("*") ? (
              <span key={i} style={{ color: accent }}>
                {p.slice(1, -1)}
              </span>
            ) : (
              <span key={i}>{p}</span>
            ),
          )}
        </span>
      </div>
    </AbsoluteFill>
  );
};
