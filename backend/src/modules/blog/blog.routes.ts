/**
 * blog.routes.ts — Blog Module: Express Router Configuration
 *
 * This file maps HTTP verbs + URL paths to their corresponding controller
 * handlers. It is the single source of truth for "what URL triggers what?"
 * within the blog module.
 *
 * Two separate routers are exported because they are mounted at different base
 * paths in the main app with different middleware chains (rate limiting, auth):
 *
 *   blogPublicRouter  — mounted at /api/blog
 *     No authentication required. Serves published posts to website visitors.
 *     Routes:
 *       GET /           → paginated list of published posts (supports ?tag, ?page, ?limit)
 *       GET /:slug      → single published post by URL slug
 *
 *   blogAdminRouter   — mounted at /api/admin/blog
 *     Protected by admin authentication middleware applied at the app level.
 *     Full CRUD operations for the admin dashboard.
 *     Routes:
 *       GET    /        → paginated list of all posts (supports ?status, ?search, ?page, ?limit)
 *       GET    /:id     → single post by UUID (any status)
 *       POST   /        → create a new post
 *       PATCH  /:id     → partially update an existing post
 *       DELETE /:id     → permanently delete a post
 *
 * Why split into two routers?
 *   Keeping public and admin routes in separate Router instances lets the main
 *   app apply auth middleware once at mount time rather than duplicating
 *   per-route guards inside this file.
 *
 * Why does the public router use :slug while the admin router uses :id?
 *   Public readers navigate by human-readable slugs (in URLs and links).
 *   Admin operations use UUIDs because slugs can change while the ID is stable,
 *   making ID-based operations idempotent and unambiguous.
 */

import { Router } from "express";

import * as blogController from "./blog.controller.ts";

/** Public-facing router — no authentication required. */
export const blogPublicRouter = Router();

/** Admin-only router — auth middleware is applied at the app mount point. */
export const blogAdminRouter = Router();

// --- Public Routes ---

// GET /api/blog           — paginated list of published posts (filter by ?tag)
blogPublicRouter.get("/", blogController.listPublished);

// GET /api/blog/:slug     — single published post detail by URL slug
blogPublicRouter.get("/:slug", blogController.getBySlug);

// --- Admin Routes ---

// GET    /api/admin/blog        — list all posts (any status, paginated, searchable)
blogAdminRouter.get("/", blogController.listAdmin);

// GET    /api/admin/blog/:id    — single post by UUID (any status, for edit view)
blogAdminRouter.get("/:id", blogController.getById);

// POST   /api/admin/blog        — create a new blog post
blogAdminRouter.post("/", blogController.create);

// PATCH  /api/admin/blog/:id    — partially update a post (slug, content, status, etc.)
blogAdminRouter.patch("/:id", blogController.update);

// DELETE /api/admin/blog/:id    — permanently remove a post
blogAdminRouter.delete("/:id", blogController.remove);
