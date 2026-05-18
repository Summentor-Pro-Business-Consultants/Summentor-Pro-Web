/**
 * analytics.routes.ts
 *
 * Express router that maps analytics URLs to their controller handlers.
 *
 * ROLE:
 *   This file is the single source of truth for the analytics module's URL
 *   surface.  It imports controller functions and registers them against HTTP
 *   verbs + path segments.
 *
 * HOW it fits in:
 *   The top-level app/router mounts this router under a shared prefix such as
 *   `/api/v1/admin/analytics`, so the paths defined here are relative to that
 *   base.  All routes are GET-only — analytics data is read-only.
 *
 * ADDING A NEW ENDPOINT:
 *   1. Write the DB query in analytics.repository.ts.
 *   2. Add a thin service wrapper in analytics.service.ts.
 *   3. Add an asyncHandler controller in analytics.controller.ts.
 *   4. Register the route below.
 */

import { Router } from "express";

import * as analyticsController from "./analytics.controller.ts";

const router = Router();

// --- Dashboard overview ---
// GET /overview — headline KPIs (totals, today's activity, upcoming events).
router.get("/overview", analyticsController.overview);

// --- Submission counts ---
// GET /new-submissions?period=<today|yesterday|week|month|year>
// Returns contact + registration counts for the chosen time window.
router.get("/new-submissions", analyticsController.newSubmissions);

// --- Time-series charts ---
// GET /contact-trend — day-by-day contact submissions for the last 30 days.
router.get("/contact-trend", analyticsController.contactTrend);

// GET /registration-trend — top 10 most-recent events with their registration counts.
router.get("/registration-trend", analyticsController.registrationTrend);

// --- Breakdown / distribution charts ---
// GET /status-breakdown — contact submissions grouped by status (new/reviewed/replied).
router.get("/status-breakdown", analyticsController.statusBreakdown);

// GET /cities — top 10 cities by event registration volume.
router.get("/cities", analyticsController.topCities);

// --- Visitor / page-view analytics ---
// GET /active-users — unique visitor counts for today and past 7 days.
router.get("/active-users", analyticsController.activeUsers);

// GET /active-users-trend — daily unique visitors for the last 30 days.
router.get("/active-users-trend", analyticsController.activeUsersTrend);

// GET /visitors-by-city — top 10 cities by page view count.
router.get("/visitors-by-city", analyticsController.visitorsByCity);

// GET /visitors-by-country — top 10 countries by page view count.
router.get("/visitors-by-country", analyticsController.visitorsByCountry);

// GET /traffic-sources — breakdown by referral source (direct, instagram, etc.).
router.get("/traffic-sources", analyticsController.trafficSources);

// GET /page-views-by-section — page view counts grouped by site section.
router.get("/page-views-by-section", analyticsController.pageViewsBySection);

// GET /form-conversion — funnel from form page views to actual submissions.
router.get("/form-conversion", analyticsController.formConversion);

// --- Events analytics ---
// GET /events-overview — system-wide event stats and average registrations per event.
router.get("/events-overview", analyticsController.eventsOverview);

// GET /events/:id — detailed analytics for a single event (status breakdown,
//                   capacity %, recent registrations).
// NOTE: This more-specific path must come after /events-overview to avoid
//       Express matching "overview" as the :id param.
router.get("/events/:id", analyticsController.eventAnalytics);

export default router;
