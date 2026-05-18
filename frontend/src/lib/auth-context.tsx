"use client";

/**
 * auth-context.tsx
 *
 * React context that manages authentication state for the entire admin section.
 *
 * ROLE:
 *   This file owns all auth-related state and side effects:
 *     - The currently logged-in admin object.
 *     - The in-memory JWT access token (via `admin-api.ts`).
 *     - The `admin_auth` presence cookie used by the middleware route guard.
 *     - Login, logout, and silent token-refresh logic.
 *
 * WHY two separate stores (token in memory + a cookie)?
 *   - The access token is kept in memory (via `setAccessToken` in admin-api.ts)
 *     to protect it from XSS — it is never written to localStorage.
 *   - The `admin_auth=1` cookie is a plain, non-sensitive flag that:
 *       a) Tells `proxy.ts` (Next.js middleware) whether to let the request
 *          through to `/admin/*` pages on the server, before React even loads.
 *       b) Tells this context on page load whether to attempt a silent refresh.
 *     It carries NO secret; the actual session is the HttpOnly refresh-token
 *     cookie managed by the backend.
 *
 * WHY store the admin object in state?
 *   Admin UI pages need to display the logged-in user's name/email.  Keeping
 *   it in context avoids prop-drilling through every admin layout.
 *
 * HOW the refresh flow works on page load:
 *   1. `AuthProvider` mounts and checks for the `admin_auth=1` cookie.
 *   2. If absent → set `isLoading = false` and show the login page.
 *   3. If present → call `tryRefresh()`, which calls the backend `/auth/refresh`
 *      endpoint.  The backend validates the HttpOnly refresh-token cookie and
 *      returns a fresh access token.
 *   4. The new token is stored in memory; `isLoading` is set to `false`.
 *   5. `registerRefreshCallback(tryRefresh)` wires the same function into
 *      `admin-api.ts` so that any future 401 response triggers a silent refresh.
 *
 * HOW it fits in:
 *   - Wrap your admin layout with `<AuthProvider>`.
 *   - Any admin component that needs auth state calls `useAuth()`.
 *   - `admin-api.ts` is the HTTP layer; this file drives it.
 *   - `proxy.ts` is the server-side gate; this file maintains the cookie it reads.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminApi, registerRefreshCallback, setAccessToken } from "./admin-api";

/** Shape of a logged-in admin user. */
type Admin = { id: string; name: string; email: string };

/**
 * The value exposed by `AuthContext` to all consumer components.
 * `isLoading` is true while the initial silent-refresh attempt is in flight —
 * UI should render a loading state and not redirect prematurely.
 */
