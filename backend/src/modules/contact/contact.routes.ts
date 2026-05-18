/**
 * contact.routes.ts — Contact Module: Express Router Configuration
 *
 * This file wires HTTP verbs + URL paths to their corresponding controller
 * handlers. It is the single place to look when you need to know "what URL
 * triggers what handler?"
 *
 * Two separate routers are exported because they are mounted at different base
 * paths in the main app with different middleware chains (auth, rate limiting):
 *
 *   contactPublicRouter  — mounted at /api/contact
 *     Accessible without authentication; used by the public "Contact Us" form.
 *
 *   contactAdminRouter   — mounted at /api/admin/contact
 *     Protected by admin authentication middleware applied at the app level.
 *     Exposes read, update-status, and delete operations for the dashboard.
 *
 * Why split into two routers?
 *   Keeping public and admin routes in separate Router instances lets the main
 *   app apply auth middleware once at mount time rather than duplicating
 *   per-route guards inside this file.
 */

import { Router } from "express";

import * as contactController from "./contact.controller.ts";

/** Public-facing router — no authentication required. */
export const contactPublicRouter = Router();

/** Admin-only router — auth middleware is applied at the app mount point. */
export const contactAdminRouter = Router();

// --- Public Routes ---

// POST /api/contact — submit a new contact form
contactPublicRouter.post("/", contactController.submit);

// --- Admin Routes ---

// GET    /api/admin/contact         — list all submissions (paginated, filterable)
contactAdminRouter.get("/", contactController.list);

// PATCH  /api/admin/contact/:id/status — change the workflow status of a submission
contactAdminRouter.patch("/:id/status", contactController.updateStatus);

// DELETE /api/admin/contact/:id    — permanently remove a submission
contactAdminRouter.delete("/:id", contactController.deleteContact);
