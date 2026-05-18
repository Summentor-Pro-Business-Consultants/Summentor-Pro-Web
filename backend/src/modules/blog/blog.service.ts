/**
 * blog.service.ts — Blog Module: Business Logic Layer
 *
 * This file contains all business rules for managing blog posts. It sits
 * between the HTTP controller and the Prisma repository, and is the correct
 * place for logic such as:
 *
 *   Slug management:
 *     Auto-generating a URL-safe slug from the title when none is provided,
 *     and guaranteeing uniqueness by appending a numeric suffix if there is a
 *     collision (e.g. "my-post" → "my-post-1" → "my-post-2").
 *
 *   Published-at timestamp:
 *     Setting `publishedAt` to the current time when a post is first published,
 *     and clearing it (null) when a post is moved back to draft. During updates,
 *     if the post is already published, the original `publishedAt` is preserved
 *     rather than being overwritten with the update time.
 *
 *   Existence & conflict checks:
 *     Confirming a post exists before attempting an update, and checking for
 *     slug collisions before applying user-supplied slugs.
 *
 *   Error translation:
 *     Converting Prisma's generic P2025 error into a domain-level NotFoundError
 *     so the global handler returns HTTP 404 instead of 500.
 *
 * Two private helper functions (`toSlug` and `uniqueSlug`) are kept module-
 * private because they are implementation details of this service and have no
 * reason to be called from outside the module.
 */

import { BadRequestError, NotFoundError } from "../../shared/errors/api-error.class.ts";
import type { CreateBlogInput, UpdateBlogInput } from "./blog.validator.ts";
import * as blogRepo from "./blog.repository.ts";

/**
 * Converts an arbitrary title string into a URL-safe slug.
 *
 * Steps:
 *   1. Lowercase the entire string.
 *   2. Strip any character that isn't a letter, digit, space, or hyphen.
 *   3. Trim leading/trailing whitespace.
 *   4. Replace runs of whitespace with a single hyphen.
 *   5. Collapse consecutive hyphens into one.
 *   6. Truncate to 200 characters to stay well within the 220-char column limit.
 *
 * @param title - The raw blog post title.
 * @returns     A URL-safe slug string.
 */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove anything that isn't alphanumeric, space, or hyphen
    .trim()
    .replace(/\s+/g, "-") // convert whitespace runs to a single hyphen
    .replace(/-+/g, "-") // collapse consecutive hyphens
    .slice(0, 200); // guard against extremely long titles
}

/**
 * Ensures a slug is unique in the database by appending an incrementing
 * numeric suffix until a free slot is found.
 *
 * Example: if "my-post" and "my-post-1" are taken, returns "my-post-2".
 *
 * The `excludeId` parameter is forwarded to `slugExists` so that a post's
 * own current slug is not treated as a collision during updates.
 *
 * @param base      - The starting slug to try.
 * @param excludeId - UUID of the post being updated (optional).
 * @returns         A slug string guaranteed to be unique in the database.
 */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let attempt = 0;
  // Keep trying slug-N until we find one that isn't already taken
  while (await blogRepo.slugExists(slug, excludeId)) {
    attempt++;
    slug = `${base}-${attempt}`;
  }
  return slug;
}

/**
 * Creates a new blog post.
 *
 * Slug resolution order:
 *   1. If the caller provided a slug, use it as the base (still de-duplicated).
 *   2. Otherwise, generate a slug from the title.
 *
 * `publishedAt` is set to the current time only when the initial status is
 * 'published'. For drafts it is left undefined (stored as NULL in the DB).
 *
 * @param input - Validated create-blog payload.
 * @returns     The newly created Blog record.
 */
export async function createBlog(input: CreateBlogInput) {
  // Prefer a caller-supplied slug; fall back to a title-derived one
  const baseSlug = input.slug ?? toSlug(input.title);
  const slug = await uniqueSlug(baseSlug);

  // Only stamp publishedAt when the post is created in a published state
  const publishedAt = input.status === "published" ? new Date() : undefined;

  return blogRepo.createBlog({ ...input, slug, publishedAt });
}

/**
 * Returns a paginated list of blog posts for the admin dashboard.
 * Supports status and full-text search filtering.
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page (capped in the controller).
 * @param status - Optional status filter ('draft' | 'published').
 * @param search - Optional free-text search string.
 * @returns      `{ data: BlogSummary[], total: number }`
 */
