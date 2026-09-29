import { z } from "zod";

export const wordSchema = z.object({
  text: z.string(),
  // seconds, relative to clipStart
  start: z.number(),
  end: z.number(),
});

export const ctaSchema = z.object({
  name: z.string(),
  role: z.string(),
  handle: z.string(),
  // file in public/ (e.g. "brand/avatar.png") or null for an initials placeholder
  avatar: z.string().nullable(),
  // rotating lines in the banner; the loop cycles through all of them
  lines: z.array(z.string()).min(1),
  button: z.string(),
});

export const podcastClipSchema = z.object({
  id: z.string(),
  format: z.literal("podcast_clip"),
  // headline shown above the frame; wrap words in *asterisks* to highlight them
  hook: z.string(),
  // file in public/ (e.g. "sources/abc.mp4") or null to render a placeholder
  sourceVideo: z.string().nullable(),
  clipStart: z.number(),
  clipEnd: z.number(),
  // horizontal crop focus of the 16:9 source inside the frame, 0 = left, 1 = right
  focusX: z.number().min(0).max(1),
  speaker: z.object({ name: z.string(), title: z.string() }).nullable(),
  credit: z.string().nullable(),
  words: z.array(wordSchema),
  cta: ctaSchema,
  accent: z.string(),
});

export type PodcastClipProps = z.infer<typeof podcastClipSchema>;
export type Word = z.infer<typeof wordSchema>;
export type Cta = z.infer<typeof ctaSchema>;
