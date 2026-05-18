/**
 * contact.validator.ts — Contact Module: Input Validation Schemas
 *
 * This file defines all Zod schemas used to validate incoming HTTP request data
 * for the contact module. It acts as the single source of truth for what shape
 * of data is acceptable before it ever reaches the service or database layers.
 *
 * Why Zod?
 *   Zod lets us declare schemas that double as TypeScript types (via z.infer),
 *   eliminating the need to manually maintain parallel type definitions.
 *
 * Two schemas are exported:
 *   - contactSchema       → validates the body of a new contact form submission
 *   - contactStatusSchema → validates admin status-update patch requests
 *
 * The inferred `ContactInput` type is re-exported so the service layer can use
 * it without importing Zod directly.
 */

import z from "zod";

/**
 * The exhaustive list of industry sectors a contact submitter can belong to.
 * Declared as a `const` tuple so Zod can narrow it to a literal union type,
 * and the array can be reused elsewhere (e.g., frontend dropdowns, seeding).
 */
export const INDUSTRY_SECTORS = [
  "IT",
  "Healthcare",
  "Services",
  "Education",
  "Manufacturing",
  "NGO",
  "Others",
] as const;

/**
 * Validates the full body of a "Contact Us" form submission.
 *
 * Required fields (firstName, lastName, organisation, email, industrySector)
 * represent the minimum information needed to action the lead.
 *
 * Optional fields (designation, phone, location, referralSource, budget,
 * message) enrich the lead without being gatekeeping blockers — they map to
 * nullable columns in the database.
 */
export const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  organisation: z.string().min(1).max(200),
  designation: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  industrySector: z.enum(INDUSTRY_SECTORS),
  referralSource: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  message: z.string().max(3000).optional(),
});

/**
 * Validates the body of an admin PATCH request that changes a contact's
 * workflow status. Only the three allowed lifecycle values are accepted —
 * anything else is rejected before it hits the database.
 */
export const contactStatusSchema = z.object({
  status: z.enum(["new", "reviewed", "replied"]),
});

/** TypeScript type inferred directly from contactSchema — use this in the service layer. */
export type ContactInput = z.infer<typeof contactSchema>;
