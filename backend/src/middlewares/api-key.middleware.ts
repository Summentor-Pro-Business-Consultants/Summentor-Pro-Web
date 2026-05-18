import { NextFunction, Request, Response } from "express";

import { apiKey } from "../config.ts";
import { ForbiddenError } from "../shared/errors/api-error.class.ts";

export function requireApiKey(req: Request, _res: Response, next: NextFunction): void {
  const key = req.headers["x-api-key"];
  if (key !== apiKey) {
    return next(new ForbiddenError("Invalid API key"));
  }
  next();
}
