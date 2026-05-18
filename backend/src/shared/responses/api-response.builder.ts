/**
 * api-response.builder.ts — Standardised HTTP response builder classes
 *
 * Every HTTP response sent by the Summentor Pro API is constructed through
 * one of the classes defined here.  This gives the frontend a predictable
 * JSON envelope for every endpoint regardless of which module handles the
 * request:
 *
 *   { message: string, success: boolean, data?: T }
 *
 * Architecture decisions:
 *   - `ApiResponse` is abstract so it cannot be instantiated directly;
 *     only concrete subclasses (one per scenario) can be used.
 *   - `sanitize()` uses reflection (`getOwnPropertyNames`) to build the
 *     JSON payload, which means private TypeScript fields (declared with
 *     `private`) are still included in the response as long as they are
 *     stored as own properties on the instance.  The HTTP status code is
 *     explicitly excluded because it belongs in the status line, not the body.
 *   - Concrete classes that carry a payload (SuccessResponse, etc.) must
 *     override `send()` and touch `this.data` with `void` so TypeScript's
 *     "property declared but never read" lint rule is satisfied without
 *     altering runtime behaviour.
 *
 * Adding a new response type:
 *   1. Add the HTTP status to `ResponseStatus` if it isn't already there.
 *   2. Create a class that extends `ApiResponse`, passes the right status,
 *      and optionally overrides `send()` to add custom headers or payload.
 */

import { Response } from "express";

/**
 * HTTP status codes used across the API.
 *
 * Centralising them here prevents magic numbers from being scattered through
 * the codebase and makes it straightforward to spot if two response classes
 * accidentally share the wrong code.
 */
enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  CREATED = 201,
  CONFLICT = 409,
  NO_CONTENT = 204,
}

/**
 * Abstract base that all concrete response classes extend.
 *
 * Responsibilities:
 *   - Carries the HTTP status, human-readable message, and success flag.
 *   - Provides `prepare()` (used by subclasses) to set custom headers and
 *     emit the sanitised JSON body.
 *   - Provides `send()` as the public API — call `new XyzResponse(...).send(res)`.
 */
abstract class ApiResponse {
  constructor(
    public status: ResponseStatus,
    public message?: string,
    public success?: boolean,
  ) {}

  /**
   * Attaches optional HTTP headers then serialises `response` as JSON.
   *
   * Generic parameter `T` is constrained to `ApiResponse` so TypeScript
   * knows `sanitize()` will receive a valid response object.
   *
   * @param res      - Express Response object to write into.
   * @param response - The response instance whose own properties become the body.
   * @param headers  - Additional HTTP response headers (e.g. `instruction` for token refresh).
   * @returns          The Express Response after it has been sent.
   */
  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T,
    headers: { [key: string]: string },
  ): Response {
    // Append each custom header before sending the body.
    for (const [key, value] of Object.entries(headers)) res.append(key, value);

    const sanitized = ApiResponse.sanitize(response);
    return res.status(this.status).json(sanitized);
  }

  /**
   * Sends this response using the Express Response object.
   *
   * Subclasses with private payload fields (e.g. `data`, `accessToken`)
   * override this method to touch those fields before delegating to
   * `prepare()`, preventing TypeScript from tree-shaking them away.
   *
   * @param res     - Express Response object.
   * @param headers - Optional additional HTTP headers.
   * @returns         The Express Response after it has been sent.
   */
  public send(res: Response, headers: { [key: string]: string } = {}): Response {
    return this.prepare<ApiResponse>(res, this, headers);
  }

  /**
   * Builds a plain JSON-serialisable object from a response instance.
   *
   * WHY reflection instead of spreading `{ ...response }`?
   * Spread only captures enumerable own properties.  TypeScript's
   * `private` fields declared in the constructor are stored as own
   * properties but may be non-enumerable in some transpilation targets.
   * `getOwnPropertyNames` captures both enumerable and non-enumerable
   * own properties, so payload fields like `data` are always included.
   *
   * The `status` field is excluded because it belongs in the HTTP status
   * line, not the response body.  Functions are also stripped because they
   * are not JSON-serialisable.
   *
   * @param response - The response instance to serialise.
   * @returns          A plain object safe to pass to `res.json()`.
   */
  private static sanitize<T extends ApiResponse>(response: T): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const asMap = response as unknown as Record<string, unknown>;
    const props = Object.getOwnPropertyNames(response);
    for (const prop of props) {
      if (prop !== "status" && typeof asMap[prop] !== "function") {
        sanitized[prop] = asMap[prop];
      }
    }
    return sanitized;
  }
}

// ---------------------------------------------------------------------------
// Error responses — map to 4xx / 5xx status codes
// ---------------------------------------------------------------------------

/** 401 — Authentication failed (bad credentials or missing session). */
export class AuthFailureResponse extends ApiResponse {
  constructor(message = "Authentication Failure", success: boolean = true) {
    super(ResponseStatus.UNAUTHORIZED, message, success);
  }
}

