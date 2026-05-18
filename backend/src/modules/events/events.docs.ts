/**
 * events.docs.ts — OpenAPI path registrations for the Events module.
 *
 * Public:
 *   GET  /events                           — list upcoming events
 *   GET  /events/:id                       — single event detail
 *   POST /events/:id/register              — visitor registration
 *
 * Admin (Bearer JWT required):
 *   GET    /admin/events                   — list all events (any status)
 *   POST   /admin/events                   — create event
 *   PATCH  /admin/events/:id               — update event (partial)
 *   DELETE /admin/events/:id               — delete event
 *   GET    /admin/events/:id/registrations — registrations for one event
 *   GET    /admin/registrations            — all registrations (cross-event)
 *   PATCH  /admin/registrations/:id/status — update registration status
 */

import { z } from "zod";

import { registry } from "../../swagger/swagger.config.ts";

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

const EventObject = z
  .object({
    id: z.string().uuid().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
    title: z.string().openapi({ example: "Leadership Roundtable — Bengaluru 2025" }),
    description: z.string().openapi({ example: "A curated gathering of senior leaders exploring future-of-work themes." }),
    city: z.string().openapi({ example: "Bengaluru" }),
    venue: z.string().nullable().openapi({ example: "The Leela Palace, Airport Road" }),
    eventDate: z.string().datetime().openapi({ example: "2025-08-15T09:00:00.000Z" }),
    tag: z.string().openapi({ example: "ROUNDTABLE" }),
    capacity: z.number().nullable().openapi({ example: 50 }),
    status: z
      .enum(["upcoming", "ongoing", "completed", "cancelled"])
      .openapi({ example: "upcoming" }),
    createdAt: z.string().datetime().openapi({ example: "2025-05-01T10:00:00.000Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-05-01T10:00:00.000Z" }),
  })
  .openapi("Event");

const RegistrationObject = z
  .object({
    id: z.string().uuid().openapi({ example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }),
    eventId: z.string().uuid().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
    name: z.string().openapi({ example: "Rahul Mehta" }),
    email: z.string().email().openapi({ example: "rahul.mehta@techfirm.in" }),
    company: z.string().nullable().openapi({ example: "TechFirm Pvt Ltd" }),
    phone: z.string().nullable().openapi({ example: "+91 99001 12233" }),
    message: z.string().nullable().openapi({ example: "Looking forward to the discussion." }),
    status: z
      .enum(["pending", "confirmed", "attended", "cancelled"])
      .openapi({ example: "pending" }),
    source: z.string().openapi({ example: "website" }),
    createdAt: z.string().datetime().openapi({ example: "2025-05-10T11:00:00.000Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-05-10T11:00:00.000Z" }),
  })
  .openapi("Registration");

const PaginationMeta = z.object({
  total: z.number().openapi({ example: 18 }),
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 20 }),
  totalPages: z.number().openapi({ example: 1 }),
});

const ErrorBody = z
  .object({ message: z.string(), success: z.literal(false) })
  .openapi("EventsError");

const idParam = z.object({
  id: z.string().uuid().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(100).optional().openapi({ example: 20 }),
});

// ---------------------------------------------------------------------------
// GET /events  (public)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/events",
  tags: ["Events"],
  summary: "List upcoming events",
  description: "Returns all events with status `upcoming`, ordered by date ascending. No authentication required.",
  security: [{ apiKey: [] }],
  responses: {
    200: {
      description: "List of upcoming events",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Events retrieved" }),
              success: z.literal(true),
              data: z.array(EventObject),
            })
            .openapi("PublicEventsResponse"),
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// GET /events/:id  (public)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/events/{id}",
  tags: ["Events"],
  summary: "Get event by ID",
  description: "Returns the full details of a single event. Used by the public event detail page.",
  security: [{ apiKey: [] }],
  request: { params: idParam },
  responses: {
    200: {
      description: "Event details",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Event retrieved" }),
              success: z.literal(true),
              data: EventObject,
            })
            .openapi("SingleEventResponse"),
        },
      },
    },
    404: {
      description: "Event not found",
      content: { "application/json": { schema: ErrorBody, example: { message: "Not Found", success: false } } },
    },
  },
});

