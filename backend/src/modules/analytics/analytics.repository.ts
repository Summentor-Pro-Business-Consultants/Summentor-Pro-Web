/**
 * analytics.repository.ts
 *
 * Direct database access layer for all analytics queries.
 *
 * ROLE:
 *   This is the only file in the analytics module that talks to the database.
 *   Every function here issues one or more Prisma queries and returns plain
 *   data objects — no business logic, no HTTP concerns.
 *
 * WHY a separate repository?
 *   Keeping DB queries isolated makes them easy to unit-test (swap Prisma for a
 *   mock), easy to optimise (add raw SQL here without touching anything else),
 *   and easy to read — each function answers one specific data question.
 *
 * HOW it fits in:
 *   analytics.service.ts calls these functions after validating/sanitising
 *   inputs. The service is the only consumer; nothing else imports this file
 *   directly.
 */

import { prisma } from "../../infrastructure/db/prisma.client.ts";

/** The set of named time windows supported by the "new submissions" endpoint. */
type Period = "today" | "yesterday" | "week" | "month" | "year";

/**
 * Translates a human-readable `Period` name into a concrete `{ start, end }`
 * date range that can be passed directly to Prisma `where` clauses.
 *
 * WHY this helper?
 *   Multiple repository functions need date-bounded queries.  Centralising the
 *   arithmetic here prevents drift if the definition of "week" ever changes.
 *
 * @param period - One of the Period union members.
 * @returns An object with `start` (inclusive) and `end` (exclusive) Date values.
 */
function getPeriodBounds(period: Period): { start: Date; end: Date } {
  // Strip the time component so every period starts at midnight local time.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case "today":
      // From midnight this morning up to the exact current moment.
      return { start: today, end: now };
    case "yesterday": {
      const start = new Date(today);
      start.setDate(start.getDate() - 1); // Roll back one calendar day.
      return { start, end: today }; // Ends at midnight = start of today.
    }
    case "week": {
      const start = new Date(today);
      start.setDate(start.getDate() - 7); // Rolling 7-day window.
      return { start, end: now };
    }
    case "month": {
      const start = new Date(today);
      start.setMonth(start.getMonth() - 1); // Rolling 30/31-day window.
      return { start, end: now };
    }
    case "year": {
      const start = new Date(today);
      start.setFullYear(start.getFullYear() - 1); // Rolling 365/366-day window.
      return { start, end: now };
    }
  }
}

// ---------------------------------------------------------------------------
// Dashboard overview
// ---------------------------------------------------------------------------

/**
 * Returns the headline numbers shown on the admin dashboard overview card.
 *
 * Fires five COUNT queries in parallel via `Promise.all` to minimise latency.
 * The returned `newToday` field is a convenience sum of the two "today" counts
 * so the UI does not need to add them itself.
 *
 * @returns Aggregate counts: total contacts, total registrations, upcoming
 *          events, and today's activity split by type.
 */
export async function getOverview() {
  // todayStart is midnight of the current calendar day (local time).
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Run all five COUNT queries in parallel — each is independent.
  const [
    totalContacts,
    totalRegistrations,
    upcomingEvents,
    newContactsToday,
    newRegistrationsToday,
  ] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.eventRegistration.count(),
    prisma.event.count({ where: { status: "upcoming" } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.eventRegistration.count({ where: { createdAt: { gte: todayStart } } }),
  ]);

  return {
    totalContacts,
    totalRegistrations,
    upcomingEvents,
    newContactsToday,
    newRegistrationsToday,
    // Convenience roll-up so the dashboard can show a single "activity today" badge.
    newToday: newContactsToday + newRegistrationsToday,
  };
}

// ---------------------------------------------------------------------------
// Submission counts
// ---------------------------------------------------------------------------

/**
 * Counts contact form submissions and event registrations within the given
 * time period.
 *
 * @param period - A validated `Period` value from `analytics.service.ts`.
 * @returns `{ period, contacts, registrations, total }` — the two counts plus
 *          their sum, so callers can use whichever granularity they need.
 */
export async function getNewSubmissions(period: Period) {
  const { start, end } = getPeriodBounds(period);

  // Count both submission types concurrently for the same date window.
  const [contacts, registrations] = await Promise.all([
    prisma.contactSubmission.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.eventRegistration.count({ where: { createdAt: { gte: start, lte: end } } }),
  ]);
  return { period, contacts, registrations, total: contacts + registrations };
}