/** 404 — The requested resource was not found. */
export class NotFoundResponse extends ApiResponse {
  constructor(message = "Not Found", success: boolean = true) {
    super(ResponseStatus.NOT_FOUND, message, success);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<NotFoundResponse>(res, this, headers);
  }
}

/** 403 — The caller is authenticated but does not have permission. */
export class ForbiddenResponse extends ApiResponse {
  constructor(message = "Forbidden", success: boolean = true) {
    super(ResponseStatus.FORBIDDEN, message, success);
  }
}

/** 400 — The request body or query parameters are invalid. */
export class BadRequestResponse extends ApiResponse {
  constructor(message = "Bad Parameters", success: boolean = true) {
    super(ResponseStatus.BAD_REQUEST, message, success);
  }
}

/** 500 — An unexpected server-side error occurred. */
export class InternalErrorResponse extends ApiResponse {
  constructor(message = "Internal Error", success: boolean = true) {
    super(ResponseStatus.INTERNAL_ERROR, message, success);
  }
}

// ---------------------------------------------------------------------------
// Success responses — map to 2xx status codes
// ---------------------------------------------------------------------------

/** 200 — Operation succeeded; response body contains only a message (no data payload). */
export class SuccessMsgResponse extends ApiResponse {
  constructor(message: string, success: boolean = true) {
    super(ResponseStatus.SUCCESS, message, success);
  }
}

/**
 * 200 — Operation failed logically but the HTTP transaction itself succeeded.
 *
 * This is used for business-logic failures that are not exceptional enough
 * to warrant a 4xx (e.g. "no results matched your search").  The frontend
 * inspects `success: false` to differentiate from a true success.
 */
export class FailureMsgResponse extends ApiResponse {
  constructor(message: string, success: boolean = true) {
    super(ResponseStatus.SUCCESS, message, success);
  }
}

/**
 * 200 — Operation succeeded with a data payload.
 *
 * `data` is declared `private` so TypeScript knows it is only read via
 * reflection inside `sanitize()`.  The `void this.data` line in `send()`
 * satisfies the "declared but never read" lint rule without changing runtime
 * behaviour (the field is still present on the instance for `sanitize()`).
 */
export class SuccessResponse<T> extends ApiResponse {
  constructor(
    message: string,
    private data: T,
    success: boolean = true,
  ) {
    super(ResponseStatus.SUCCESS, message, success);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    // Ensure TypeScript sees `data` as being read (sanitize() uses reflection).
    void this.data;
    return super.prepare<SuccessResponse<T>>(res, this, headers);
  }
}

/**
 * 201 — A new resource was created successfully.
 *
 * Identical to `SuccessResponse` in structure but uses the 201 Created
 * status code, which signals to clients (and caches) that a new entity
 * exists and its location may be found in the Location header.
 */
export class SuccessCreatedResponse<T> extends ApiResponse {
  constructor(
    message: string,
    private data: T,
    success: boolean = true,
  ) {
    super(ResponseStatus.CREATED, message, success);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    // Ensure TypeScript sees `data` as being read (sanitize() uses reflection).
    void this.data;
    return super.prepare<SuccessCreatedResponse<T>>(res, this, headers);
  }
}

/**
 * 401 — The access token is invalid or missing, and the client should
 * attempt a silent token refresh before retrying the original request.
 *
 * The `instruction: refresh_token` header is appended so the frontend
 * HTTP interceptor knows to call `/auth/refresh` before retrying, rather
 * than immediately redirecting the user to the login page.
 */
export class AccessTokenErrorResponse extends ApiResponse {
  // The value of this field is forwarded as an HTTP response header
  // so the client knows what action to take.
  private instruction = "refresh_token";

  constructor(message = "Access token invalid", success: boolean = true) {
    super(ResponseStatus.UNAUTHORIZED, message, success);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    // Attach the instruction header before delegating to prepare().
    headers.instruction = this.instruction;
    return super.prepare<AccessTokenErrorResponse>(res, this, headers);
  }
}

/**
 * 200 — A token-refresh operation succeeded.
 *
 * Returns both the new access token and the new refresh token so the
 * frontend can update its in-memory token store without an additional request.
 */
export class TokenRefreshResponse extends ApiResponse {
  constructor(
    message: string,
    private accessToken: string,
    private refreshToken: string,
    success: boolean = true,
  ) {
    super(ResponseStatus.SUCCESS, message, success);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    // Ensure TypeScript sees `accessToken`/`refreshToken` as being read (sanitize() uses reflection).
    void this.accessToken;
    void this.refreshToken;
    return super.prepare<TokenRefreshResponse>(res, this, headers);
  }
}

/**
 * 204 — A deletion succeeded and there is no content to return.
 *
 * 204 responses must not include a body per the HTTP spec, which is why
 * this class passes no `message` or `success` to the base constructor.
 */
export class SuccessDeletionResponse extends ApiResponse {
  constructor() {
    super(ResponseStatus.NO_CONTENT);
  }
}
