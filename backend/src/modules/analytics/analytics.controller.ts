/**
 * analytics.controller.ts
 *
 * HTTP request handlers (controllers) for the analytics module.
 *
 * ROLE:
 *   Each exported constant is an Express route handler that:
 *     1. Extracts relevant data from the HTTP request (params, query strings).
 *     2. Delegates to the service layer for business logic.
 *     3. Serialises the result into a standardised JSON response via
 *        `SuccessResponse`.
 *
 * WHY `asyncHandler`?
 *   Express 4 does not catch errors thrown from `async` route handlers by
 *   default — unhandled promise rejections would crash the process.
 *   `asyncHandler` wraps each handler so that any thrown error is forwarded
 *   to Express's `next(err)` error pipeline automatically.
 *
 * WHY `SuccessResponse`?
 *   Using a shared response builder ensures every successful API response
 *   follows the same envelope shape `{ message, data }`, making it
 *   predictable for frontend consumers and API clients.
 *
 * HOW it fits in:
 *   analytics.routes.ts registers URLs → these handlers.
 *   These handlers call analytics.service.ts for data.
 */

import { Request, Response } from "express";

import { SuccessResponse } from "../../shared/responses/api-response.builder.ts";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import * as analyticsService from "./analytics.service.ts";

/**
 * GET /admin/analytics/overview
 *
 * Returns the headline KPIs shown at the top of the admin dashboard:
 * total contacts, total registrations, upcoming events, and today's activity.
 */
export const overview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getOverview();
  new SuccessResponse("Overview retrieved", data).send(res);
});

/**
 * GET /admin/analytics/new-submissions?period=<Period>
 *
 * Returns the count of new contact submissions and event registrations for the
 * requested time period.  The `period` query param is sanitised by the service
 * layer and defaults to `'today'` if omitted or invalid.
 */
export const newSubmissions = asyncHandler(async (req: Request, res: Response) => {
  // Pass the raw query value — the service is responsible for validation.
  const data = await analyticsService.getNewSubmissions(req.query["period"]);
  new SuccessResponse("New submissions retrieved", data).send(res);
});

/**
 * GET /admin/analytics/contact-trend
 *
 * Returns a day-by-day contact submission series for the last 30 days,
 * suitable for a line or bar chart with zero-filled gaps.
 */
export const contactTrend = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getContactTrend();
  new SuccessResponse("Contact trend retrieved", data).send(res);
});

/**
 * GET /admin/analytics/registration-trend
 *
 * Returns the 10 most-recent events with their total registration counts,
 * used to render a "registrations per event" chart.
 */
export const registrationTrend = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getRegistrationTrend();
  new SuccessResponse("Registration trend retrieved", data).send(res);
});

/**
 * GET /admin/analytics/status-breakdown
 *
 * Returns contact submission counts grouped by workflow status
 * (`new`, `reviewed`, `replied`) for a status distribution chart.
 */
export const statusBreakdown = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getStatusBreakdown();
  new SuccessResponse("Status breakdown retrieved", data).send(res);
});

/**
 * GET /admin/analytics/cities
 *
 * Returns the top 10 cities ranked by the number of event registrations,
 * used to power a geographic breakdown widget.
 */
export const topCities = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getTopCities();
  new SuccessResponse("Top cities retrieved", data).send(res);
});

// ---------------------------------------------------------------------------
// Page-view / visitor analytics
// ---------------------------------------------------------------------------

export const activeUsers = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getActiveUsers();
  new SuccessResponse("Active users retrieved", data).send(res);
});

export const activeUsersTrend = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getActiveUsersTrend();
  new SuccessResponse("Active users trend retrieved", data).send(res);
});

export const visitorsByCity = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getVisitorsByCity();
  new SuccessResponse("Visitors by city retrieved", data).send(res);
});

export const visitorsByCountry = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getVisitorsByCountry();
  new SuccessResponse("Visitors by country retrieved", data).send(res);
});

export const trafficSources = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getTrafficSources();
  new SuccessResponse("Traffic sources retrieved", data).send(res);
});

export const pageViewsBySection = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getPageViewsBySection();
  new SuccessResponse("Page views by section retrieved", data).send(res);
});

export const formConversion = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getFormConversion();
  new SuccessResponse("Form conversion retrieved", data).send(res);
});

/**
 * GET /admin/analytics/events-overview
 *
 * Returns a high-level summary across all events: counts by status, total
 * registrations, and the average registrations per non-cancelled event.
 */
export const eventsOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getEventsOverview();
  new SuccessResponse("Events overview retrieved", data).send(res);
});

/**
 * GET /admin/analytics/events/:id
 *
 * Returns detailed analytics for a single event identified by its UUID.
 * Includes registration status breakdown, capacity utilisation, and the
 * eight most-recent sign-ups.
 *
 * The `!` non-null assertion on `req.params['id']` is safe here because
 * Express guarantees the param is present when this route is matched.
 */
export const eventAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getEventAnalytics(req.params["id"] as string);
  new SuccessResponse("Event analytics retrieved", data).send(res);
});
