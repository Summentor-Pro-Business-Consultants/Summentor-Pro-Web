/**
 * app/api/events/[id]/register/route.ts
 *
 * Public proxy for event registration submissions. The browser POSTs here
 * (same-origin); this route forwards the body to the Express backend's
 * `/events/:id/register` endpoint server-side using the server-only `API_URL`.
 *
 * The real client IP is forwarded via X-Forwarded-For so the backend's per-IP
 * rate limiting / geolocation stays accurate (it would otherwise see the
 * Vercel server's IP). The backend mirrors validation errors (e.g. 400/409),
 * which are preserved here so the form can show them.
 */

import { NextRequest, NextResponse } from "next/server";

/** Backend base URL — server-only var, with dev fallback. */
const BACKEND =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.text();
    const clientIp = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";

    const res = await fetch(`${BACKEND}/events/${encodeURIComponent(id)}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": clientIp,
      },
      body,
    });

    const data = await res.json();
    // Mirror the backend status so the form distinguishes success from a
    // validation error (full event, bad input, etc.).
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
