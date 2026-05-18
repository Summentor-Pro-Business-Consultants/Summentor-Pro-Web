/**
 * async-handler.util.ts — Express async route handler wrapper
 *
 * WHY this utility exists:
 * Express 4 does not natively handle rejected Promises from async route
 * handlers.  If an `async` handler throws (or returns a rejected Promise),
 * Express silently ignores the error and the request hangs with no response.
 *
 * This wrapper solves the problem by appending `.catch(next)` to the Promise
 * returned by every async handler.  When the Promise rejects, Express's
 * error-handling middleware chain is triggered — specifically our central
 * `errorHandler` in `error.middleware.ts`.
 *
 * Usage:
 *   export const myRoute = asyncHandler(async (req, res) => {
 *     const data = await someService.fetch();   // throws → caught → next(err)
 *     new SuccessResponse('ok', data).send(res);
 *   });
 *
 * The generic parameter `Req` lets callers pass a typed request interface
 * (e.g. one that carries `req.admin`) while keeping the outer wrapper
 * compatible with Express's standard `(Request, Response, NextFunction)`
 * signature.
 *
 * Note: Express 5 (currently in beta) handles async errors natively, so
 * this wrapper will become redundant if the project upgrades.
 */

import { NextFunction, Request, Response } from "express";

/**
 * The shape of an async route handler.
 *
 * `Req` defaults to the plain Express `Request` but can be narrowed to a
 * custom interface (e.g. `AuthenticatedRequest`) by the caller.
 */
type AsyncFunction<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an async Express route handler so that any thrown error or rejected
 * Promise is forwarded to Express's `next` function (and from there to the
 * global error-handling middleware).
 *
 * @param execution - The async handler to protect.  It receives the same
 *                    `(req, res, next)` arguments as a standard Express handler.
 * @returns           A synchronous Express-compatible middleware function that
 *                    internally invokes `execution` and catches any rejection.
 */
export function asyncHandler<Req extends Request = Request>(execution: AsyncFunction<Req>) {
  // Return a standard (non-async) Express middleware so Express can invoke it
  // synchronously.  The async work happens inside `execution`; its rejection
  // is caught and passed to `next` so our error-handler middleware takes over.
  return (req: Request, res: Response, next: NextFunction) => {
    execution(req as Req, res, next).catch(next);
  };
}
