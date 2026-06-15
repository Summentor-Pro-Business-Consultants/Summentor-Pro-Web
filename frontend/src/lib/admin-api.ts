/**
 * admin-api.ts
 *
 * Typed fetch wrapper used by every admin frontend page to communicate with
 * the Summentor Pro Express backend.
 *
 * ROLE:
 *   This module is the single HTTP client for the entire admin section.  It
 *   handles:
 *     - Attaching the in-memory JWT access token to every request.
 *     - Automatically refreshing the token on a 401 response and retrying the
 *       original request exactly once.
 *     - Throwing a normalised `Error` on any non-OK response so callers can
 *       use a simple try/catch.
 *     - Exposing a strongly-typed `adminApi` object that maps every backend
 *       endpoint to a typed async function.
 *
 * WHY keep the token in memory (not localStorage)?
 *   Storing JWTs in localStorage exposes them to XSS attacks.  An in-memory
 *   variable (`_accessToken`) is only accessible to this module and is wiped
 *   on page refresh, which is intentional — the auth context re-hydrates it
 *   from a short-lived HttpOnly-style session cookie via the refresh endpoint.
 *
 * HOW the refresh flow works:
 *   1. `auth-context.tsx` calls `registerRefreshCallback(tryRefresh)` on
 *      mount, wiring in its own `tryRefresh` function.
 *   2. When `request()` receives a 401, it calls `_refreshCallback()`.
 *   3. If the refresh succeeds, the new token is stored via `setAccessToken`
 *      and the original request is retried once (the `retry = false` guard
 *      prevents infinite loops).
 *   4. If the refresh fails, auth-context clears state and the user is
 *      redirected to the login page by the route guard (proxy.ts).
 *
 * HOW it fits in:
 *   auth-context.tsx registers the refresh callback and calls
 *   `setAccessToken` after login.  Admin page components import `adminApi`
 *   and call its methods directly.
 */

/** Base URL for all backend API calls. Falls back to localhost for local dev. */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

/**
 * Error thrown for any non-OK HTTP response, carrying the status code so the
 * UI can react differently to a 401 (bad credentials), 429 (rate limited), or
 * 5xx (server error). A failed `fetch()` (server unreachable) rejects with a
 * plain `TypeError` instead — it has no `status`, which the UI treats as a
 * connectivity problem.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * In-memory access token storage.
 * Intentionally module-scoped (not exported) to prevent direct mutation from
 * outside this file — use `setAccessToken` instead.
 */
let _accessToken: string | null = null;

/**
 * Optional callback registered by `auth-context.tsx` that attempts to obtain a
 * fresh access token using the HttpOnly refresh-token cookie.
 * `null` until `registerRefreshCallback` is called during app bootstrap.
 */
let _refreshCallback: (() => Promise<string | null>) | null = null;

/**
 * Stores (or clears) the in-memory access token.
 * Called by `auth-context.tsx` after a successful login or token refresh,
 * and with `null` during logout.
 *
 * @param token - The new JWT access token, or `null` to clear it.
 */
export function setAccessToken(token: string | null) {
  _accessToken = token;
}

/**
 * Registers the function that `request()` should call when it receives a 401.
 * Must be called once during app initialisation (inside AuthProvider's
 * `useEffect`) so that the token-refresh flow is wired up before any API
 * requests are made.
 *
 * @param cb - An async function that attempts to refresh the session and
 *             returns the new access token, or `null` on failure.
 */
export function registerRefreshCallback(cb: () => Promise<string | null>) {
  _refreshCallback = cb;
}

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------

/**
 * Generic authenticated fetch wrapper used by all `adminApi` methods.
 *
 * Behaviour:
 *   - Merges caller-supplied headers with `Content-Type: application/json`.
 *   - Injects `Authorization: Bearer <token>` when a token is present.
 *   - On 401: attempts a token refresh (once) and retries the request.
 *   - On any non-OK response: parses the error body and throws an `Error`.
 *   - On 204 No Content: returns `undefined` cast to `T` (caller should
 *     declare `T = unknown` or `void` in this case).
 *   - Otherwise: unwraps the backend's `{ data: T }` envelope and returns `T`.
 *
 * @param path    - Path relative to `API_BASE` (e.g. `"/auth/login"`).
 * @param options - Standard `RequestInit` options (method, body, credentials…).
 * @param retry   - Internal flag; set to `false` on the retry to prevent
 *                  infinite refresh loops.
 * @returns The `data` field from the backend's JSON envelope.
 * @throws  `Error` with the backend's `message` field on non-OK responses.
 */
