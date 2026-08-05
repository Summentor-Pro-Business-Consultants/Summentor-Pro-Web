import { z } from "zod";

export const trackSchema = z.object({
  path: z.string().min(1).max(500),
  referrer: z.string().max(2000).optional(),
  sessionId: z.string().uuid().optional(),
});

export type TrackInput = z.infer<typeof trackSchema>;

/**
 * Behavioural event names the API accepts. Kept as a closed enum so the
 * dashboard can rely on a fixed vocabulary and a stray client can't pollute
 * the table with arbitrary names — add a member here to introduce a new event.
 */
export const TRACKED_EVENT_NAMES = [
  "cta_click",
  "scroll_depth",
  "form_start",
  "form_submit",
  "form_error",
] as const;

export const TRACKED_EVENT_CATEGORIES = ["engagement", "conversion"] as const;

export const trackEventSchema = z.object({
  name: z.enum(TRACKED_EVENT_NAMES),
  category: z.enum(TRACKED_EVENT_CATEGORIES).optional(),
  path: z.string().min(1).max(500),
  /** Human-readable identity of the thing acted on, e.g. "Partner With Us". */
  label: z.string().max(120).optional(),
  /** Single numeric payload, e.g. scroll percentage (0–100). */
  value: z.number().int().min(0).max(100000).optional(),
  /** Small free-form bag for anything else; capped to keep rows lean. */
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  referrer: z.string().max(2000).optional(),
  sessionId: z.string().uuid().optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
