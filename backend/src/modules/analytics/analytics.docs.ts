/**
 * analytics.docs.ts — OpenAPI path registrations for the Analytics module.
 *
 * All endpoints require Bearer JWT (admin only).
 *
 * Website analytics:
 *   GET /admin/analytics/overview
 *   GET /admin/analytics/new-submissions
 *   GET /admin/analytics/contact-trend
 *   GET /admin/analytics/status-breakdown
 *   GET /admin/analytics/active-users
 *   GET /admin/analytics/active-users-trend
 *   GET /admin/analytics/visitors-by-city
 *   GET /admin/analytics/visitors-by-country
 *   GET /admin/analytics/traffic-sources
 *   GET /admin/analytics/page-views-by-section
 *   GET /admin/analytics/form-conversion
 *
 * Events analytics:
 *   GET /admin/analytics/registration-trend
 *   GET /admin/analytics/cities
 *   GET /admin/analytics/events-overview
 *   GET /admin/analytics/events/:id
 */

import { z } from "zod";

import { registry } from "../../swagger/swagger.config.ts";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const adminSecurity = [{ apiKey: [], bearerAuth: [] }];

const ErrorBody = z
  .object({ message: z.string(), success: z.literal(false) })
  .openapi("AnalyticsError");

function successOf<T extends z.ZodTypeAny>(dataSchema: T, messageExample: string) {
  return z.object({
    message: z.string().openapi({ example: messageExample }),
    success: z.literal(true),
    data: dataSchema,
  });
}

const DailyCount = z
  .object({
    date: z.string().openapi({ example: "2025-05-10" }),
    count: z.number().openapi({ example: 7 }),
  })
  .openapi("DailyCount");

const NameCount = (nameKey: string, nameExample: string) =>
  z.object({
    [nameKey]: z.string().openapi({ example: nameExample }),
    count: z.number().openapi({ example: 14 }),
  });