// ---------------------------------------------------------------------------
// Time-series charts
// ---------------------------------------------------------------------------

/**
 * Builds a day-by-day contact submission count for the last `days` calendar
 * days, suitable for rendering a line or bar chart.
 *
 * WHY fetch raw rows instead of using a GROUP BY?
 *   Prisma's current API does not expose a portable date-truncation function.
 *   Fetching only `createdAt` and grouping in JS is fast enough for typical
 *   contact volumes and keeps the code database-agnostic.
 *
 * @param days - How many calendar days to look back (default: 30).
 * @returns An array of `{ date: "YYYY-MM-DD", count: number }` objects, one
 *          per day, sorted oldest-first, with zero-filled gaps.
 */
export async function getContactTrend(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days); // Rolling window start.

  // Pull only the timestamp column to minimise data transfer.
  const contacts = await prisma.contactSubmission.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // --- Group raw rows into a date → count map ---
  const byDate: Record<string, number> = {};
  for (const c of contacts) {
    // `split('T')[0]` extracts the "YYYY-MM-DD" prefix of an ISO-8601 string.
    const key = c.createdAt.toISOString().split("T")[0]!;
    byDate[key] = (byDate[key] ?? 0) + 1;
  }

  // --- Generate a complete, zero-filled array for every day in the window ---
  // Iterating from (days-1) down to 0 produces oldest-first ordering.
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0]!;
    // Default to 0 so the chart has a data point for every day, even quiet ones.
    result.push({ date: key, count: byDate[key] ?? 0 });
  }
  return result;
}

/**
 * Returns the top 10 most-recent events with their total registration counts,
 * used to render a "registrations per event" bar chart.
 *
 * WHY `_count` instead of a raw SQL JOIN?
 *   Prisma's relational count syntax (`_count: { select: { registrations: true } }`)
 *   compiles to an efficient single-query COUNT with GROUP BY under the hood.
 *
 * @returns Array of `{ eventId, title, city, registrations }`, most-recent first.
 */
export async function getRegistrationTrend() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      city: true,
      // Ask Prisma to include the count of related registrations in the same query.
      _count: { select: { registrations: true } },
    },
    orderBy: { eventDate: "desc" }, // Most recent events first.
    take: 10, // Cap at 10 to keep the chart readable.
  });

  // Flatten _count.registrations into a top-level field for easier consumption.
  return events.map((e) => ({
    eventId: e.id,
    title: e.title,
    city: e.city,
    registrations: e._count.registrations,
  }));
}

// ---------------------------------------------------------------------------
// Breakdowns & distributions
// ---------------------------------------------------------------------------

/**
 * Counts contact submissions grouped by their workflow status
 * (`new`, `reviewed`, `replied`), used for the status distribution chart.
 *
 * WHY run three separate COUNTs instead of a GROUP BY?
 *   Prisma does not expose a groupBy+count shorthand for string enum fields in
 *   all adapters.  Three lightweight COUNT queries issued in parallel is
 *   equivalent in cost and makes the status list explicit and type-safe.
 *
 * @returns Array of `{ status, count }` — one entry per status, in declaration order.
 */
export async function getStatusBreakdown() {
  const statuses = ["new", "reviewed", "replied"];

  // Fire all three COUNTs at the same time.
  const counts = await Promise.all(
    statuses.map((s) => prisma.contactSubmission.count({ where: { status: s } })),
  );
  return statuses.map((status, i) => ({ status, count: counts[i]! }));
}

/**
 * Returns the top 10 cities by number of event registrations.
 *
 * WHY aggregate in JS instead of SQL?
 *   City is stored on the `Event` model, not on `EventRegistration`.  A SQL
 *   GROUP BY would require a JOIN; fetching the joined city field and grouping
 *   in memory is simpler and well within the row counts expected here.
 *
 * @returns Array of `{ city, count }` sorted descending by count, capped at 10.
 */
export async function getTopCities() {
  // Fetch just the city of each registration's parent event.
  const registrations = await prisma.eventRegistration.findMany({
    select: { event: { select: { city: true } } },
  });

  // --- Tally registrations per city ---
  const cityCount: Record<string, number> = {};
  for (const r of registrations) {
    const city = r.event.city;
    cityCount[city] = (cityCount[city] ?? 0) + 1;
  }

  // Sort descending, take top 10, reshape to a clean array.
  return Object.entries(cityCount)
    .sort(([, a], [, b]) => b - a) // Descending by count.
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));
}

