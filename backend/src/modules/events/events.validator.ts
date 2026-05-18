/**
 * events.validator.ts — Events Module: Input Validation Schemas
 *
 * Defines all Zod schemas used to validate incoming request data for the events
 * module. There are four distinct schemas covering the two main resource types
 * this module manages: Events and EventRegistrations.
 *
 * Schema overview:
 *   registerForEventSchema         → public POST: register for an event
 *   createEventSchema              → admin POST: create a new event
 *   updateEventSchema              → admin PATCH: partially update an event
 *                                    (all fields optional via .partial())
 *   updateRegistrationStatusSchema → admin PATCH: change a registration's status
 *
 * Inferred TypeScript types are exported alongside schemas so that the service
 * and repository layers can stay type-safe without importing Zod themselves.
 */

import z from "zod";

/**
 * Validates the body sent when a visitor registers for a public event.
 * Only `name` and `email` are required; the rest are enrichment fields.
 */
export const registerForEventSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  message: z.string().max(1000).optional(),
});

/**
 * Validates the body sent when an admin creates a new event.
 *
 * `eventDate` is validated as an ISO 8601 datetime string (not a Date object)
 * because JSON payloads always carry dates as strings. The service layer is
 * responsible for converting this string to a JS Date before storing it.
 *
 * `status` defaults to 'upcoming' so new events don't need to explicitly
 * set this field unless they are being created in a different lifecycle state.
 */
export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  city: z.string().min(1).max(100),
  venue: z.string().max(200).optional(),
  // ISO 8601 string — converted to Date in the service layer
  eventDate: z.string().datetime(),
  tag: z.string().min(1).max(50),
  capacity: z.number().int().positive().optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming"),
});

/**
 * Validates an admin partial-update request for an existing event.
 * `.partial()` makes every field in `createEventSchema` optional so callers
 * only need to include the fields they want to change.
 */
export const updateEventSchema = createEventSchema.partial();

/**
 * Validates the body sent when an admin changes a registration's lifecycle
 * status (e.g. from 'pending' → 'confirmed' after capacity checks).
 */
export const updateRegistrationStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "attended", "cancelled"]),
});

/** TypeScript type for the public event registration payload. */
export type RegisterForEventInput = z.infer<typeof registerForEventSchema>;

/** TypeScript type for the admin create-event payload. */
export type CreateEventInput = z.infer<typeof createEventSchema>;

/** TypeScript type for the admin partial-update payload. */
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
