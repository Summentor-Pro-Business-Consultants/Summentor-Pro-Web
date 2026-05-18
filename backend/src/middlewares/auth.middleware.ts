/**
 * auth.middleware.ts — JWT authentication middleware for admin routes
 *
 * This middleware guards every route under `/api/v1/admin/*`.  It validates
 * the RS256-signed JWT that the admin SPA obtains from `POST /auth/login`
 * and attaches the decoded admin identity to `req.admin` so downstream
 * handlers can reference it without re-parsing the token.
 *
 * WHY RS256 (asymmetric) instead of HS256 (symmetric)?
 * With RS256 the private key — used to sign tokens — never leaves the
 * backend.  The public key — used to verify tokens — can be shared with
 * any service that needs to validate tokens without granting them the ability
 * to forge new ones.  This matters if micro-services are added in the future.
 *
 * Token flow:
 *   1. Client logs in → receives a short-lived access token (JWT) and a
 *      long-lived refresh token (opaque, stored in an HttpOnly cookie).
 *   2. Client sends `Authorization: Bearer <access-token>` on every request.
 *   3. This middleware verifies the JWT and, on success, populates `req.admin`.
 *   4. If the access token has expired, the client is instructed to call
 *      `POST /auth/refresh` (signalled via the `instruction` response header).
 *
 * Module augmentation (`declare global`):
 *   Express's `Request` type does not include an `admin` property by default.
 *   The `declare global` block extends the Express namespace so TypeScript
 *   knows about `req.admin` throughout the codebase without casting.
 */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { tokenInfo } from "../config.ts";
import { AccessTokenError, BadTokenError } from "../shared/errors/api-error.class.ts";

/**
 * Extend Express's Request interface to carry the authenticated admin's
 * identity after the JWT has been verified.
 *
 * Using optional (`?`) because the property only exists on routes that have
 * been protected by `requireAdmin`; unprotected routes would have `undefined`.
 */
declare global {
  namespace Express {
    interface Request {
      admin?: { adminId: string; email: string };
    }
  }
}

/**
 * Express middleware that enforces admin authentication via RS256 JWT.
 *
 * On success: attaches `{ adminId, email }` to `req.admin` and calls `next()`.
 * On failure: forwards an `AccessTokenError` or `BadTokenError` to the next
 *             error-handling middleware (which will send a 401 response).
 *
 * @param req  - Incoming Express request.  The `Authorization` header is read here.
 * @param _res - Express response (unused; prefixed with `_` to signal intentional non-use).
 * @param next - Express next function; called with an error on auth failure.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  // -----------------------------------------------------------------------
  // Step 1 — Extract the token from the Authorization header.
  // The header must be in the format: `Bearer <token>`.
  // -----------------------------------------------------------------------
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    // Header is missing or uses a different scheme (e.g. Basic).
    return next(new AccessTokenError("Missing access token"));
  }

  // Slice off the "Bearer " prefix (7 characters) to get the raw JWT string.
  const token = authHeader.slice(7);

  // -----------------------------------------------------------------------
  // Step 2 — Verify the JWT signature, issuer, and audience.
  // `jwt.verify` throws on any failure (expired, bad signature, wrong iss/aud).
  // -----------------------------------------------------------------------
  try {
    const payload = jwt.verify(token, tokenInfo.jwtPublicKey, {
      algorithms: ["RS256"], // Reject tokens signed with any other algorithm
      issuer: tokenInfo.issuer, // Must match the `iss` claim in the token
      audience: tokenInfo.audience, // Must match the `aud` claim in the token
    }) as { sub: string; email: string };

    // Attach the decoded identity so route handlers can use it without
    // re-parsing the token (e.g. for audit logs or ownership checks).
    req.admin = { adminId: payload.sub, email: payload.email };
    next();
  } catch (err) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      return next(new BadTokenError("Token expired"));
    }
    next(new AccessTokenError("Invalid access token"));
  }
}
