import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { isProduction } from "../config.ts";
import { ApiError } from "../shared/errors/api-error.class.ts";
import logger from "../infrastructure/logger/logger.service.ts";
import {
  BadRequestResponse,
  InternalErrorResponse,
} from "../shared/responses/api-response.builder.ts";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    return;
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    new BadRequestResponse(message).send(res);
    return;
  }

  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  const message = isProduction ? "An unexpected error occurred" : err.message;
  new InternalErrorResponse(message).send(res);
}
