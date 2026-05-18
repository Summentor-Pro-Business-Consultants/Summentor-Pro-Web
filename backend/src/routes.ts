/**
 * routes.ts — Top-level API router for Summentor Pro backend
 *
 * This file is the single entry point that wires every feature module's
 * sub-router into the application.  It is mounted at a versioned prefix
 * (e.g. `/api/v1`) by the Express app bootstrap, so all paths here are
 * relative to that prefix.
 *
 * Architecture decision — two-tier routing:
 *   1. PUBLIC routes  → no authentication required, consumed by the
 *      Next.js frontend (contact form, public event listings, blog posts).
 *   2. ADMIN routes   → protected by `requireAdmin`, which validates the
 *      RS256 JWT attached to every request.  All admin routes live under
 *      the `/admin/` namespace so they are easy to lock down at the
 *      infrastructure level (e.g. via an nginx location block or WAF rule)
 *      if needed in the future.
 *
 * Adding a new module:
 *   - Create your feature router(s) in `src/modules/<feature>/`.
 *   - Import and mount them here, following the existing pattern.
 *   - If the routes need auth, prepend `requireAdmin` as the second argument.
 */

import { Router } from "express";

import { requireAdmin } from "./middlewares/auth.middleware.ts";
import authRouter from "./modules/auth/auth.routes.ts";
import { contactAdminRouter, contactPublicRouter } from "./modules/contact/contact.routes.ts";
import analyticsRouter from "./modules/analytics/analytics.routes.ts";
import {
  eventsAdminRouter,
  eventsPublicRouter,
  registrationsAdminRouter,
} from "./modules/events/events.routes.ts";
import { blogAdminRouter, blogPublicRouter } from "./modules/blog/blog.routes.ts";
import trackRouter from "./modules/track/track.routes.ts";

const router = Router();

// ---------------------------------------------------------------------------
// Auth — public endpoints (login, token refresh, logout).
// These must stay unprotected so the admin SPA can obtain its first token.
// ---------------------------------------------------------------------------
router.use("/auth", authRouter);

// ---------------------------------------------------------------------------
// Public API — no authentication needed.
// Consumed directly by the Next.js marketing site pages.
// ---------------------------------------------------------------------------
router.use("/contact", contactPublicRouter);
router.use("/events", eventsPublicRouter);
router.use("/blogs", blogPublicRouter);
router.use("/track", trackRouter);

// ---------------------------------------------------------------------------
// Admin API — all routes below require a valid JWT issued by this server.
// `requireAdmin` runs before the feature router and will short-circuit with
// a 401 if the token is missing, expired, or tampered with.
// ---------------------------------------------------------------------------
router.use("/admin/analytics", requireAdmin, analyticsRouter);
router.use("/admin/contacts", requireAdmin, contactAdminRouter);
router.use("/admin/events", requireAdmin, eventsAdminRouter);
router.use("/admin/registrations", requireAdmin, registrationsAdminRouter);
router.use("/admin/blogs", requireAdmin, blogAdminRouter);

export default router;