// ---------------------------------------------------------------------------
// Page-view analytics (visitor tracking)
// ---------------------------------------------------------------------------

/**
 * Returns unique visitor counts for today and the past 7 days, derived from
 * the page_views table's sessionId column.
 */
export async function getActiveUsers() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  // Fetch all four counts in parallel.
  // Unique visitor counts are derived in JS by deduplicating sessionIds in a Set
  // rather than using Prisma's `distinct` — Prisma 7 requires the primary key in
  // the select when distinct is used, making JS deduplication the safer approach.
  const [pageViewsToday, pageViewsPastWeek, todayRows, weekRows] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: todayStart }, sessionId: { not: null } },
      select: { sessionId: true },
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: weekStart }, sessionId: { not: null } },
      select: { sessionId: true },
    }),
  ]);

  return {
    pageViewsToday,
    pageViewsPastWeek,
    uniqueUsersToday: new Set(todayRows.map((r) => r.sessionId)).size,
    uniqueUsersPastWeek: new Set(weekRows.map((r) => r.sessionId)).size,
  };
}

/**
 * Builds a day-by-day unique-visitor count for the last `days` days,
 * suitable for a "users over time" line chart.
 */
export async function getActiveUsersTrend(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, sessionId: true },
    orderBy: { createdAt: "asc" },
  });

  // Group sessions by calendar day, deduplicating by sessionId
  const byDate: Record<string, Set<string>> = {};
  for (const v of views) {
    const key = v.createdAt.toISOString().split("T")[0]!;
    if (!byDate[key]) byDate[key] = new Set();
    if (v.sessionId) byDate[key]!.add(v.sessionId);
  }

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0]!;
    result.push({ date: key, count: byDate[key]?.size ?? 0 });
  }
  return result;
}

/**
 * Returns the top 10 cities ranked by page view count.
 * Uses the city field recorded from the visitor's IP during tracking.
 */
export async function getVisitorsByCity() {
  const views = await prisma.pageView.findMany({
    where: { city: { not: null } },
    select: { city: true },
  });

  const tally: Record<string, number> = {};
  for (const v of views) {
    const c = v.city!;
    tally[c] = (tally[c] ?? 0) + 1;
  }

  return Object.entries(tally)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));
}

/**
 * Returns the top 10 countries ranked by page view count.
 */
export async function getVisitorsByCountry() {
  const views = await prisma.pageView.findMany({
    where: { country: { not: null } },
    select: { country: true },
  });

  const tally: Record<string, number> = {};
  for (const v of views) {
    const c = v.country!;
    tally[c] = (tally[c] ?? 0) + 1;
  }

  return Object.entries(tally)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));
}

/**
 * Returns the breakdown of page views by traffic source (direct, instagram,
 * chatgpt, google, linkedin, twitter, other). Zero-count sources are omitted.
 */
export async function getTrafficSources() {
  const sources = ["direct", "instagram", "chatgpt", "google", "linkedin", "twitter", "other"];
  const counts = await Promise.all(
    sources.map((s) => prisma.pageView.count({ where: { source: s } })),
  );
  return sources.map((source, i) => ({ source, count: counts[i]! })).filter((s) => s.count > 0);
}

/**
 * Returns page view counts grouped by site section (Home, Events, Connect, etc.)
 * for the last `days` days. Used for a "pages visited" breakdown chart.
 */
