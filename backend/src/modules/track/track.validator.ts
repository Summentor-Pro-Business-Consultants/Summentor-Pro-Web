import { z } from "zod";

export const trackSchema = z.object({
  path: z.string().min(1).max(500),
  referrer: z.string().max(2000).optional(),
  sessionId: z.string().uuid().optional(),
});

export type TrackInput = z.infer<typeof trackSchema>;
