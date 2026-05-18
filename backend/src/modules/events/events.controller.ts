/**
 * events.controller.ts — Events Module: HTTP Request Handler Layer
 *
 * Each exported handler in this file is an Express route handler wrapped in
 * `asyncHandler` (which forwards thrown errors to the global error middleware).
 * Handlers follow a consistent three-step pattern:
 *   1. Parse/validate request input using Zod's `safeParse`.
 *   2. Call the appropriate service function with clean, typed data.
 *   3. Send a standardised API response using the shared response builders.
 *
 * Controllers intentionally contain NO business logic. They are pure HTTP
 * adapters: they translate HTTP verbs + payloads → service calls → HTTP responses.
 *
 * Route groupings:
 *   Public  — accessible without authentication (listUpcoming, getById, register)
 *   Admin   — requires admin auth (CRUD on events, registration management)
 *
 * Pagination convention:
 *   `page` defaults to 1, `limit` defaults to 10 and is capped at 50 to prevent
 *   accidental large database scans from a crafted query parameter.
 */

import { Request, Response } from "express";

import { BadRequestError } from "../../shared/errors/api-error.class.ts";
import {
  SuccessCreatedResponse,
  SuccessDeletionResponse,
  SuccessResponse,
} from "../../shared/responses/api-response.builder.ts";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import * as eventsService from "./events.service.ts";
import {
  createEventSchema,
  registerForEventSchema,
  updateEventSchema,
  updateRegistrationStatusSchema,
} from "./events.validator.ts";

// --- Public Handlers ---

/**
 * GET /events
 * Returns all upcoming events for the public website events listing.
 * No pagination — the number of upcoming events is expected to be small.
 */
export const listUpcoming = asyncHandler(async (_req: Request, res: Response) => {
  const events = await eventsService.listUpcomingEvents();
  new SuccessResponse("Events retrieved", events).send(res);
});

/**
 * GET /events/:id
 * Returns a single event by its UUID for the public event detail page.
 * The service throws NotFoundError (→ 404) if the ID doesn't match any record.
 */
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventsService.getEventById(req.params["id"] as string);
  new SuccessResponse("Event retrieved", event).send(res);
});

/**
 * POST /events/:id/register
 * Registers a visitor for the specified event.
 *
 * Validates the request body against `registerForEventSchema`, then delegates
 * to the service which checks event existence before creating the registration.
 * Responds with HTTP 201 on success.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerForEventSchema.safeParse(req.body);
  // Surface the first Zod validation issue as a readable 400 message
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await eventsService.registerForEvent(req.params["id"] as string, parsed.data);
  new SuccessCreatedResponse("Registration submitted", result).send(res);
});

// --- Admin Handlers ---

/**
 * GET /admin/events
 * Returns a paginated list of all events (any status) for the admin dashboard.
 * Supports ?status and optional pagination query params.
 */
export const listAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query["page"]) || 1;
  // Cap at 50 to prevent runaway queries from crafted query strings
  const limit = Math.min(Number(req.query["limit"]) || 10, 50);
  const status = req.query["status"] as string | undefined;
  const result = await eventsService.listAdminEvents(page, limit, status);
  new SuccessResponse("Events retrieved", result).send(res);
});

/**
 * POST /admin/events
 * Creates a new event. Validates against `createEventSchema` which includes
 * an ISO datetime string for eventDate (converted to a Date in the service).
 * Responds with HTTP 201 and the created event record.
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await eventsService.createEvent(parsed.data);
  new SuccessCreatedResponse("Event created", result).send(res);
});

/**
 * PATCH /admin/events/:id
 * Partially updates an existing event. All fields are optional —
 * only the provided fields are changed on the stored record.
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateEventSchema.safeParse(req.body);
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await eventsService.updateEvent(req.params["id"] as string, parsed.data);
  new SuccessResponse("Event updated", result).send(res);
});

/**
 * DELETE /admin/events/:id
 * Permanently removes an event. The service translates "record not found"
 * into a 404. On success responds with a standard deletion confirmation.
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await eventsService.deleteEvent(req.params["id"] as string);
  new SuccessDeletionResponse().send(res);
});

/**
 * GET /admin/events/:id/registrations
 * Returns a paginated list of registrations for a specific event.
 * Supports ?status and optional pagination query params.
 */
export const getRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query["page"]) || 1;
  const limit = Math.min(Number(req.query["limit"]) || 10, 50);
  const status = req.query["status"] as string | undefined;
  const result = await eventsService.getEventRegistrations(
    req.params["id"] as string,
    page,
    limit,
    status,
  );
  new SuccessResponse("Registrations retrieved", result).send(res);
});

/**
 * GET /admin/registrations
 * Returns a cross-event, paginated list of all registrations.
 * Supports ?status, ?search, and pagination query params.
 */
export const listAllRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query["page"]) || 1;
  const limit = Math.min(Number(req.query["limit"]) || 10, 50);
  const status = req.query["status"] as string | undefined;
  const search = req.query["search"] as string | undefined;
  const result = await eventsService.listAllRegistrations(page, limit, status, search);
  new SuccessResponse("Registrations retrieved", result).send(res);
});

/**
 * PATCH /admin/registrations/:id/status
 * Changes the lifecycle status of a single registration record.
 * Validates the new status against `updateRegistrationStatusSchema`.
 */
export const updateRegistrationStatus = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateRegistrationStatusSchema.safeParse(req.body);
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid status");
  const result = await eventsService.updateRegistrationStatus(
    req.params["id"] as string,
    parsed.data.status,
  );
  new SuccessResponse("Status updated", result).send(res);
});