// ---------------------------------------------------------------------------
// GET /admin/analytics/overview
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/overview",
  tags: ["Analytics — Website"],
  summary: "Dashboard KPI overview",
  description:
    "Returns the four headline KPIs shown in the stats-card row at the top of the dashboard: " +
    "total contacts, total registrations, upcoming event count, and today's new submissions.",
  security: adminSecurity,
  responses: {
    200: {
      description: "KPI overview",
      content: {
        "application/json": {
          schema: successOf(
            z
              .object({
                totalContacts: z.number().openapi({ example: 124 }),
                totalRegistrations: z.number().openapi({ example: 312 }),
                upcomingEvents: z.number().openapi({ example: 3 }),
                newContactsToday: z.number().openapi({ example: 5 }),
                newRegistrationsToday: z.number().openapi({ example: 8 }),
              })
              .openapi("OverviewData"),
            "Overview retrieved",
          ).openapi("OverviewResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/new-submissions
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/new-submissions",
  tags: ["Analytics — Website"],
  summary: "New submissions by period",
  description:
    "Returns the count of contacts and registrations created within the selected period. " +
    "Used by the time-range filter card on the dashboard.",
  security: adminSecurity,
  request: {
    query: z.object({
      period: z
        .enum(["today", "yesterday", "week", "month", "year"])
        .optional()
        .openapi({ example: "week", description: "Defaults to `today` if omitted or invalid" }),
    }),
  },
  responses: {
    200: {
      description: "Submission counts for the period",
      content: {
        "application/json": {
          schema: successOf(
            z
              .object({
                contacts: z.number().openapi({ example: 12 }),
                registrations: z.number().openapi({ example: 29 }),
                total: z.number().openapi({ example: 41 }),
              })
              .openapi("NewSubmissionsData"),
            "New submissions retrieved",
          ).openapi("NewSubmissionsResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/contact-trend
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/contact-trend",
  tags: ["Analytics — Website"],
  summary: "Contact submission trend (30 days)",
  description:
    "Returns a zero-filled daily series of contact submission counts for the last 30 days. " +
    "Suitable for a line chart with dates on the X axis.",
  security: adminSecurity,
  responses: {
    200: {
      description: "30-day contact trend",
      content: {
        "application/json": {
          schema: successOf(
            z.array(DailyCount).openapi("ContactTrendData"),
            "Contact trend retrieved",
          ).openapi("ContactTrendResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/status-breakdown
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/status-breakdown",
  tags: ["Analytics — Website"],
  summary: "Contact status breakdown",
  description:
    "Returns the count of contact submissions grouped by workflow status (`new`, `reviewed`, `replied`). " +
    "Used to render the status donut chart.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Status breakdown",
      content: {
        "application/json": {
          schema: successOf(
            z
              .array(
                z
                  .object({
                    status: z.string().openapi({ example: "new" }),
                    count: z.number().openapi({ example: 54 }),
                  })
                  .openapi("StatusCount"),
              )
              .openapi("StatusBreakdownData"),
            "Status breakdown retrieved",
          ).openapi("StatusBreakdownResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/active-users
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/active-users",
  tags: ["Analytics — Website"],
  summary: "Active users KPIs",
  description:
    "Returns four page-view and unique-session metrics: today's page views, past-week page views, " +
    "today's unique sessions, and past-week unique sessions. " +
    "Uniqueness is determined by the browser session UUID (`_sp_sid`).",
  security: adminSecurity,
  responses: {
    200: {
      description: "Active user metrics",
      content: {
        "application/json": {
          schema: successOf(
            z
              .object({
                pageViewsToday: z.number().openapi({ example: 87 }),
                pageViewsPastWeek: z.number().openapi({ example: 542 }),
                uniqueUsersToday: z.number().openapi({ example: 34 }),
                uniqueUsersPastWeek: z.number().openapi({ example: 218 }),
              })
              .openapi("ActiveUsersData"),
            "Active users retrieved",
          ).openapi("ActiveUsersResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/active-users-trend
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/active-users-trend",
  tags: ["Analytics — Website"],
  summary: "Active users trend (30 days)",
  description:
    "Returns a zero-filled daily series of **unique session counts** for the last 30 days. " +
    "Used for the Active Users line chart.",
  security: adminSecurity,
  responses: {
    200: {
      description: "30-day unique-visitor trend",
      content: {
        "application/json": {
          schema: successOf(
            z.array(DailyCount).openapi("ActiveUsersTrendData"),
            "Active users trend retrieved",
          ).openapi("ActiveUsersTrendResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/visitors-by-city
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/visitors-by-city",
  tags: ["Analytics — Website"],
  summary: "Visitors by city (top 10)",
  description: "Returns the top 10 cities ranked by page-view count for the last 30 days.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Top cities by page views",
      content: {
        "application/json": {
          schema: successOf(
            z.array(NameCount("city", "Bengaluru")).openapi("VisitorsByCityData"),
            "Visitors by city retrieved",
          ).openapi("VisitorsByCityResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/visitors-by-country
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/visitors-by-country",
  tags: ["Analytics — Website"],
  summary: "Visitors by country (top 10)",
  description: "Returns the top 10 countries ranked by page-view count for the last 30 days.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Top countries by page views",
      content: {
        "application/json": {
          schema: successOf(
            z.array(NameCount("country", "India")).openapi("VisitorsByCountryData"),
            "Visitors by country retrieved",
          ).openapi("VisitorsByCountryResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/traffic-sources
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/traffic-sources",
  tags: ["Analytics — Website"],
  summary: "Traffic sources breakdown",
  description:
    "Returns page-view counts grouped by detected traffic source. " +
    "Possible values: `direct`, `google`, `instagram`, `linkedin`, `twitter`, `chatgpt`, `other`.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Traffic sources",
      content: {
        "application/json": {
          schema: successOf(
            z.array(NameCount("source", "direct")).openapi("TrafficSourcesData"),
            "Traffic sources retrieved",
          ).openapi("TrafficSourcesResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/page-views-by-section
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/page-views-by-section",
  tags: ["Analytics — Website"],
  summary: "Page views by site section",
  description:
    "Returns page-view counts grouped into six named sections: Home, Events, Connect, Insights, Services, About.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Page views per section",
      content: {
        "application/json": {
          schema: successOf(
            z
              .array(
                z
                  .object({
                    page: z.string().openapi({ example: "Events" }),
                    count: z.number().openapi({ example: 93 }),
                  })
                  .openapi("SectionCount"),
              )
              .openapi("PageViewsBySectionData"),
            "Page views by section retrieved",
          ).openapi("PageViewsBySectionResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/form-conversion
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/form-conversion",
  tags: ["Analytics — Website"],
  summary: "Form conversion funnel",
  description:
    "Returns the conversion funnel for the last 30 days: page views on form pages vs actual submissions. " +
    "Used to render the grouped bar chart showing drop-off per channel.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Funnel metrics",
      content: {
        "application/json": {
          schema: successOf(
            z
              .object({
                contactPageViews: z.number().openapi({ example: 210 }),
                eventPageViews: z.number().openapi({ example: 374 }),
                totalPageViews: z.number().openapi({ example: 584 }),
                contactSubmissions: z.number().openapi({ example: 37 }),
                eventRegistrations: z.number().openapi({ example: 91 }),
                conversionRate: z.number().openapi({ example: 21.9 }),
              })
              .openapi("FormConversionData"),
            "Form conversion retrieved",
          ).openapi("FormConversionResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/registration-trend
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/registration-trend",
  tags: ["Analytics — Events"],
  summary: "Registrations per event (top 10)",
  description:
    "Returns the 10 most recent events with their total registration counts. " +
    "Used to render the Registrations per Event bar chart.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Per-event registration counts",
      content: {
        "application/json": {
          schema: successOf(
            z
              .array(
                z
                  .object({
                    title: z.string().openapi({ example: "Leadership Roundtable — Bengaluru 2025" }),
                    city: z.string().openapi({ example: "Bengaluru" }),
                    registrations: z.number().openapi({ example: 42 }),
                  })
                  .openapi("RegistrationTrendItem"),
              )
              .openapi("RegistrationTrendData"),
            "Registration trend retrieved",
          ).openapi("RegistrationTrendResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/cities
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/cities",
  tags: ["Analytics — Events"],
  summary: "Top cities by registrations (top 10)",
  description: "Returns the top 10 cities ranked by the number of event registrations.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Top cities",
      content: {
        "application/json": {
          schema: successOf(
            z.array(NameCount("city", "Mumbai")).openapi("TopCitiesData"),
            "Top cities retrieved",
          ).openapi("TopCitiesResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/events-overview
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/events-overview",
  tags: ["Analytics — Events"],
  summary: "Events KPI overview",
  description:
    "Returns system-wide event metrics: event counts by status, total registrations, and average registrations per event.",
  security: adminSecurity,
  responses: {
    200: {
      description: "Events KPIs",
      content: {
        "application/json": {
          schema: successOf(
            z
              .object({
                totalEvents: z.number().openapi({ example: 18 }),
                upcomingEvents: z.number().openapi({ example: 3 }),
                ongoingEvents: z.number().openapi({ example: 1 }),
                completedEvents: z.number().openapi({ example: 13 }),
                cancelledEvents: z.number().openapi({ example: 1 }),
                totalRegistrations: z.number().openapi({ example: 312 }),
                avgRegistrationsPerEvent: z.number().openapi({ example: 17.3 }),
              })
              .openapi("EventsOverviewData"),
            "Events overview retrieved",
          ).openapi("EventsOverviewResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/analytics/events/:id
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/analytics/events/{id}",
  tags: ["Analytics — Events"],
  summary: "Single event deep-dive analytics",
  description:
    "Returns detailed analytics for one event: registration status breakdown, capacity utilisation percentage, " +
    "and the 8 most recent sign-ups. Used by the Event Deep Dive panel in the dashboard.",
  security: adminSecurity,
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
    }),
  },
  responses: {
    200: {
      description: "Per-event analytics",
      content: {
        "application/json": {
          schema: successOf(
            z
              .object({
                event: z
                  .object({
                    id: z.string().uuid(),
                    title: z.string().openapi({ example: "Leadership Roundtable — Bengaluru 2025" }),
                    city: z.string().openapi({ example: "Bengaluru" }),
                    eventDate: z.string().datetime(),
                    status: z.string().openapi({ example: "upcoming" }),
                    capacity: z.number().nullable().openapi({ example: 50 }),
                    venue: z.string().nullable().openapi({ example: "The Leela Palace" }),
                    tag: z.string().openapi({ example: "ROUNDTABLE" }),
                  })
                  .openapi("EventSummary"),
                totalRegistrations: z.number().openapi({ example: 34 }),
                capacityUsedPct: z.number().nullable().openapi({ example: 68 }),
                statusBreakdown: z
                  .array(
                    z
                      .object({
                        status: z.string().openapi({ example: "confirmed" }),
                        count: z.number().openapi({ example: 22 }),
                      })
                      .openapi("EventStatusCount"),
                  )
                  .openapi("EventStatusBreakdown"),
                recentRegistrations: z
                  .array(
                    z
                      .object({
                        id: z.string().uuid(),
                        name: z.string().openapi({ example: "Rahul Mehta" }),
                        email: z.string().email().openapi({ example: "rahul.mehta@techfirm.in" }),
                        company: z.string().nullable().openapi({ example: "TechFirm Pvt Ltd" }),
                        status: z.string().openapi({ example: "confirmed" }),
                        createdAt: z.string().datetime(),
                      })
                      .openapi("RecentRegistration"),
                  )
                  .openapi("RecentRegistrations"),
              })
              .openapi("EventAnalyticsData"),
            "Event analytics retrieved",
          ).openapi("EventAnalyticsResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Event not found", content: { "application/json": { schema: ErrorBody } } },
  },
});
