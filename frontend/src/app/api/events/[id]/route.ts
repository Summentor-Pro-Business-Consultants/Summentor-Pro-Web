/**
 * app/api/events/[id]/route.ts
 *
 * Public proxy for fetching a single event's details. Mirrors the pattern of
 * the contact/blogs proxies: the browser calls this same-origin route, which
 * forwards to the Express backend server-side using the server-only `API_URL`.
 * This keeps the backend URL out of the browser bundle and means the event
 * detail page works on any deploy domain without a NEXT_PUBLIC_ variable.
 */

import { NextRequest, NextResponse } from "next/server";

/** Backend base URL — server-only var, with dev fallback. */
const BACKEND =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Events can be edited/unpublished from the admin panel — never cache.
    const res = await fetch(`${BACKEND}/events/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    const data = await res.json();
    // Mirror the backend status (notably 404 for an unknown/unpublished event).
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Failed to fetch event" }, { status: 500 });
  }
}
