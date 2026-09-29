import React from "react";
import { Composition } from "remotion";
import { PodcastClip } from "./PodcastClip";
import { podcastClipSchema, type PodcastClipProps } from "./schema";
import { FPS, HEIGHT, WIDTH } from "./theme";
import example from "../jobs/example.json";

export const Root: React.FC = () => (
  <Composition
    id="PodcastClip"
    component={PodcastClip}
    schema={podcastClipSchema}
    defaultProps={example as PodcastClipProps}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    durationInFrames={FPS * 30}
    calculateMetadata={({ props }: { props: PodcastClipProps }) => ({
      durationInFrames: Math.max(1, Math.round((props.clipEnd - props.clipStart) * FPS)),
    })}
  />
);
