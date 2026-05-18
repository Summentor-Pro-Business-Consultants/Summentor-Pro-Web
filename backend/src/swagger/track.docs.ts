/**
 * track.docs.ts — OpenAPI path registrations for the Track module.
 *
 * Public:
 *   POST /track — record a page view (called by the Next.js proxy on every navigation)
 */

import { z } from "zod";

import { registry } from "./swagger.config.ts";

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
              path: z
                .string()
                .min(1)
                .max(500)
                .openapi({ example: "/events/7c9e6679-7425-40de-944b-e07fc1f90ae7", description: "Next.js pathname, e.g. /events/[id]" }),
              referrer: z
                .string()
                .max(2000)
                .optional()
                .openapi({
                  example: "https://www.linkedin.com/",
                  description: "document.referrer — omit or send empty string for direct visits",
                }),
              sessionId: z
                .string()
                .uuid()
                .optional()
                .openapi({
                  example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  description: "Browser session UUID stored in localStorage under `_sp_sid`. Used for unique visitor counting.",
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
