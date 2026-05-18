/**
 * /api/track — Next.js proxy route for the page-view tracking endpoint.
 *
 * Forwards the client's POST body to the Express backend, carrying the
 * real client IP in the X-Forwarded-For header so the backend can perform
 * geolocation. Returns 200 regardless so tracking failures are invisible
 * to the browser.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";
const API_KEY = process.env.API_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const clientIp = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";

    await fetch(`${BACKEND}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "X-Forwarded-For": clientIp,
      },
      body,
    });
  } catch {
    // Silently swallow — tracking must never return an error to the client
  }

  return NextResponse.json({ ok: true });
}