interface AuthState {
  admin: Admin | null; // null when unauthenticated.
  isLoading: boolean; // true during the initial auth check.
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * The React context object.  Initialised to `null` so that `useAuth()` can
 * detect when it is called outside of `<AuthProvider>`.
 */
const AuthContext = createContext<AuthState | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * `AuthProvider`
 *
 * Wraps the admin application and provides authentication state to all
 * descendant components via `useAuth()`.
 *
 * Mount this once, at the top of the admin layout tree.
 *
 * @param children - The admin page tree to render inside the auth boundary.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);

  // `isLoading` starts as `true` so that pages don't flash unauthenticated
  // content while the silent refresh is in flight.
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * Stores a new access token and marks the session as active.
   *
   * WHY write a cookie here?
   *   `proxy.ts` runs as Next.js middleware on the server before React loads.
   *   It can only read cookies, not in-memory state.  Writing `admin_auth=1`
   *   here tells the middleware that the user is authenticated, so it lets the
   *   request through to protected `/admin/*` pages.
   *   `max-age=604800` (7 days) matches a typical refresh-token lifetime.
   *
   * @param token     - Fresh JWT access token.
   * @param adminData - Admin profile returned by the login endpoint.
   */
  const applyToken = (token: string, adminData: Admin) => {
    setAccessToken(token); // Wire the token into the fetch wrapper.
    setAdmin(adminData); // Update React state so the UI reflects the logged-in user.
    // Write the presence flag cookie — NOT the token itself.
    document.cookie = "admin_auth=1; path=/; max-age=604800; samesite=strict";
  };

  /**
   * Clears all auth state: the in-memory token, the React admin state, and
   * the presence cookie.
   *
   * Setting `max-age=0` on the cookie deletes it immediately.
   * Wrapped in `useCallback` because it is used as a dependency in other
   * `useCallback` hooks.
   */
  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setAdmin(null);
    document.cookie = "admin_auth=; path=/; max-age=0"; // Deletes the cookie.
  }, []);

  /**
   * Attempts a silent token refresh using the backend's refresh endpoint.
   *
   * The refresh endpoint validates the HttpOnly refresh-token cookie that the
   * browser sends automatically (`credentials: "include"` in admin-api.ts).
   * On success the new token is stored in memory.
   * On failure auth state is cleared (user will be redirected to login by
   * proxy.ts on the next navigation).
   *
   * Returns the new token so it can also be used as the `_refreshCallback`
   * wired into `admin-api.ts`.
   *
   * @returns The new access token string, or `null` if the refresh failed.
   */
  const tryRefresh = useCallback(async (): Promise<string | null> => {
    try {
      const data = await adminApi.refresh();
      // Only update the token in the fetch wrapper — the admin object is not
      // returned by the refresh endpoint to keep the payload small.
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      // Refresh failed (e.g. refresh token expired) — treat as logged out.
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  /**
   * Wire `tryRefresh` into `admin-api.ts` so that any 401 response from any
   * API call automatically triggers a token refresh and a single retry.
   *
   * Re-runs whenever `tryRefresh` is recreated (which only happens if
   * `clearAuth` changes — i.e. essentially never after mount).
   */
  useEffect(() => {
    registerRefreshCallback(tryRefresh);
  }, [tryRefresh]);

  /**
   * On mount, check whether the user has an active session by looking for
   * the `admin_auth=1` presence cookie.
   *
   *   - Cookie absent → no session; skip the network call and show login.
   *   - Cookie present → attempt a silent refresh to rehydrate the access token
   *     into memory (it was lost on page reload).
   *
   * `isLoading` is cleared in the `finally` block so the UI never gets stuck
   * in a loading state, even if the refresh throws unexpectedly.
   */
  useEffect(() => {
    const hasCookie = document.cookie.includes("admin_auth=1");
    if (!hasCookie) {
      // No session at all — stop loading immediately.
      setIsLoading(false);
      return;
    }
    // Has a cookie — try to exchange it for a fresh access token.
    tryRefresh().finally(() => setIsLoading(false));
  }, [tryRefresh]);

  // ---------------------------------------------------------------------------
  // Public actions
  // ---------------------------------------------------------------------------

  /**
   * Logs the admin in with email and password.
   *
   * Calls the backend login endpoint, then stores the returned token and admin
   * profile via `applyToken`.  Throws on invalid credentials so the login form
   * can display the error.
   *
   * @param email    - Admin account email address.
   * @param password - Admin account password.
   */
  const login = useCallback(async (email: string, password: string) => {
    const data = await adminApi.login(email, password);
    applyToken(data.accessToken, data.admin);
  }, []);

  /**
   * Logs the admin out.
   *
   * Calls the backend logout endpoint (which invalidates the refresh-token
   * cookie server-side), then clears local auth state.  The `.catch(() => {})`
   * ensures the local state is cleared even if the network request fails (e.g.
   * if the user is already logged out server-side).
   */
  const logout = useCallback(async () => {
    await adminApi.logout().catch(() => {}); // Best-effort server-side invalidation.
    clearAuth();
  }, [clearAuth]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * `useAuth`
 *
 * Returns the current `AuthState` from `AuthContext`.
 *
 * MUST be called inside a component that is a descendant of `<AuthProvider>`.
 * Throws a descriptive error rather than returning `null` so misuse is caught
 * during development rather than causing a silent runtime failure.
 *
 * @returns The current auth state: `{ admin, isLoading, login, logout }`.
 * @throws If called outside of `<AuthProvider>`.
 *
 * @example
 * const { admin, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
