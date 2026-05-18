/**
 * app/api/blogs/[slug]/route.ts
 *
 * Next.js App Router API route that proxies single blog post requests to the
 * Express backend, identified by a URL slug.
 *
 * ROLE:
 *   This route is the public-facing endpoint for fetching the full content of
 *   a single blog post.  It extracts the `slug` dynamic segment from the URL,
 *   forwards it to the backend, and returns the post data.
 *
 * WHY a dynamic [slug] segment?
 *   Slugs are human-readable URL-safe identifiers (e.g. "scaling-mentorship-
 *   programs-2025") that the backend uses to look up a specific post.  Using
 *   a slug rather than a UUID in the public URL is better for SEO and produces
 *   more shareable links.
 *
 * WHY is `params` a `Promise` here?
 *   In Next.js 15+, dynamic route params are provided as a Promise in App
 *   Router API routes.  `await params` unwraps the object synchronously on
 *   the first tick; the `Promise` type is a framework requirement, not an
 *   indication of async work.
 *
 * WHY `cache: "no-store"`?
 *   Blog posts may be edited or unpublished at any time via the admin panel.
 *   Stale cached content is a worse user experience than a slightly slower
 *   round-trip to the backend.  See the list route (`../route.ts`) for the
 *   same reasoning.
 *
 * HOW it fits in:
 *   The blog detail page (e.g. `/blog/scaling-mentorship-programs-2025`) calls
 *   `/api/blogs/scaling-mentorship-programs-2025` (this route).
 *   This route calls `${BACKEND}/blogs/:slug` and mirrors the response.
 */

import { NextRequest, NextResponse } from "next/server";

/** Backend base URL — falls back to localhost for local development. */
const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

/**
 * GET /api/blogs/[slug]
 *
 * Fetches a single blog post by its URL slug from the Express backend.
 *
 * @param _req    - The incoming Next.js request (unused; slug comes from params).
 * @param params  - Next.js route context containing the dynamic `slug` segment.
 *                  Typed as `Promise<{ slug: string }>` per Next.js 15+ convention.
 * @returns A JSON response mirroring the backend's blog post data and status,
 *          or `{ message: "Failed to fetch blog" }` with status 500 on error.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Await the params Promise to extract the slug from the dynamic URL segment.
    // e.g. for /api/blogs/my-post, slug === "my-post".
    const { slug } = await params;

    const res = await fetch(`${BACKEND}/blogs/${slug}`, {
      // Disable Next.js edge caching so readers always get the latest post content.
      cache: "no-store",
    });

    const data = await res.json();

    // Mirror the backend's status code — notably 404 when the slug does not
    // match any published post, so the frontend can render a not-found page.
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Catches network failures, JSON parse errors, and unexpected exceptions.
    return NextResponse.json({ message: "Failed to fetch blog" }, { status: 500 });
  }
}