export async function listBlogs(page: number, limit: number, status?: string, search?: string) {
  return blogRepo.listBlogs(page, limit, status, search);
}

/**
 * Returns a paginated list of published blog posts for the public website.
 * Optionally filtered by a tag substring.
 *
 * @param page  - 1-based page number.
 * @param limit - Records per page.
 * @param tag   - Optional tag string to filter by.
 * @returns     `{ data: PublicBlogSummary[], total: number }`
 */
export async function listPublishedBlogs(page: number, limit: number, tag?: string) {
  return blogRepo.listPublishedBlogs(page, limit, tag);
}

/**
 * Fetches a single blog post by ID (admin use — returns any status).
 *
 * @param id - UUID of the blog post.
 * @returns  The full Blog record including content.
 * @throws   NotFoundError if no post matches the given ID.
 */
export async function getBlogById(id: string) {
  const blog = await blogRepo.getBlogById(id);
  if (!blog) throw new NotFoundError("Blog not found");
  return blog;
}

/**
 * Fetches a published blog post by slug (public use).
 *
 * Two conditions must both be true for the post to be returned:
 *   1. A post with the given slug exists.
 *   2. Its status is 'published'.
 *
 * Returning the same 404 for "not found" and "found but draft" prevents
 * leaking information about unpublished content to public users.
 *
 * @param slug - URL slug of the blog post.
 * @returns    The full Blog record.
 * @throws     NotFoundError if the post is missing or not published.
 */
export async function getBlogBySlug(slug: string) {
  const blog = await blogRepo.getBlogBySlug(slug);
  // Treat a draft post the same as a missing post for public callers
  if (!blog || blog.status !== "published") throw new NotFoundError("Blog not found");
  return blog;
}

/**
 * Updates an existing blog post.
 *
 * Slug update logic:
 *   - If a slug is explicitly provided → validate it is unique (excluding self),
 *     then use it.
 *   - If the title is changing but no slug is provided → auto-generate a new
 *     unique slug from the new title.
 *   - If neither slug nor title is changing → leave the slug untouched.
 *
 * publishedAt update logic:
 *   - Transitioning to 'published' → preserve the original publishedAt if the
 *     post was already published, otherwise stamp the current time.
 *   - Transitioning to 'draft' → clear publishedAt (set to null).
 *   - Status not changing → leave publishedAt untouched.
 *
 * @param id    - UUID of the blog post to update.
 * @param input - Partial update payload.
 * @returns     The updated Blog record.
 * @throws      NotFoundError    if the post does not exist.
 * @throws      BadRequestError  if the requested slug is already in use.
 */
export async function updateBlog(id: string, input: UpdateBlogInput) {
  // Confirm the post exists before performing further checks
  await getBlogById(id);

  // --- Slug resolution ---
  let slug: string | undefined;
  if (input.slug) {
    // User explicitly provided a slug — check it isn't already taken by another post
    if (await blogRepo.slugExists(input.slug, id)) {
      throw new BadRequestError("Slug already in use");
    }
    slug = input.slug;
  } else if (input.title) {
    // Title is changing but no slug given — derive a new unique slug from the new title
    slug = await uniqueSlug(toSlug(input.title), id);
  }
  // If neither slug nor title changed, slug stays undefined and Prisma won't touch the column

  // --- publishedAt resolution ---
  let publishedAt: Date | null | undefined;
  if (input.status === "published") {
    // Re-fetch to check if the post was already published so we don't overwrite the original date
    const existing = await blogRepo.getBlogById(id);
    // Preserve original publishedAt; only stamp now if this is the first publish
    publishedAt = existing?.publishedAt ?? new Date();
  } else if (input.status === "draft") {
    // Explicitly set to null to clear the published timestamp when reverting to draft
    publishedAt = null;
  }
  // If status isn't changing, publishedAt stays undefined and Prisma won't touch the column

  return blogRepo.updateBlog(id, { ...input, slug, publishedAt });
}

/**
 * Permanently deletes a blog post by ID.
 *
 * Catches Prisma P2025 ("record to delete does not exist") and re-throws as
 * NotFoundError so the global error handler returns HTTP 404 instead of 500.
 *
 * @param id - UUID of the blog post to delete.
 * @throws   NotFoundError if no post with the given ID exists.
 */
export async function deleteBlog(id: string) {
  try {
    await blogRepo.deleteBlog(id);
  } catch {
    // Prisma P2025 ("Record to delete does not exist") arrives here
    throw new NotFoundError("Blog not found");
  }
}
