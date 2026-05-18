/**
 * blog.validator.ts — Blog Module: Input Validation Schemas
 *
 * Defines all Zod schemas used to validate incoming HTTP request bodies for the
 * blog module. The module manages two lifecycle concerns:
 *   1. Creating and editing blog post content (createBlogSchema / updateBlogSchema).
 *   2. Publishing or un-publishing a post (blogStatusSchema).
 *
 * Schema design decisions:
 *   - `slug` is optional on create: if omitted, the service layer auto-generates
 *     a URL-safe slug from the title and guarantees uniqueness.
 *   - `tags` is stored as a plain string (comma-separated or space-separated)
 *     rather than an array, keeping the database schema simple.
 *   - `updateBlogSchema` is derived from `createBlogSchema` via `.partial()` so
 *     both schemas share the same field constraints — no duplication.
 *   - `blogStatusSchema` is a dedicated single-field schema for a PATCH endpoint
 *     that only changes publication status, keeping that operation atomic.
 *
 * Inferred TypeScript types are exported so service/controller code stays
 * type-safe without importing Zod directly.
 */

import z from "zod";

/**
 * Validates the body of an admin POST request to create a new blog post.
 *
 * `title` and `content` are the only truly required fields — everything else
 * has either a sensible default in the repository or is genuinely optional
 * display metadata.
 *
 * The `slug` regex enforces URL-safe format: lowercase letters, digits, and
 * hyphens only. This prevents slugs like "My Post!" that would break URLs.
 */
export const createBlogSchema = z.object({
  title: z.string().min(1).max(200),
  // Slug is optional — the service will derive one from the title if omitted
  slug: z
    .string()
    .min(1)
    .max(220)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  author: z.string().max(100).optional(),
  // Stored as a free-form string (e.g. "mentoring leadership") for simplicity
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

/**
 * Validates the body of an admin PATCH request to update an existing blog post.
 * All fields from `createBlogSchema` become optional so callers only send
 * the fields they actually want to change.
 */
export const updateBlogSchema = createBlogSchema.partial();

/**
 * Validates a standalone status-change PATCH request.
 * Used when the admin wants to publish or un-publish a post without editing
 * any other fields — keeping status changes a single-purpose atomic operation.
 */
export const blogStatusSchema = z.object({
  status: z.enum(["draft", "published"]),
});

/** TypeScript type for the admin create-blog payload. */
export type CreateBlogInput = z.infer<typeof createBlogSchema>;

/** TypeScript type for the admin partial-update payload. */
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
