/**
 * analytics.service.ts
 *
 * Business-logic layer for the analytics module.
 *
 * ROLE:
 *   This file sits between the HTTP controller (analytics.controller.ts) and the
 *   database (analytics.repository.ts).  Its primary job is input validation and
 *   sanitisation — turning raw, untrusted values that arrive from query strings
 *   into safe, typed values before they reach the database layer.
 *
 * WHY a service layer at all?
 *   For simple read-only analytics the service is intentionally thin.  Having
 *   it here establishes a clean boundary so future logic (caching, aggregation
 *   across multiple repositories, permission checks) can be added without
 *   touching the controller or the repository.
 *
 * HOW it fits in:
 *   analytics.controller.ts → analytics.service.ts → analytics.repository.ts
 *   The controller passes raw Express request data in; the service returns
 *   validated, shaped data out.
 */

import * as analyticsRepo from "./analytics.repository.ts";

/**
 * Exhaustive list of period strings the API accepts.
 * Declared `as const` so TypeScript narrows the inferred element type to a
 * string-literal union rather than `string`.
 */
const VALID_PERIODS = ["today", "yesterday", "week", "month", "year"] as const;

/** Union type derived from the VALID_PERIODS tuple. */
type Period = (typeof VALID_PERIODS)[number];

/**
 * Validates and normalises a raw, potentially untrusted `period` query param.
 *
 * WHY return a default instead of throwing?
 *   Analytics is a read-only, non-destructive operation.  Defaulting to
 *   `'today'` on bad input is more user-friendly than a 400 error for what is
 *   essentially a display preference.
 *
 * @param raw - The raw value from `req.query`, which may be `undefined`,
 *              an array, or an arbitrary string.
 * @returns A validated `Period` value, or `'today'` as a safe fallback.
 */
function parsePeriod(raw: unknown): Period {
  if (typeof raw === "string" && VALID_PERIODS.includes(raw as Period)) {
    return raw as Period;
  }
  // Any other value (undefined, array, unrecognised string) → safe default.
  return "today";
}

// ---------------------------------------------------------------------------
// Public service functions — one per analytics endpoint
// ---------------------------------------------------------------------------

/**
 * Returns the headline overview numbers for the admin dashboard.
 *
 * @returns See `analytics.repository.getOverview` for the return shape.
 */
export async function getOverview() {
  return analyticsRepo.getOverview();
}

/**
 * Returns submission counts for a given time period after sanitising the
 * raw query-string value.
 *
 * @param rawPeriod - Untrusted value from `req.query['period']`.
 * @returns `{ period, contacts, registrations, total }`.
 */
export async function getNewSubmissions(rawPeriod: unknown) {
  // parsePeriod guarantees the repository only ever receives a valid Period.
  return analyticsRepo.getNewSubmissions(parsePeriod(rawPeriod));
}

/**
 * Returns the day-by-day contact submission trend for the last 30 days.
 *
 * The window is hardcoded to 30 here; if the UI ever needs a configurable
 * range, add a `days` parameter and validate it in this function.
 *
 * @returns Array of `{ date: "YYYY-MM-DD", count: number }`.
 */
export async function getContactTrend() {
  return analyticsRepo.getContactTrend(30);
}

/**
 * Returns per-event registration counts for the 10 most-recent events.
 *
 * @returns Array of `{ eventId, title, city, registrations }`.
 */
export async function getRegistrationTrend() {
  return analyticsRepo.getRegistrationTrend();
}

/**
 * Returns contact submission counts grouped by workflow status.
 *
 * @returns Array of `{ status, count }`.
 */
export async function getStatusBreakdown() {
  return analyticsRepo.getStatusBreakdown();
}

/**
 * Returns the top 10 cities ranked by event registration volume.
 *
 * @returns Array of `{ city, count }` sorted descending.
 */
export async function getTopCities() {
  return analyticsRepo.getTopCities();
}

// ---------------------------------------------------------------------------
// Page-view / visitor analytics
// ---------------------------------------------------------------------------

export async function getActiveUsers() {
  return analyticsRepo.getActiveUsers();
}

export async function getActiveUsersTrend() {
  return analyticsRepo.getActiveUsersTrend(30);
}

export async function getVisitorsByCity() {
  return analyticsRepo.getVisitorsByCity();
}

export async function getVisitorsByCountry() {
  return analyticsRepo.getVisitorsByCountry();
}

export async function getTrafficSources() {
  return analyticsRepo.getTrafficSources();
}

export async function getPageViewsBySection() {
  return analyticsRepo.getPageViewsBySection(30);
}

export async function getFormConversion() {
  return analyticsRepo.getFormConversion(30);
}

/**
 * Returns a high-level summary across all events in the system.
 *
 * @returns Status counts, total registrations, and average registrations per event.
 */
export async function getEventsOverview() {
  return analyticsRepo.getEventsOverview();
}

/**
 * Returns detailed analytics for a specific event.
 *
 * @param eventId - UUID of the target event.
 * @returns Full event analytics object, or `null` if the event does not exist.
 */
export async function getEventAnalytics(eventId: string) {
  return analyticsRepo.getEventAnalytics(eventId);
}
