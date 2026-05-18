/**
 * app/api/contact/route.ts
 *
 * Next.js App Router API route that proxies contact form submissions to the
 * Express backend.
 *
 * ROLE:
 *   This route acts as a thin pass-through between the public-facing contact
 *   form on the frontend and the Express `/contact` endpoint on the backend.
 *
 * WHY proxy instead of calling the backend directly from the browser?
 *   1. CORS: The backend only needs to trust `localhost` / the Next.js server,
 *      not arbitrary browser origins.
 *   2. Environment isolation: The backend URL (`NEXT_PUBLIC_API_URL`) is
 *      resolved server-side here, so it never has to be exposed in client
 *      bundles or be accessible to end users.
 *   3. Future flexibility: Rate limiting, captcha verification, or request
 *      transformation can be added here without touching the backend.
 *
 * HOW it fits in:
 *   The contact form component POSTs to `/api/contact` (this file).
 *   This route forwards the body verbatim to `${BACKEND}/contact` and mirrors
 *   the backend's status code and JSON body back to the browser.
 */

import { NextRequest, NextResponse } from "next/server";

/** Backend base URL — falls back to localhost for local development. */
// Server-only env (API_URL) preferred; NEXT_PUBLIC_API_URL kept as a
// backward-compatible fallback. API_KEY is never exposed to the browser.
const BACKEND =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";
const API_KEY = process.env.API_KEY ?? "";

/**
 * POST /api/contact
 *
 * Accepts a JSON contact form submission and proxies it to the Express backend.
 *
 * The backend's response status code is preserved so the frontend can
 * distinguish between a 201 Created (success) and a 422/400 (validation error)
 * without this proxy introducing its own status semantics.
 *
 * Error handling:
 *   - Network errors or JSON parse failures on the backend response are caught
 *     and surfaced as a 500 with a generic message so the form can show a
 *     user-friendly error.
 *
 * @param req - The incoming Next.js request containing the form data as JSON.
 * @returns A JSON response mirroring the backend's body and status code,
 *          or `{ message: "Failed to submit" }` with status 500 on error.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body — Next.js provides req.json() for this.
    const body = await req.json();

    // Forward to the backend with the shared API key (proxy-only) and the
    // real client IP so the backend's per-IP contact rate limiter is accurate.
    const clientIp =
      req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
    const res = await fetch(`${BACKEND}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "X-Forwarded-For": clientIp,
      },
      body: JSON.stringify(body),
    });

    // Parse the backend's response (could be a success envelope or a validation error).
    const data = await res.json();

    // Mirror the backend's HTTP status code so the frontend receives the correct
    // status (e.g. 201, 400, 422) rather than always seeing 200.
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Catches network failures, JSON parse errors, or unexpected exceptions.
    return NextResponse.json({ message: "Failed to submit" }, { status: 500 });
  }
}
