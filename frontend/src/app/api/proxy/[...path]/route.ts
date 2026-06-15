/**
 * app/api/proxy/[...path]/route.ts
 *
 * Same-origin reverse proxy for the admin panel's backend calls.
 *
 * WHY THIS EXISTS:
 *   The admin UI used to call the Express backend directly from the browser
 *   (`NEXT_PUBLIC_API_URL`). With the frontend on Vercel and the backend on
 *   Render — two different domains — that cross-origin setup caused two
 *   problems in production:
 *     1. CORS: every admin request was a credentialed cross-origin call that
 *        only worked if the backend's ORIGIN_URL exactly matched the Vercel
 *        domain.
 *     2. The refresh-token cookie was a *third-party* cookie (set by the
 *        backend domain on a page served from the Vercel domain), which Chrome
 *        now blocks — so sessions silently dropped on every page reload.
 *
 *   Routing admin traffic through this server-side proxy fixes both: the
 *   browser only ever talks to its own origin (no CORS), and the refresh
 *   cookie is rewritten to be first-party on the frontend origin (survives
 *   third-party-cookie blocking).
 *
 * HOW IT WORKS:
 *   `admin-api.ts` calls `/api/proxy/<segment>/...`. This handler forwards the
 *   request to `${API_URL}/<segment>/...`, relaying the Authorization header
 *   and the (first-party) cookie up to the backend, and relaying the backend's
 *   Set-Cookie back down — minus its `Domain` attribute so the browser binds
 *   it to this origin.
 *
 *   Only the `auth` and `admin` backend namespaces are reachable through here
 *   (the public `contact` / `track` / `blogs` endpoints have their own routes),
 *   so this can't be abused as an open relay to arbitrary backend paths.
 *
 *   `API_URL` is server-only (never shipped to the browser), so the backend URL
 *   stays private and no `NEXT_PUBLIC_` variable is required.
 */

import { NextRequest, NextResponse } from "next/server";

/** Backend base URL — server-only var, with dev fallback. */
const BACKEND =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

/** Backend namespaces this proxy is allowed to forward to. */
const ALLOWED_PREFIXES = new Set(["auth", "admin"]);

// Authed, cookie-bearing traffic must never be cached or statically optimised.
export const dynamic = "force-dynamic";

/**
 * Removes any `Domain=...` attribute from a Set-Cookie string so the cookie
 * binds to the current (frontend) host instead of the backend's domain — i.e.
 * makes it first-party. All other attributes (HttpOnly, Secure, SameSite,
 * Max-Age, Path, Expires) are preserved exactly as the backend set them.
 */
function stripCookieDomain(cookie: string): string {
  return cookie.replace(/;\s*Domain=[^;]*/i, "");
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  // Allowlist: only forward auth/admin namespaces.
  if (path.length === 0 || !ALLOWED_PREFIXES.has(path[0]!)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const target = `${BACKEND}/${path.join("/")}${req.nextUrl.search}`;

  // Forward only the headers the backend needs.
  const headers: Record<string, string> = {};
  const auth = req.headers.get("authorization");
  if (auth) headers["authorization"] = auth;
  const cookie = req.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;
  const contentType = req.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;
  // Preserve the real client IP so the backend's per-IP rate limiting and
  // geolocation stay accurate (it sees the Vercel server otherwise).
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
  if (ip) headers["x-forwarded-for"] = ip;

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  let backendRes: Response;
  try {
    backendRes = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await req.text() : undefined,
      redirect: "manual",
    });
  } catch {
    // The backend was unreachable (down, cold-starting, or network error).
    return NextResponse.json({ message: "Upstream unreachable" }, { status: 502 });
  }

  const res = new NextResponse(await backendRes.text(), {
    status: backendRes.status,
    headers: {
      "content-type": backendRes.headers.get("content-type") ?? "application/json",
    },
  });

  // Relay the refresh-token cookie to the browser as first-party.
  const setCookies = backendRes.headers.getSetCookie?.() ?? [];
  for (const c of setCookies) res.headers.append("set-cookie", stripCookieDomain(c));

  return res;
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
