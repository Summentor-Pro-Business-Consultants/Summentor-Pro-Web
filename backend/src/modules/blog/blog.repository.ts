/**
 * blog.repository.ts — Blog Module: Data Access Layer
 *
 * This file is the only place in the blog module that talks to the database.
 * Every function is a focused Prisma wrapper with no business logic — it
 * receives already-validated, already-transformed data and executes the query.
 *
 * Key design notes:
 *
 *   Slug uniqueness:
 *     `slugExists` is a helper used by the service layer to check for slug
 *     collisions before inserting or updating. The optional `excludeId`
 *     parameter lets update operations exclude the record being updated from
 *     the uniqueness check (a post can keep its own slug).
 *
 *   Dual listing functions:
 *     `listBlogs` is the admin view — returns all statuses, includes all
 *     columns, ordered by creation date.
 *     `listPublishedBlogs` is the public view — hard-filters to 'published'
 *     status, orders by `publishedAt`, and omits the `content` column (which
 *     can be large) so the listing endpoint stays fast.
 *
 *   Optional field coercion (null vs. undefined):
 *     Prisma requires `null` (not `undefined`) to explicitly store NULL in a
 *     nullable column. Where the service passes undefined for optional fields,
 *     the `??` operator coerces them to null before insertion.
 *
 *   Defaults:
 *     `author` defaults to 'Summentor Pro Team' and `tags` defaults to an
 *     empty string here in the repository — these are storage-layer defaults
 *     rather than business rules, so they belong here rather than in the service.
 */

import { prisma } from "../../infrastructure/db/prisma.client.ts";
import { getPagination } from "../../shared/utils/pagination.util.ts";

/**
 * Inserts a new Blog record into the database.
 *
 * All optional fields use `?? null` (or a sensible string default) so the
 * Prisma client sends explicit NULL/default values rather than omitting the
 * columns from the INSERT.
 *
 * @param data - Blog fields; optional fields may be undefined.
 * @returns    The newly created Blog record.
 */
export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt?: string | undefined;
  content: string;
  coverImage?: string | undefined;
  author?: string | undefined;
  tags?: string | undefined;
  status?: string | undefined;
  publishedAt?: Date | undefined;
}) {
  return prisma.blog.create({
    data: {
      title: data.title,
      slug: data.slug,
      // Prisma needs null, not undefined, for optional nullable columns
      excerpt: data.excerpt ?? null,
      content: data.content,
      coverImage: data.coverImage ?? null,
      // Fall back to a team attribution rather than storing NULL for author
      author: data.author ?? "Summentor Pro Team",
      // tags stored as an empty string (not NULL) so string operations are safe
      tags: data.tags ?? "",
      status: data.status ?? "draft",
      publishedAt: data.publishedAt ?? null,
    },
  });
}

/**
 * Returns a paginated list of blog posts for the admin dashboard.
 * Includes all statuses and all metadata columns (but NOT `content` to keep
 * the payload small — the content is only fetched on the detail view).
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page.
 * @param status - Optional status filter ('draft' | 'published').
 * @param search - Optional free-text search over title, excerpt, and author.
 * @returns      `{ data: BlogSummary[], total: number }`
 */
export async function listBlogs(page: number, limit: number, status?: string, search?: string) {
  const { take, skip } = getPagination(page, limit);

  // Build the where clause incrementally to avoid passing undefined filter values
  const where: Record<string, unknown> = {};
  if (status) where["status"] = status;
  if (search) {
    // Search title, excerpt, and author — content is intentionally excluded
    // because it's large and the full-text relevance would be noisy
    where["OR"] = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
    ];
  }

  // Run the data fetch and count in parallel to halve the round-trip time
  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      // Explicitly select only the columns needed for list cards — omit `content`
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        author: true,
        tags: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);
  return { data, total };
}

/**
 * Returns a paginated list of published blog posts for the public website.
 * Ordered by `publishedAt` descending so the most recently published posts
 * appear first. Omits `content` and `updatedAt` since the listing page only
 * needs card-level metadata.
 *
 * @param page - 1-based page number.
 * @param limit - Records per page.
 * @param tag  - Optional tag substring filter (case-sensitive contains match).
 * @returns    `{ data: PublicBlogSummary[], total: number }`
 */
export async function listPublishedBlogs(page: number, limit: number, tag?: string) {
  const { take, skip } = getPagination(page, limit);
  // Always restrict to published posts on the public listing
  const where: Record<string, unknown> = { status: "published" };
  // Tag filtering uses a simple string contains — tags are stored as a plain string
  if (tag) where["tags"] = { contains: tag };
  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      take,
      skip,
      // Newest published post first — mirrors the expected blog UX
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        author: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);
  return { data, total };
}

/**
 * Looks up a single blog post by its primary key (UUID).
 * Returns the full record including `content`. Returns `null` if not found.
 *
 * @param id - UUID of the Blog record.
 * @returns  Full Blog record or null.
 */
export async function getBlogById(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

/**
 * Looks up a single blog post by its URL slug.
 * Returns the full record including `content`. Returns `null` if not found.
 * Used by the public-facing post detail route (e.g. /blog/my-post-title).
 *
 * @param slug - URL slug of the Blog record.
 * @returns    Full Blog record or null.
 */
export async function getBlogBySlug(slug: string) {
  return prisma.blog.findUnique({ where: { slug } });
}

/**
 * Applies a partial update to an existing Blog record.
 * Only the fields included in `data` are changed — Prisma ignores undefined keys.
 * Note that `publishedAt` can be `null` here (to clear it when un-publishing).
 *
 * @param id   - UUID of the blog post to update.
 * @param data - Partial set of fields to update.
 * @returns    The updated Blog record.
 */
export async function updateBlog(
  id: string,
  data: {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    coverImage?: string | undefined;
    author?: string | undefined;
    tags?: string | undefined;
    status?: string | undefined;
    publishedAt?: Date | null | undefined; // null explicitly clears the publish timestamp
  },
) {
  // Strip `undefined` values before passing to Prisma to satisfy exactOptionalPropertyTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanData: any = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );
  return prisma.blog.update({ where: { id }, data: cleanData });
}

/**
 * Hard-deletes a blog post by ID.
 * If the record does not exist, Prisma throws P2025 — caught by the service.
 *
 * @param id - UUID of the blog post to delete.
 * @returns  The deleted Blog record.
 */
export async function deleteBlog(id: string) {
  return prisma.blog.delete({ where: { id } });
}

/**
 * Checks whether a given slug is already in use by another blog post.
 *
 * The optional `excludeId` parameter is used during updates: when a post is
 * being updated and its slug hasn't changed, we don't want to flag the post's
 * own slug as a collision. Passing the post's own ID here excludes it from the
 * uniqueness check.
 *
 * @param slug      - The slug string to check.
 * @param excludeId - UUID of the blog post to exclude (used during updates).
 * @returns         `true` if the slug is taken by a different post, `false` otherwise.
 */
export async function slugExists(slug: string, excludeId?: string) {
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog) return false;
  // If the slug belongs to the post being updated, it is not a collision
  return blog.id !== excludeId;
}