export async function getPageViewsBySection(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { path: true },
  });

  const sections = [
    { key: "Home", match: (p: string) => p === "/" },
    { key: "Events", match: (p: string) => p.startsWith("/events") },
    { key: "Connect", match: (p: string) => p.startsWith("/contact") },
    { key: "Insights", match: (p: string) => p.startsWith("/blogs") },
    { key: "Services", match: (p: string) => p.startsWith("/services") },
    { key: "About", match: (p: string) => p.startsWith("/about") },
  ];

  const tally: Record<string, number> = {};
  for (const v of views) {
    for (const s of sections) {
      if (s.match(v.path)) {
        tally[s.key] = (tally[s.key] ?? 0) + 1;
        break;
      }
    }
  }

  return sections
    .filter((s) => tally[s.key])
    .map((s) => ({ page: s.key, count: tally[s.key]! }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Returns a form conversion funnel for the last `days` days:
 *   - Contact page views (path contains /contact or /events/*)
 *   - Actual form submissions (contact + registration records)
 *   - Conversion rate (submissions / page views × 100)
 */
export async function getFormConversion(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [contactPageViews, eventPageViews, contactSubmissions, eventRegistrations] =
    await Promise.all([
      // startsWith avoids matching unrelated paths like "/contact-old" or "/contact-confirmation"
      prisma.pageView.count({
        where: { path: { startsWith: "/contact" }, createdAt: { gte: since } },
      }),
      // startsWith '/events' (no trailing slash) catches both /events and /events/some-id
      prisma.pageView.count({
        where: { path: { startsWith: "/events" }, createdAt: { gte: since } },
      }),
      prisma.contactSubmission.count({ where: { createdAt: { gte: since } } }),
      prisma.eventRegistration.count({ where: { createdAt: { gte: since } } }),
    ]);

  const totalPageViews = contactPageViews + eventPageViews;
  const totalSubmissions = contactSubmissions + eventRegistrations;

  return {
    contactPageViews,
    eventPageViews,
    totalPageViews,
    contactSubmissions,
    eventRegistrations,
    totalSubmissions,
    conversionRate: totalPageViews > 0 ? Math.round((totalSubmissions / totalPageViews) * 100) : 0,
  };
}

// ---------------------------------------------------------------------------
// Events module analytics
// ---------------------------------------------------------------------------

/**
 * Returns a high-level summary of all events in the system, broken down by
 * status, along with the average registrations per (non-cancelled) event.
 *
 * All seven queries run in parallel.
 *
 * @returns Counts by status plus `avgRegistrationsPerEvent` (0 when no events exist).
 */
export async function getEventsOverview() {
  // Parallelise all queries — they are fully independent.
  const [total, upcoming, ongoing, completed, cancelled, totalRegistrations, events] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: "upcoming" } }),
      prisma.event.count({ where: { status: "ongoing" } }),
      prisma.event.count({ where: { status: "completed" } }),
      prisma.event.count({ where: { status: "cancelled" } }),
      prisma.eventRegistration.count(),
      // Exclude cancelled events from the average to avoid skewing the number.
      prisma.event.count({ where: { status: { not: "cancelled" } } }),
    ]);

  return {
    totalEvents: total,
    upcomingEvents: upcoming,
    ongoingEvents: ongoing,
    completedEvents: completed,
    cancelledEvents: cancelled,
    totalRegistrations,
    // Guard against division by zero when the events table is empty.
    avgRegistrationsPerEvent: events > 0 ? Math.round(totalRegistrations / events) : 0,
  };
}

/**
 * Fetches detailed analytics for a single event, including its registration
 * status breakdown, capacity utilisation, and the eight most-recent sign-ups.
 *
 * @param eventId - The UUID of the event to analyse.
 * @returns A rich object with event metadata, status counts, capacity percentage,
 *          and recent registrations, or `null` if the event does not exist.
 */
export async function getEventAnalytics(eventId: string) {
  // First, confirm the event exists and fetch the fields we need for the response.
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      city: true,
      venue: true,
      eventDate: true,
      tag: true,
      status: true,
      capacity: true, // Used to compute the fill-rate percentage below.
    },
  });

  // Return null early; the controller will convert this to a 404.
  if (!event) return null;

  const regStatuses = ["pending", "confirmed", "attended", "cancelled"];

  // Run all three secondary queries in parallel once we know the event exists.
  const [statusCounts, recentRegistrations, totalRegistrations] = await Promise.all([
    // One COUNT per registration status — fire them all at once.
    Promise.all(
      regStatuses.map((s) => prisma.eventRegistration.count({ where: { eventId, status: s } })),
    ),
    // Last 8 registrations for the "recent activity" list in the UI.
    prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, company: true, status: true, createdAt: true },
    }),
    // Total count used for capacity maths below.
    prisma.eventRegistration.count({ where: { eventId } }),
  ]);

  // Zip status names with their counts into a labelled array.
  const statusBreakdown = regStatuses.map((status, i) => ({
    status,
    count: statusCounts[i]!,
  }));

  // --- Capacity utilisation ---
  // `null` means "no capacity set", which the UI renders as "unlimited".
  // `Math.min(100, …)` prevents the percentage from exceeding 100 % if
  // over-booking somehow occurs.
  const capacityUsedPct =
    event.capacity && event.capacity > 0
      ? Math.min(100, Math.round((totalRegistrations / event.capacity) * 100))
      : null;

  return {
    event,
    totalRegistrations,
    statusBreakdown,
    capacityUsedPct,
    recentRegistrations,
  };
}
