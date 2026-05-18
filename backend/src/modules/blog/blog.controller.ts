/**
 * blog.controller.ts — Blog Module: HTTP Request Handler Layer
 *
 * Each exported handler is an Express route handler wrapped in `asyncHandler`,
 * which forwards any thrown error (Zod validation failures, NotFoundErrors,
 * etc.) to the global error middleware — avoiding repetitive try/catch blocks.
 *
 * All handlers follow the same three-step pattern:
 *   1. Parse and validate the request (query params, route params, body).
 *   2. Call the appropriate service function with clean, typed data.
 *   3. Send a standardised API response using the shared response builders.
 *
 * No business logic lives here — controllers are pure HTTP adapters.
 *
 * Route groupings:
 *   Public  — accessible without authentication (published posts only)
 *   Admin   — requires admin auth (full CRUD on all posts)
 *
 * Pagination defaults:
 *   The public listing defaults to 9 posts per page (a common card-grid size).
 *   The admin listing defaults to 10. Both are capped at 50.
 *
 * Validation strategy:
 *   Zod's `safeParse` is used instead of `parse` so that validation failures
 *   are caught and converted to a BadRequestError (HTTP 400) rather than
 *   bubbling up as an unhandled error.
 */

import { Request, Response } from "express";

import { BadRequestError } from "../../shared/errors/api-error.class.ts";
import {
  SuccessCreatedResponse,
  SuccessDeletionResponse,
  SuccessResponse,
} from "../../shared/responses/api-response.builder.ts";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import * as blogService from "./blog.service.ts";
import { createBlogSchema, updateBlogSchema } from "./blog.validator.ts";

// --- Public Handlers ---

/**
 * GET /blog
 * Returns a paginated list of published blog posts for the public website.
 *
 * Query parameters:
 *   - page  (number, default 1)
 *   - limit (number, default 9, capped at 50) — 9 maps to a 3-column card grid
 *   - tag   (string, optional) — filter posts by tag substring
 */
export const listPublished = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query["page"]) || 1;
  // Default 9 (not 10) suits a 3-column blog card grid without an orphan row
  const limit = Math.min(Number(req.query["limit"]) || 9, 50);
  const tag = req.query["tag"] as string | undefined;
  const result = await blogService.listPublishedBlogs(page, limit, tag);
  new SuccessResponse("Blogs retrieved", result).send(res);
});

/**
 * GET /blog/:slug
 * Returns a single published blog post by its URL slug.
 * The service throws NotFoundError (→ 404) if the slug doesn't exist or the
 * post is not published — preventing leakage of draft content.
 */
export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogBySlug(req.params["slug"] as string);
  new SuccessResponse("Blog retrieved", blog).send(res);
});

// --- Admin Handlers ---

/**
 * GET /admin/blog
 * Returns a paginated list of all blog posts (any status) for the admin panel.
 *
 * Query parameters:
 *   - page   (number, default 1)
 *   - limit  (number, default 10, capped at 50)
 *   - status (string, optional) — filter by 'draft' or 'published'
 *   - search (string, optional) — free-text search over title, excerpt, author
 */
export const listAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query["page"]) || 1;
  // Cap at 50 records per page to prevent large accidental DB scans
  const limit = Math.min(Number(req.query["limit"]) || 10, 50);
  const status = req.query["status"] as string | undefined;
  const search = req.query["search"] as string | undefined;
  const result = await blogService.listBlogs(page, limit, status, search);
  new SuccessResponse("Blogs retrieved", result).send(res);
});

/**
 * GET /admin/blog/:id
 * Returns a single blog post by UUID for the admin edit view.
 * Returns any status (draft or published), unlike the public `getBySlug`.
 */
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogById(req.params["id"] as string);
  new SuccessResponse("Blog retrieved", blog).send(res);
});

/**
 * POST /admin/blog
 * Creates a new blog post. The service auto-generates a slug from the title
 * if one is not provided in the body. Responds with HTTP 201 on success.
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createBlogSchema.safeParse(req.body);
  // Surface the first Zod issue as a readable 400 message
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await blogService.createBlog(parsed.data);
  new SuccessCreatedResponse("Blog created", result).send(res);
});

/**
 * PATCH /admin/blog/:id
 * Partially updates an existing blog post. Only the fields present in the
 * request body are changed. The service handles slug uniqueness and
 * publishedAt timestamp logic automatically.
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateBlogSchema.safeParse(req.body);
  if (!parsed.success)
    throw new BadRequestError(parsed.error.issues[0]?.message ?? "Invalid input");
  const result = await blogService.updateBlog(req.params["id"] as string, parsed.data);
  new SuccessResponse("Blog updated", result).send(res);
});

/**
 * DELETE /admin/blog/:id
 * Permanently removes a blog post. The service translates "record not found"
 * into a 404. On success responds with a standard deletion confirmation.
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await blogService.deleteBlog(req.params["id"] as string);
  new SuccessDeletionResponse().send(res);
});
