/**
 * app/api/blogs/route.ts
 *
 * Next.js App Router API route that proxies blog list requests to the Express
 * backend.
 *
 * ROLE:
 *   This route is the public-facing endpoint for fetching paginated / filtered
 *   lists of published blog posts.  It forwards query parameters from the
 *   browser directly to the backend and returns the response unchanged.
 *
 * WHY proxy instead of calling the backend directly from the browser?
 *   Same reasons as the contact proxy:
 *     1. CORS: The backend can whitelist only the Next.js server origin.
 *     2. Environment isolation: `NEXT_PUBLIC_API_URL` is resolved server-side.
 *     3. `cache: "no-store"` is set here (not in the browser fetch) so Next.js
 *        never caches stale blog data at the edge — every request fetches fresh
 *        content from the backend.
 *
 * WHY `cache: "no-store"`?
 *   Blog posts can be created, updated, or published at any time via the admin
 *   panel.  Caching the list could serve stale data to readers.  If a static
 *   cache is ever needed, it should be managed on the backend (e.g. with
 *   Redis) rather than at the Next.js edge layer.
 *
 * HOW it fits in:
 *   Public blog page components call `/api/blogs?page=1&limit=10` (this file).
 *   This route appends the original query string to the backend URL so all
 *   pagination and filter params are forwarded without any transformation.
 */

import { NextRequest, NextResponse } from "next/server";

/** Backend base URL — falls back to localhost for local development. */
const BACKEND =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

/**
 * GET /api/blogs
 *
 * Proxies a blog list request (with optional query parameters) to the Express
 * backend and returns the result.
 *
 * Query parameters (examples):
 *   - `?page=2&limit=10`  — pagination
 *   - `?tag=leadership`   — filter by tag
 *
 * All query params are forwarded verbatim to the backend via `req.nextUrl.search`.
 *
 * Error handling:
 *   - Network failures or unexpected errors return a 500 with a generic message.
 *
 * @param req - The incoming Next.js request; query string is extracted and forwarded.
 * @returns A JSON response mirroring the backend's blog list envelope and status,
 *          or `{ message: "Failed to fetch blogs" }` with status 500 on error.
 */
export async function GET(req: NextRequest) {
  try {
    // `req.nextUrl.search` is the full query string including the leading `?`,
    // e.g. "?page=1&limit=10".  Appending it directly preserves all filters
    // and pagination params without any manual serialisation.
    const search = req.nextUrl.search;

    const res = await fetch(`${BACKEND}/blogs${search}`, {
      // Disable Next.js's built-in fetch cache to always serve fresh blog data.
      cache: "no-store",
    });

    const data = await res.json();

    // Mirror the backend's status code (200, 400, 404, etc.).
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Catches network failures and unexpected errors.
    return NextResponse.json({ message: "Failed to fetch blogs" }, { status: 500 });
  }
}
