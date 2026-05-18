/**
 * events.routes.ts — Events Module: Express Router Configuration
 *
 * This file wires HTTP verbs + URL paths to their corresponding controller
 * handlers. It is the authoritative reference for "what URL triggers what?"
 * in the events module.
 *
 * Three separate routers are exported because they are mounted at different base
 * paths in the main app and carry different middleware (auth, rate limiting):
 *
 *   eventsPublicRouter        — mounted at /api/events
 *     No authentication required. Serves the public events listing, detail
 *     page, and visitor registration form.
 *
 *   eventsAdminRouter         — mounted at /api/admin/events
 *     Requires admin authentication (applied at app mount point).
 *     Full CRUD on Event records plus per-event registration listing.
 *
 *   registrationsAdminRouter  — mounted at /api/admin/registrations
 *     Requires admin authentication (applied at app mount point).
 *     Cross-event registration overview and status management.
 *
 * Why three routers instead of one?
 *   Splitting by access level lets the main app apply auth middleware once
 *   at mount time rather than guarding individual routes inside this file.
 *   Splitting events CRUD from the registrations overview also keeps each
 *   router's responsibility narrow and its URL namespace clean.
 */

import { Router } from "express";

import * as eventsController from "./events.controller.ts";

/** Public-facing router — no authentication required. */
export const eventsPublicRouter = Router();

/** Admin events router — auth middleware applied at app mount point. */
export const eventsAdminRouter = Router();

/** Admin registrations router — auth middleware applied at app mount point. */
export const registrationsAdminRouter = Router();

// --- Public Routes ---

// GET  /api/events           — list all upcoming events
eventsPublicRouter.get("/", eventsController.listUpcoming);

// GET  /api/events/:id       — fetch a single event's details
eventsPublicRouter.get("/:id", eventsController.getById);

// POST /api/events/:id/register — submit a visitor registration for an event
eventsPublicRouter.post("/:id/register", eventsController.register);

// --- Admin Event CRUD Routes ---

// GET    /api/admin/events        — list all events (any status, paginated)
eventsAdminRouter.get("/", eventsController.listAdmin);

// POST   /api/admin/events        — create a new event
eventsAdminRouter.post("/", eventsController.create);

// PATCH  /api/admin/events/:id    — partially update an existing event
eventsAdminRouter.patch("/:id", eventsController.update);

// DELETE /api/admin/events/:id    — permanently remove an event
eventsAdminRouter.delete("/:id", eventsController.remove);

// GET    /api/admin/events/:id/registrations — list registrations for one event
eventsAdminRouter.get("/:id/registrations", eventsController.getRegistrations);

// --- Admin Registration Routes ---

// GET   /api/admin/registrations          — list all registrations across all events
registrationsAdminRouter.get("/", eventsController.listAllRegistrations);

// PATCH /api/admin/registrations/:id/status — update a registration's lifecycle status
registrationsAdminRouter.patch("/:id/status", eventsController.updateRegistrationStatus);
