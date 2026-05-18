/**
 * contact.docs.ts — OpenAPI path registrations for the Contact module.
 *
 * Public:
 *   POST /contact                       — submit a contact form (website visitors)
 *
 * Admin (Bearer JWT required):
 *   GET    /admin/contacts              — paginated list with filters
 *   PATCH  /admin/contacts/:id/status   — update workflow status
 *   DELETE /admin/contacts/:id          — permanently delete a submission
 */

import { z } from "zod";

import { registry } from "./swagger.config.ts";

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

const INDUSTRY_SECTORS = [
  "IT",
  "Healthcare",
  "Services",
  "Education",
  "Manufacturing",
  "NGO",
  "Others",
] as const;

const ContactObject = z
  .object({
    id: z.string().uuid().openapi({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }),
    firstName: z.string().openapi({ example: "Priya" }),
    lastName: z.string().openapi({ example: "Sharma" }),
    organisation: z.string().openapi({ example: "Acme Corp" }),
    designation: z.string().nullable().openapi({ example: "CTO" }),
    email: z.string().email().openapi({ example: "priya.sharma@acmecorp.com" }),
    phone: z.string().nullable().openapi({ example: "+91 98765 43210" }),
    location: z.string().nullable().openapi({ example: "Bengaluru, India" }),
    industrySector: z.enum(INDUSTRY_SECTORS).openapi({ example: "IT" }),
    referralSource: z.string().nullable().openapi({ example: "LinkedIn" }),
    budget: z.string().nullable().openapi({ example: "₹5–10 L" }),
    message: z.string().nullable().openapi({ example: "Looking for leadership coaching." }),
    status: z
      .enum(["new", "reviewed", "replied"])
      .openapi({ example: "new" }),
    createdAt: z.string().datetime().openapi({ example: "2025-05-10T08:30:00.000Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-05-10T08:30:00.000Z" }),
  })
  .openapi("Contact");

const PaginatedContactsResponse = z
  .object({
    message: z.string().openapi({ example: "Contacts retrieved" }),
    success: z.literal(true),
    data: z.object({
      data: z.array(ContactObject),
      total: z.number().openapi({ example: 42 }),
      page: z.number().openapi({ example: 1 }),
      limit: z.number().openapi({ example: 20 }),
      totalPages: z.number().openapi({ example: 3 }),
    }),
  })
  .openapi("PaginatedContactsResponse");

const ErrorBody = z
  .object({ message: z.string(), success: z.literal(false) })
  .openapi("ContactError");

// ---------------------------------------------------------------------------
// POST /contact  (public)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/contact",
  tags: ["Contact"],
  summary: "Submit contact form",
  description:
    "Accepts a website visitor's enquiry and stores it with status `new`. " +
    "No authentication required — this is the public-facing endpoint consumed by the Connect page.",
  security: [{ apiKey: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              firstName: z.string().min(1).max(100).openapi({ example: "Priya" }),
              lastName: z.string().min(1).max(100).openapi({ example: "Sharma" }),
              organisation: z.string().min(1).max(200).openapi({ example: "Acme Corp" }),
              designation: z.string().max(100).optional().openapi({ example: "CTO" }),
              email: z.string().email().openapi({ example: "priya.sharma@acmecorp.com" }),
              phone: z.string().max(20).optional().openapi({ example: "+91 98765 43210" }),
              location: z.string().max(100).optional().openapi({ example: "Bengaluru, India" }),
              industrySector: z.enum(INDUSTRY_SECTORS).openapi({ example: "IT" }),
              referralSource: z.string().max(100).optional().openapi({ example: "LinkedIn" }),
              budget: z.string().max(100).optional().openapi({ example: "₹5–10 L" }),
              message: z
                .string()
                .max(3000)
                .optional()
                .openapi({ example: "Looking for leadership coaching." }),
            })
            .openapi("ContactSubmitBody"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Submission recorded — entry created with status `new`",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Contact submitted successfully" }),
              success: z.literal(true),
              data: ContactObject,
            })
            .openapi("ContactSubmitResponse"),
        },
      },
    },
    400: {
      description: "Validation error — one or more fields failed schema rules",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "email: Invalid email address", success: false },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// GET /admin/contacts  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/admin/contacts",
  tags: ["Contact — Admin"],
  summary: "List contact submissions",
  description:
    "Returns a paginated, filterable list of all contact submissions. " +
    "Supports filtering by `status` and full-text `search` across name, email, and organisation.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
      limit: z.coerce.number().int().min(1).max(100).optional().openapi({ example: 20 }),
      status: z
        .enum(["new", "reviewed", "replied"])
        .optional()
        .openapi({ example: "new", description: "Filter by workflow status" }),
      search: z
        .string()
        .optional()
        .openapi({ example: "Priya", description: "Searches name, email, organisation" }),
    }),
  },
  responses: {
    200: {
      description: "Paginated contact list",
      content: { "application/json": { schema: PaginatedContactsResponse } },
    },
    401: {
      description: "Missing or invalid access token",
      content: { "application/json": { schema: ErrorBody } },
    },
  },
});

// ---------------------------------------------------------------------------
// PATCH /admin/contacts/:id/status  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "patch",
  path: "/admin/contacts/{id}/status",
  tags: ["Contact — Admin"],
  summary: "Update contact status",
  description:
    "Advances the workflow status of a single contact submission. " +
    "Typical progression: `new` → `reviewed` → `replied`.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid().openapi({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              status: z.enum(["new", "reviewed", "replied"]).openapi({ example: "reviewed" }),
            })
            .openapi("ContactStatusBody"),
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
              data: ContactObject,
            })
            .openapi("ContactStatusResponse"),
        },
      },
    },
    400: { description: "Invalid status value", content: { "application/json": { schema: ErrorBody } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: {
      description: "Contact not found",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "Not Found", success: false },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// DELETE /admin/contacts/:id  (admin)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "delete",
  path: "/admin/contacts/{id}",
  tags: ["Contact — Admin"],
  summary: "Delete contact submission",
  description: "Permanently removes a contact submission. This action is irreversible.",
  security: [{ apiKey: [], bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid().openapi({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) }),
  },
  responses: {
    204: { description: "Deleted — no content returned" },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorBody } } },
    404: {
      description: "Contact not found",
      content: { "application/json": { schema: ErrorBody } },
    },
  },
});
