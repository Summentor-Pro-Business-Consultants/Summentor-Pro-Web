/**
 * api-error.class.ts — Typed, self-handling application error hierarchy
 *
 * WHY a custom error class instead of plain HTTP status codes?
 * Throwing a plain `Error` from service or repository code forces every
 * route handler to duplicate the status-code logic.  By using a typed
 * error hierarchy, any layer of the application can throw a meaningful
 * error (e.g. `new NotFoundError('Blog post not found')`) and the central
 * error-handling middleware will automatically convert it to the right HTTP
 * response — keeping controllers thin and consistent.
 *
 * Structure:
 *   ErrorType (enum)   — machine-readable discriminant, one value per error
 *                        category.  The string values intentionally match
 *                        the class names so stack traces are self-describing.
 *   ApiError (abstract)— base class; owns the `handle()` static dispatcher
 *                        that converts an ApiError to an Express Response.
 *   Concrete subclasses — one per error category, with a sensible default
 *                         message so callers don't have to repeat themselves.
 *
 * Usage:
 *   throw new NotFoundError();                        // uses default message
 *   throw new BadRequestError('email is required');   // custom message
 *   // The errorHandler middleware calls ApiError.handle() automatically.
 */

import { Response } from "express";

import { isProduction } from "../../config.ts";
import {
  AccessTokenErrorResponse,
  AuthFailureResponse,
  BadRequestResponse,
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse,
} from "../responses/api-response.builder.ts";

/**
 * Machine-readable error categories.
 *
 * Each variant maps to exactly one HTTP response class in `handle()`.
 * Keeping them as an enum (instead of plain strings) lets TypeScript catch
 * typos at compile time and makes exhaustive switch-case analysis possible.
 */
export enum ErrorType {
  BAD_TOKEN = "BadTokenError", // JWT present but malformed/tampered
  TOKEN_EXPIRED = "TokenExpiredError", // JWT signature valid but past exp
  UNAUTHORIZED = "AuthFailureError", // Wrong credentials / no session
  ACCESS_TOKEN = "AccessTokenError", // Access token missing entirely
  INTERNAL = "InternalError", // Unexpected server-side failures
  NOT_FOUND = "NotFoundError", // Resource not found by primary key

  NO_ENTRY = "NoEntryError", // Lookup returned nothing (alias of NOT_FOUND)
  NO_DATA = "NoDataError", // Query succeeded but result set is empty
  BAD_REQUEST = "BadRequestError", // Invalid input from the client
  FORBIDDEN = "ForbiddenError", // Authenticated but lacking permission
  RESOURCE_CONFLICT = "ResourceConflict", // Unique-constraint violation (e.g. duplicate email)
}

/**
 * Base class for all application errors.
 *
 * Extends the native `Error` so it propagates naturally through Express's
 * `next(err)` mechanism and can be caught by `instanceof Error` checks.
 *
 * Note: `super(type)` sets `Error.message` to the ErrorType string, while
 * `this.message` (the public `message` property) holds the human-readable
 * text sent to the client.  This distinction matters when reading stack
 * traces versus when serialising the response body.
 */
export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string = "error",
  ) {
    // Pass the type (not the human message) to Error so the error name
    // appears in stack traces rather than the potentially sensitive message.
    super(type);
  }

  /**
   * Converts an ApiError into the appropriate HTTP response.
   *
   * This static dispatcher is the single place that maps error categories
   * to response classes, keeping the mapping DRY and easy to audit.
   *
   * In production, unrecognised error types have their message replaced
   * with a generic string to avoid leaking internal details to clients.
   *
   * @param err - The ApiError instance thrown somewhere in the request cycle.
   * @param res - The Express Response object to write the error into.
   * @returns    The Express Response (already sent — callers should not send again).
   */
  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      // All token-related failures map to 401 Unauthorized.
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message, false).send(res);

      // Access-token errors get a special response that tells the
      // client to attempt a token refresh (`instruction: refresh_token`).
      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message, false).send(res);

      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message, false).send(res);

      // All "not found" variants collapse to a single 404 response.
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message, false).send(res);

      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message, false).send(res);

      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message, false).send(res);

      default: {
        // Unknown error type — treat as 500 but sanitise the message
        // in production to prevent leaking implementation details.
        let message = err.message;
        if (isProduction) {
          message = "Something wrong happened.";
        }
        return new InternalErrorResponse(message, false).send(res);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Concrete error subclasses
// Each class hard-codes its ErrorType so callers only need to pass a message.
// Default messages are intentionally generic — override when you can provide
// more context (e.g. `new NotFoundError('Blog post not found')`).
// ---------------------------------------------------------------------------

/** Thrown when credentials (email/password) do not match any admin account. */
export class AuthFailureError extends ApiError {
  constructor(message = "Invalid Credentials") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

/** Thrown for unexpected server-side failures (database errors, unhandled exceptions). */
export class InternalError extends ApiError {
  constructor(message = "Internal error") {
    super(ErrorType.INTERNAL, message);
  }
}

/** Thrown when request input fails validation (missing fields, wrong types, etc.). */
export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

/** Thrown when a requested resource does not exist in the database. */
export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

/** Thrown when a user is authenticated but does not have permission for the action. */
export class ForbiddenError extends ApiError {
  constructor(message = "Permission denied") {
    super(ErrorType.FORBIDDEN, message);
  }
}

/** Thrown when a specific record (looked up by a unique key) does not exist. */
export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);
  }
}

/** Thrown when a JWT is present in the request but cannot be verified (tampered/wrong key). */
export class BadTokenError extends ApiError {
  constructor(message = "Token is not valid") {
    super(ErrorType.BAD_TOKEN, message);
  }
}

/** Thrown when a JWT's signature is valid but the `exp` claim is in the past. */
export class TokenExpiredError extends ApiError {
  constructor(message = "Token is expired") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

/** Thrown when a query succeeds but returns zero rows where at least one was expected. */
export class NoDataError extends ApiError {
  constructor(message = "No data available") {
    super(ErrorType.NO_DATA, message);
  }
}

/**
 * Thrown when the Authorization header is missing or not in `Bearer <token>` format.
 * The client should redirect to login or attempt a silent token refresh.
 */
export class AccessTokenError extends ApiError {
  constructor(message = "Invalid access token") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

/**
 * Thrown when an insert/update would violate a unique constraint
 * (e.g. registering with an email address that already exists).
 */
export class ResourceConflictError extends ApiError {
  constructor(message = "Resource already exists") {
    super(ErrorType.RESOURCE_CONFLICT, message);
  }
}
