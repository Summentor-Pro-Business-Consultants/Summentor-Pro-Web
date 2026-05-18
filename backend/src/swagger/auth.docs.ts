/**
 * auth.docs.ts — OpenAPI path registrations for the Auth module.
 *
 * Endpoints:
 *   POST /auth/login    — exchange credentials for an access token
 *   POST /auth/refresh  — silently renew the access token via httpOnly cookie
 *   POST /auth/logout   — revoke the refresh token and clear the cookie
 */

import { z } from "zod";

import { registry } from "./swagger.config.ts";

// ---------------------------------------------------------------------------
// Reusable schemas
// ---------------------------------------------------------------------------

const ErrorBody = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi("AuthError");

const AccessTokenResponse = z
  .object({
    message: z.string().openapi({ example: "Login successful" }),
    success: z.literal(true),
    data: z.object({
      accessToken: z
        .string()
        .openapi({
          example:
            "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZjE0ZTlkYy01YzBiLTRiMDMtOGQ1MS01OWM5YmI4NGFhMGYiLCJlbWFpbCI6ImFkbWluQHN1bW1lbnRvcnByby5jb20iLCJpYXQiOjE3NDU2MDAwMDAsImV4cCI6MTc0NTYwMDkwMH0.signature",
        }),
    }),
  })
  .openapi("AccessTokenResponse");

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Admin login",
  description:
    "Authenticate with email + password. Returns a **short-lived JWT access token (15 min)** in the response body. Also sets a `refreshToken` httpOnly cookie (7 days) used for silent renewal.\n\n" +
    "Store the access token in memory (never localStorage) and send it as `Authorization: Bearer <token>` on every protected request.",
  security: [{ apiKey: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({
              email: z.string().email().openapi({ example: "admin@summentorpro.com" }),
              password: z.string().min(1).openapi({ example: "Admin@123" }),
            })
            .openapi("LoginBody"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful — access token in body, refresh cookie set",
      content: { "application/json": { schema: AccessTokenResponse } },
    },
    400: {
      description: "Validation error — email or password missing",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "email: Invalid email", success: false },
        },
      },
    },
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "Invalid Credentials", success: false },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// POST /auth/refresh
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Refresh access token",
  description:
    "Reads the `refreshToken` httpOnly cookie, validates it against the database, and issues a new access token.\n\n" +
    "Call this endpoint when any protected request returns `401` with the response header `instruction: refresh_token`. " +
    "After a successful refresh, retry the original request with the new token.",
  security: [{ apiKey: [] }],
  responses: {
    200: {
      description: "New access token issued",
      content: {
        "application/json": {
          schema: AccessTokenResponse,
          example: {
            message: "Token refreshed",
            success: true,
            data: { accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
      },
    },
    401: {
      description: "Refresh token cookie missing, expired, or revoked",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "Token is not valid", success: false },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// POST /auth/logout
// ---------------------------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  summary: "Admin logout",
  description:
    "Revokes the refresh token from the database and clears the `refreshToken` cookie. " +
    "The in-memory access token expires on its own within 15 minutes.",
  security: [{ apiKey: [], bearerAuth: [] }],
  responses: {
    200: {
      description: "Logged out — cookie cleared, refresh token revoked",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string().openapi({ example: "Logged out" }),
              success: z.literal(true),
            })
            .openapi("LogoutResponse"),
        },
      },
    },
    401: {
      description: "Missing or invalid access token",
      content: {
        "application/json": {
          schema: ErrorBody,
          example: { message: "Missing access token", success: false },
        },
      },
    },
  },
});
