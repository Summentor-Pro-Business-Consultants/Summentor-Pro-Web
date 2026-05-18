/**
 * pagination.util.ts — Cursor-free offset pagination helper
 *
 * Converts the raw `page` and `limit` query-string values (which arrive as
 * strings or undefined from Express) into the `take` / `skip` shape that
 * Prisma expects for offset-based pagination.
 *
 * Design choices:
 *   - Default page size of 10 keeps response payloads small without requiring
 *     the caller to always pass a limit.
 *   - Page numbering is 1-based (page 1 = first page) to match user-facing
 *     conventions; the conversion to a 0-based `skip` is done here so it
 *     doesn't leak into controller or service code.
 *   - Explicit `Number()` coercion handles the case where `page` and `limit`
 *     are passed in as strings from `req.query`.
 *
 * Limitation: offset pagination can return duplicate or skipped rows if the
 * underlying data is modified between pages.  For high-churn datasets,
 * cursor-based pagination (using Prisma's `cursor` option) would be more
 * reliable, but offset pagination is simpler and sufficient for admin UIs
 * with relatively stable data.
 */

/**
 * Converts optional page/limit values into Prisma-compatible `take`/`skip`.
 *
 * @param page  - 1-based page number.  Defaults to page 1 (skip = 0) if omitted.
 * @param limit - Number of records per page.  Defaults to 10 if omitted.
 * @returns       `{ take, skip }` ready to spread into a Prisma `findMany` call.
 *
 * @example
 *   const { take, skip } = getPagination(req.query.page, req.query.limit);
 *   const results = await prisma.blog.findMany({ take, skip, orderBy: ... });
 */
export function getPagination(page?: number, limit?: number) {
  // Coerce to Number in case the values arrive as query-string strings.
  const take = limit ? Number(limit) : 10;

  // Convert 1-based page index to a 0-based byte offset.
  // E.g. page=2, take=10 → skip=10 (skip the first 10 records).
  const skip = page ? (Number(page) - 1) * take : 0;

  return { take, skip };
}
