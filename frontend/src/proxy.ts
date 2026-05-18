/**
 * proxy.ts
 *
 * Next.js proxy that acts as the route guard for all /admin/* pages.
 * Next.js automatically picks up this file at `src/proxy.ts` and runs
 * the exported `proxy` function for every path matched by `config.matcher`.
 * (In Next.js 16 the `middleware.ts` convention was renamed to `proxy.ts`.)
 *
 * ROLE:
 *   This file is the server-side gatekeeper for the admin section.  It runs
 *   on the Next.js Edge Runtime before any page component or API route handler
 *   is executed.  Its only job is to redirect unauthenticated users away from
 *   protected pages.
 *
 * WHY middleware instead of per-page redirects?
 *   Putting the auth check here means it runs once, centrally, on every
 *   matching request — no risk of forgetting to add a redirect to a new admin
 *   page.  Because it runs on the Edge before the page is rendered, users never
 *   see a flash of protected content.
 *
 * HOW authentication is detected:
 *   The presence of the `admin_auth=1` cookie is used as a lightweight session
 *   indicator.  This cookie is written by `auth-context.tsx` (client side)
 *   after a successful login or silent token refresh.  It is NOT an
 *   HttpOnly cookie — it is intentionally readable by both JS and the server.
 *
 *   NOTE: This cookie carries NO secret; it is purely a presence flag.  The
 *   actual security is enforced by the Express backend, which validates the JWT
 *   access token on every authenticated API request.  If someone manually sets
 *   the cookie they will reach the admin UI but every API call will still fail
 *   with 401/403.
 *
 * HOW it fits in:
 *   - `auth-context.tsx` writes/deletes the cookie on login/logout.
 *   - This middleware reads the cookie on every incoming request.
 *   - `admin-api.ts` does NOT rely on this file — it operates independently
 *     using the in-memory JWT token.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Route guard middleware function.
 *
 * Inspects every request whose path matches `config.matcher`:
 *   - `/admin/login` is always allowed through so users can authenticate.
 *   - All other `/admin/*` paths require the `admin_auth=1` cookie.
 *   - Unauthenticated requests are redirected to `/admin/login`, preserving
 *     the original URL structure (same host/protocol) via `req.nextUrl.clone()`.
 *
 * @param req - The incoming Next.js edge request.
 * @returns A `NextResponse.redirect` to the login page if unauthenticated,
 *          or `NextResponse.next()` to allow the request through.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard all /admin/* routes, but explicitly allow /admin/login so users
  // are never trapped in a redirect loop when they try to authenticate.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for the presence flag cookie written by auth-context.tsx.
    // The value must be exactly "1" — an empty or absent cookie is not enough.
    const isLoggedIn = req.cookies.get("admin_auth")?.value === "1";

    if (!isLoggedIn) {
      // Clone the current URL to inherit the correct host/protocol, then
      // change only the pathname so the redirect always points to the right
      // environment (localhost in dev, the production domain in prod).
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Cookie is present and valid, or the path is /admin/login — allow through.
  return NextResponse.next();
}

/**
 * Next.js middleware configuration.
 *
 * `matcher` limits which routes this middleware runs on.  Using
 * `/admin/:path*` ensures the middleware is skipped entirely for public pages
 * (home, events, blog, etc.), keeping those routes fast.
 *
 * The `:path*` wildcard matches both `/admin` itself and any sub-path such as
 * `/admin/dashboard`, `/admin/contacts`, `/admin/login`, etc.
 */
export const config = {
  matcher: ["/admin/:path*"],
};