async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  // Build headers, spreading any caller-provided ones first so they can be
  // overridden by the defaults if needed.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach the bearer token when we have one.
  if (_accessToken) headers["Authorization"] = `Bearer ${_accessToken}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // --- Token-refresh + retry on 401 ---
  // Only attempt the refresh if:
  //   a) The server returned 401 (Unauthorized / token expired).
  //   b) This is the first attempt (`retry === true`), preventing loops.
  //   c) A refresh callback has been registered.
  // Skip the refresh-retry for the auth endpoints themselves: a 401 from
  // /auth/login means wrong credentials (not an expired token), and refreshing
  // /auth/refresh would recurse. Those paths surface their 401 directly.
  if (res.status === 401 && retry && _refreshCallback && !path.startsWith("/auth/")) {
    const newToken = await _refreshCallback();
    if (newToken) {
      // Token was refreshed successfully (`setAccessToken` was already called
      // inside the callback); retry the original request with the new token.
      return request<T>(path, options, false);
    }
    // If refresh failed, `_refreshCallback` will have cleared auth state.
    // Fall through so the 401 error is thrown below.
  }

  // --- Error handling ---
  if (!res.ok) {
    // Attempt to parse the backend's error envelope; fall back to a generic
    // message if the response body is not valid JSON.
    const body = await res.json().catch(() => ({ message: "Request failed" }));
    // Attach the HTTP status so callers can distinguish a 401 (wrong
    // credentials) from a 5xx (server error) or 429 (rate limited). A network
    // failure never reaches here — fetch() rejects first with a TypeError that
    // carries no `status`, which callers treat as a connectivity error.
    throw new ApiError((body as { message?: string }).message ?? "Request failed", res.status);
  }

  // --- 204 No Content — nothing to parse ---
  if (res.status === 204) return undefined as T;

  // Unwrap the backend's standard `{ data: T }` envelope.
  const json = (await res.json()) as { data: T };
  return json.data;
}

// ---------------------------------------------------------------------------
// Public API surface
// ---------------------------------------------------------------------------

/**
 * Strongly-typed collection of all backend endpoints used by the admin UI.
 *
 * Methods are grouped by domain.  Each method is a thin wrapper around
 * `request<T>()` with the correct HTTP verb, path, and return type.
 *
 * ADDING A NEW ENDPOINT:
 *   1. Add a new method in the appropriate group below.
 *   2. Specify the generic type parameter so TypeScript knows the return shape.
 *   3. Use `credentials: "include"` for auth endpoints that rely on cookies.
 */
export const adminApi = {
  // --------------------------------------------------------------------------
  // Auth — all auth requests include `credentials: "include"` so the browser
  // sends/receives the HttpOnly refresh-token cookie automatically.
  // --------------------------------------------------------------------------

  /** Exchanges email + password for an access token and sets the auth cookie. */
  login: (email: string, password: string) =>
    request<{ accessToken: string; admin: { id: string; name: string; email: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }), credentials: "include" },
    ),

  /** Uses the refresh-token cookie to obtain a new access token. */
  refresh: () =>
    request<{ accessToken: string }>("/auth/refresh", { method: "POST", credentials: "include" }),

  /** Invalidates the server-side refresh token and clears the auth cookie. */
  logout: () => request<unknown>("/auth/logout", { method: "POST", credentials: "include" }),

  // --------------------------------------------------------------------------
  // Analytics
  // --------------------------------------------------------------------------

  /** Headline KPIs for the admin dashboard overview card. */
  overview: () => request<Record<string, number>>("/admin/analytics/overview"),

  /**
   * Submission counts for the given time period.
   * @param period - One of: `today`, `yesterday`, `week`, `month`, `year`.
   */
  newSubmissions: (period: string) =>
    request<Record<string, unknown>>(`/admin/analytics/new-submissions?period=${period}`),

  /** Day-by-day contact submission series for the last 30 days. */
  contactTrend: () =>
    request<Array<{ date: string; count: number }>>("/admin/analytics/contact-trend"),

  /** Top 10 most-recent events with their total registration counts. */
  registrationTrend: () =>
    request<Array<{ eventId: string; title: string; city: string; registrations: number }>>(
      "/admin/analytics/registration-trend",
    ),

  /** Contact submissions grouped by workflow status (new/reviewed/replied). */
  statusBreakdown: () =>
    request<Array<{ status: string; count: number }>>("/admin/analytics/status-breakdown"),

  /** Top 10 cities by event registration volume. */
  topCities: () => request<Array<{ city: string; count: number }>>("/admin/analytics/cities"),

  // --------------------------------------------------------------------------
  // Contacts
  // --------------------------------------------------------------------------

  /**
   * Fetches a paginated list of contact submissions.
   * @param params - Query params (e.g. `{ page: 1, limit: 20, status: "new" }`).
   */
  listContacts: (params: Record<string, string | number>) =>
    request<{ data: unknown[]; total: number }>(
      "/admin/contacts?" + new URLSearchParams(params as Record<string, string>).toString(),
    ),

  /**
   * Updates the workflow status of a single contact submission.
   * @param id     - Contact submission UUID.
   * @param status - New status value (`new`, `reviewed`, or `replied`).
   */
  updateContactStatus: (id: string, status: string) =>
    request<unknown>(`/admin/contacts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  /** Permanently deletes a contact submission. */
  deleteContact: (id: string) => request<unknown>(`/admin/contacts/${id}`, { method: "DELETE" }),

  // --------------------------------------------------------------------------
  // Events
  // --------------------------------------------------------------------------

  /**
   * Fetches a paginated, filterable list of events.
   * @param params - Query params (e.g. `{ page: 1, status: "upcoming" }`).
   */
  listEvents: (params: Record<string, string | number> = {}) =>
    request<{ data: unknown[]; total: number }>(
      "/admin/events?" + new URLSearchParams(params as Record<string, string>).toString(),
    ),

  /** Creates a new event. */
  createEvent: (data: unknown) =>
    request<unknown>("/admin/events", { method: "POST", body: JSON.stringify(data) }),

  /** Partially updates an existing event. */
  updateEvent: (id: string, data: unknown) =>
    request<unknown>(`/admin/events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  /** Permanently deletes an event. */
  deleteEvent: (id: string) => request<unknown>(`/admin/events/${id}`, { method: "DELETE" }),

  /**
   * Returns registrations for a specific event.
   * @param id     - Event UUID.
   * @param params - Optional pagination/filter params.
   */
  getEventRegistrations: (id: string, params: Record<string, string | number> = {}) =>
    request<{ data: unknown[]; total: number }>(
      `/admin/events/${id}/registrations?` +
        new URLSearchParams(params as Record<string, string>).toString(),
    ),

  // --------------------------------------------------------------------------
  // Registrations
  // --------------------------------------------------------------------------

  /**
   * Fetches a paginated list of all event registrations across all events.
   * @param params - Optional pagination/filter params.
   */
  listRegistrations: (params: Record<string, string | number> = {}) =>
    request<{ data: unknown[]; total: number }>(
      "/admin/registrations?" + new URLSearchParams(params as Record<string, string>).toString(),
    ),

  /**
   * Updates the status of a single event registration.
   * @param id     - Registration UUID.
   * @param status - New status (`pending`, `confirmed`, `attended`, `cancelled`).
   */
  updateRegistrationStatus: (id: string, status: string) =>
    request<unknown>(`/admin/registrations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // --------------------------------------------------------------------------
  // Events analytics (separate from the general analytics group above)
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // Visitor / page-view analytics
  // --------------------------------------------------------------------------

  /** Unique visitor counts for today and the past 7 days. */
  activeUsers: () => request<Record<string, number>>("/admin/analytics/active-users"),

  /** Daily unique visitor counts for the last 30 days. */
  activeUsersTrend: () =>
    request<Array<{ date: string; count: number }>>("/admin/analytics/active-users-trend"),

  /** Top 10 cities by page view count (from visitor IP geolocation). */
  visitorsByCity: () =>
    request<Array<{ city: string; count: number }>>("/admin/analytics/visitors-by-city"),

  /** Top 10 countries by page view count. */
  visitorsByCountry: () =>
    request<Array<{ country: string; count: number }>>("/admin/analytics/visitors-by-country"),

  /** Traffic source breakdown (direct, instagram, chatgpt, google, etc.). */
  trafficSources: () =>
    request<Array<{ source: string; count: number }>>("/admin/analytics/traffic-sources"),

  /** Page view counts grouped by site section (Home, Events, Connect, etc.). */
  pageViewsBySection: () =>
    request<Array<{ page: string; count: number }>>("/admin/analytics/page-views-by-section"),

  /** Form conversion funnel: page views → submissions, with conversion rate. */
  formConversion: () => request<Record<string, number>>("/admin/analytics/form-conversion"),

  /** System-wide event stats: counts by status and average registrations per event. */
  eventsOverview: () => request<Record<string, number>>("/admin/analytics/events-overview"),

  /**
   * Detailed analytics for a single event.
   * @param id - Event UUID.
   */
  eventAnalytics: (id: string) => request<Record<string, unknown>>(`/admin/analytics/events/${id}`),

  // --------------------------------------------------------------------------
  // Blogs
  // --------------------------------------------------------------------------

  /**
   * Fetches a paginated list of blog posts.
   * @param params - Optional pagination/filter params.
   */
  listBlogs: (params: Record<string, string | number> = {}) =>
    request<{ data: unknown[]; total: number }>(
      "/admin/blogs?" + new URLSearchParams(params as Record<string, string>).toString(),
    ),

  /** Fetches a single blog post by ID. */
  getBlog: (id: string) => request<unknown>(`/admin/blogs/${id}`),

  /** Creates a new blog post. */
  createBlog: (data: unknown) =>
    request<unknown>("/admin/blogs", { method: "POST", body: JSON.stringify(data) }),

  /** Partially updates an existing blog post. */
  updateBlog: (id: string, data: unknown) =>
    request<unknown>(`/admin/blogs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  /** Permanently deletes a blog post. */
  deleteBlog: (id: string) => request<unknown>(`/admin/blogs/${id}`, { method: "DELETE" }),
};