// ---------------------------------------------------------------------------
// POST /events/:id/register  (public)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/events/{id}/register",
  tags: ["Events"],
  summary: "Register for an event",
  description:
    "Submits a visitor registration for the specified event. " +
    "The registration is created with status `pending` and source `website`. No authentication required.",
  security: [{ apiKey: [] }],
  request: {
    params: idParam,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              name: z.string().min(1).max(100).openapi({ example: "Rahul Mehta" }),
              email: z.string().email().openapi({ example: "rahul.mehta@techfirm.in" }),
              company: z.string().max(100).optional().openapi({ example: "TechFirm Pvt Ltd" }),
              phone: z.string().max(20).optional().openapi({ example: "+91 99001 12233" }),
              message: z
                .string()
                .max(1000)
                .optional()
                .openapi({ example: "Looking forward to the discussion." }),
            })
            .openapi("RegisterBody"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Registration submitted — status starts as `pending`",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Registration submitted" }),
              success: z.literal(true),
              data: RegistrationObject,
            })
            .openapi("RegisterResponse"),
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorBody } },
    },
    404: {
      description: "Event not found",
      content: { "application/json": { schema: ErrorBody } },
    },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/events  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/events",
  tags: ["Events — Admin"],
  summary: "List all events (admin)",
  description: "Returns all events regardless of status, paginated. Supports filtering by `status`.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    query: paginationQuery.extend({
      status: z
        .enum(["upcoming", "ongoing", "completed", "cancelled"])
        .optional()
        .openapi({ example: "upcoming" }),
    }),
  },
  responses: {
    200: {
      description: "Paginated events list",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Events retrieved" }),
              success: z.literal(true),
              data: z.object({ data: z.array(EventObject), ...PaginationMeta.shape }),
            })
            .openapi("AdminEventsResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// POST /admin/events  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/admin/events",
  tags: ["Events — Admin"],
  summary: "Create event",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              title: z.string().min(1).max(200).openapi({ example: "Leadership Roundtable — Bengaluru 2025" }),
              description: z
                .string()
                .min(1)
                .openapi({ example: "A curated gathering of senior leaders." }),
              city: z.string().min(1).max(100).openapi({ example: "Bengaluru" }),
              venue: z.string().max(200).optional().openapi({ example: "The Leela Palace" }),
              eventDate: z
                .string()
                .datetime()
                .openapi({ example: "2025-08-15T09:00:00.000Z", description: "ISO 8601 UTC datetime" }),
              tag: z.string().min(1).max(50).openapi({ example: "ROUNDTABLE" }),
              capacity: z.number().int().positive().optional().openapi({ example: 50 }),
              status: z
                .enum(["upcoming", "ongoing", "completed", "cancelled"])
                .optional()
                .openapi({ example: "upcoming" }),
            })
            .openapi("CreateEventBody"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Event created",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Event created" }),
              success: z.literal(true),
              data: EventObject,
            })
            .openapi("CreateEventResponse"),
        },
      },
    },
    400: { description: "Validation error", content: { "application/json": { schema: ErrorBody } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// PATCH /admin/events/:id  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "patch",
  path: "/admin/events/{id}",
  tags: ["Events — Admin"],
  summary: "Update event (partial)",
  description: "Applies a partial update to an existing event. All body fields are optional.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              title: z.string().min(1).max(200).optional().openapi({ example: "Leadership Roundtable — Updated" }),
              description: z.string().min(1).optional(),
              city: z.string().min(1).max(100).optional().openapi({ example: "Mumbai" }),
              venue: z.string().max(200).optional(),
              eventDate: z.string().datetime().optional(),
              tag: z.string().min(1).max(50).optional(),
              capacity: z.number().int().positive().optional().openapi({ example: 75 }),
              status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
            })
            .openapi("UpdateEventBody"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Event updated",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Event updated" }),
              success: z.literal(true),
              data: EventObject,
            })
            .openapi("UpdateEventResponse"),
        },
      },
    },
    400: { description: "Validation error", content: { "application/json": { schema: ErrorBody } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Event not found", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// DELETE /admin/events/:id  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "delete",
  path: "/admin/events/{id}",
  tags: ["Events — Admin"],
  summary: "Delete event",
  description: "Permanently deletes an event and all its registrations (cascade). Irreversible.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    204: { description: "Deleted — no content" },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Event not found", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/events/:id/registrations  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/events/{id}/registrations",
  tags: ["Events — Admin"],
  summary: "List registrations for an event",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    params: idParam,
    query: paginationQuery.extend({
      status: z
        .enum(["pending", "confirmed", "attended", "cancelled"])
        .optional()
        .openapi({ example: "confirmed" }),
    }),
  },
  responses: {
    200: {
      description: "Paginated registrations for the event",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Registrations retrieved" }),
              success: z.literal(true),
              data: z.object({ data: z.array(RegistrationObject), ...PaginationMeta.shape }),
            })
            .openapi("EventRegistrationsResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Event not found", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/registrations  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/registrations",
  tags: ["Registrations — Admin"],
  summary: "List all registrations (cross-event)",
  description: "Returns all registrations across every event, paginated. Supports filtering by status and search.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    query: paginationQuery.extend({
      status: z.enum(["pending", "confirmed", "attended", "cancelled"]).optional(),
      search: z
        .string()
        .optional()
        .openapi({ example: "Rahul", description: "Searches name and email" }),
    }),
  },
  responses: {
    200: {
      description: "Paginated registrations",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Registrations retrieved" }),
              success: z.literal(true),
              data: z.object({ data: z.array(RegistrationObject), ...PaginationMeta.shape }),
            })
            .openapi("AllRegistrationsResponse"),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
  },
});

// ---------------------------------------------------------------------------
// PATCH /admin/registrations/:id/status  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "patch",
  path: "/admin/registrations/{id}/status",
  tags: ["Registrations — Admin"],
  summary: "Update registration status",
  description:
    "Advances the lifecycle status of a single registration. " +
    "Typical flow: `pending` → `confirmed` → `attended`.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }),
    }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              status: z
                .enum(["pending", "confirmed", "attended", "cancelled"])
                .openapi({ example: "confirmed" }),
            })
            .openapi("RegistrationStatusBody"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Status updated",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Status updated" }),
              success: z.literal(true),
              data: RegistrationObject,
            })
            .openapi("RegistrationStatusResponse"),
        },
      },
    },
    400: { description: "Invalid status", content: { "application/json": { schema: ErrorBody } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: { description: "Registration not found", content: { "application/json": { schema: ErrorBody } } },
  },
});
