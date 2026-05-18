/**
 * contact.controller.ts — Contact Module: HTTP Request Handler Layer
 *
 * Controllers are the entry point for every HTTP request that reaches this
 * module. Each exported handler follows the same pattern:
 *   1. Parse and validate the request (body, query params, route params).
 *   2. Call the service layer with clean, typed data.
 *   3. Send a standardised API response.
 *
 * Controllers deliberately contain NO business logic — they are pure HTTP
 * adapters. If you need to change how a feature behaves, edit the service.
 * If you need to change how data is queried, edit the repository.
 *
 * All handlers are wrapped in `asyncHandler` which forwards any thrown error
 * to Express 5's built-in error middleware, avoiding repetitive try/catch blocks.
 *
 * Validation strategy:
 *   We use Zod's `safeParse` (not `parse`) so we control the error flow —
 *   a validation failure throws a BadRequestError (→ HTTP 400) rather than
 *   letting an unhandled Zod error bubble up as a 500.
 */

import { Request, Response } from "express";

import { BadRequestError } from "../../shared/errors/api-error.class.ts";
import {
  SuccessCreatedResponse,
  SuccessDeletionResponse,
  SuccessResponse,
} from "../../shared/responses/api-response.builder.ts";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import * as contactService from "./contact.service.ts";
import { contactSchema, contactStatusSchema } from "./contact.validator.ts";

/**
 * POST /contact
 * Handles a new contact form submission from the public-facing website.
 *
 * Validates the request body against `contactSchema`, then delegates to the
 * service which normalises names and persists the record.
 *
 * Responds with HTTP 201 on success.
 */
export const submit = asyncHandler(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  // Surface the first Zod issue as a readable 400 message
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await contactService.submitContact(parsed.data);
  new SuccessCreatedResponse("Message received", result).send(res);
});

/**
 * GET /admin/contact
 * Returns a paginated list of contact submissions for the admin dashboard.
 *
 * Query parameters:
 *   - page   (number, default 1)
 *   - limit  (number, default 10, capped at 50 to prevent runaway queries)
 *   - status (string, optional) — filters by workflow status
 *   - search (string, optional) — free-text search across name/email/org
 *
 * Responds with HTTP 200 and `{ data, total }`.
 */
export const list = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query["page"]) || 1;
  // Cap at 50 records per page to prevent accidentally large DB scans
  const limit = Math.min(Number(req.query["limit"]) || 10, 50);
  const status = req.query["status"] as string | undefined;
  const search = req.query["search"] as string | undefined;
  const result = await contactService.listContacts(page, limit, status, search);
  new SuccessResponse("Contacts retrieved", result).send(res);
});

/**
 * PATCH /admin/contact/:id/status
 * Updates the workflow status of a single contact submission.
 *
 * The allowed status values are defined in `contactStatusSchema`
 * ('new' | 'reviewed' | 'replied').
 *
 * Responds with HTTP 200 and the updated record.
 */
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = contactStatusSchema.safeParse(req.body);
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid status");
  const result = await contactService.updateStatus(id as string, parsed.data.status);
  new SuccessResponse("Status updated", result).send(res);
});

/**
 * DELETE /admin/contact/:id
 * Permanently removes a contact submission record.
 *
 * The service layer translates a "not found" Prisma error into a 404.
 * On success responds with HTTP 200 and a standard deletion confirmation.
 */
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await contactService.deleteContact(id as string);
  new SuccessDeletionResponse().send(res);
});
