/**
 * track.docs.ts — OpenAPI path registrations for the Track module.
 *
 * Public:
 *   POST /track       — record a page view (called by the Next.js proxy on every navigation)
 *   POST /track/event — record a behavioural event (CTA click, scroll depth, funnel step)
 */

import { z } from "zod";

import { registry } from "../../swagger/swagger.config.ts";
import { TRACKED_EVENT_CATEGORIES, TRACKED_EVENT_NAMES } from "./track.validator.ts";

registry.registerPath({
  method: "post",
  path: "/track",
  tags: ["Tracking"],
  summary: "Record page view",
  description:
    "Ingests a single page-view event from the website frontend. " +
    "The backend enriches the record with IP-derived city/country (via geoip-lite) and detects the traffic source from the referrer header.\n\n" +
    "This endpoint is called automatically by the Next.js `/api/track` proxy route on every client-side navigation. " +
    "Responses are always `200` — errors are swallowed server-side so tracking never blocks user experience.",
  security: [{ apiKey: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              path: z.string().min(1).max(500).openapi({
                example: "/events/7c9e6679-7425-40de-944b-e07fc1f90ae7",
                description: "Next.js pathname, e.g. /events/[id]",
              }),
              referrer: z.string().max(2000).optional().openapi({
                example: "https://www.linkedin.com/",
                description: "document.referrer — omit or send empty string for direct visits",
              }),
              sessionId: z.string().uuid().optional().openapi({
                example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                description:
                  "Browser session UUID stored in localStorage under `_sp_sid`. Used for unique visitor counting.",
              }),
            })
            .openapi("TrackBody"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Page view recorded (or silently ignored on error)",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "ok" }),
              success: z.literal(true),
              data: z.object({}).openapi({ example: {} }),
            })
            .openapi("TrackResponse"),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/track/event",
  tags: ["Tracking"],
  summary: "Record behavioural event",
  description:
    "Ingests a single behavioural event — a CTA click, a scroll-depth milestone, or a step in the contact/registration form funnel. " +
    "Enriched with geo and traffic source exactly like `/track`, so events and page views can be sliced along the same dimensions.\n\n" +
    "`name` is a closed enum: unknown names are rejected silently. Use `label` for the identity of the thing acted on " +
    "(e.g. the CTA caption), `value` for a single number (e.g. scroll percentage), and `properties` for anything else.\n\n" +
    "Responses are always `200` — errors are swallowed server-side so tracking never blocks user experience.",
  security: [{ apiKey: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              name: z.enum(TRACKED_EVENT_NAMES).openapi({
                example: "cta_click",
                description: "Event type. One of: " + TRACKED_EVENT_NAMES.join(", "),
              }),
              category: z.enum(TRACKED_EVENT_CATEGORIES).optional().openapi({
                example: "engagement",
                description:
                  "Defaults to `conversion` for form_* events and `engagement` for everything else.",
              }),
              path: z
                .string()
                .min(1)
                .max(500)
                .openapi({ example: "/", description: "Pathname the event fired on" }),
              label: z.string().max(120).optional().openapi({
                example: "Partner With Us",
                description: "Identity of the thing acted on, e.g. the CTA caption",
              }),
              value: z.number().int().min(0).max(100000).optional().openapi({
                example: 75,
                description: "Single numeric payload, e.g. scroll depth percentage",
              }),
              properties: z
                .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
                .optional()
                .openapi({
                  example: { href: "/contact" },
                  description: "Small free-form bag for any additional context",
                }),
              referrer: z.string().max(2000).optional().openapi({
                example: "https://www.linkedin.com/",
                description: "document.referrer — used for traffic-source detection",
              }),
              sessionId: z.string().uuid().optional().openapi({
                example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                description:
                  "Browser session UUID stored in localStorage under `_sp_sid`. Required for funnel step-linking.",
              }),
            })
            .openapi("TrackEventBody"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Event recorded (or silently ignored on error)",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "ok" }),
              success: z.literal(true),
              data: z.object({}).openapi({ example: {} }),
            })
            .openapi("TrackEventResponse"),
        },
      },
    },
  },
});
