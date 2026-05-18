import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import { SuccessResponse } from "../../shared/responses/api-response.builder.ts";
import { trackSchema } from "./track.validator.ts";
import * as trackService from "./track.service.ts";

/**
 * POST /track
 *
 * Records a page view event. Invalid payloads are silently ignored — tracking
 * should never surface errors to the user.
 */
export const track = asyncHandler(async (req: Request, res: Response) => {
  const parsed = trackSchema.safeParse(req.body);
  if (parsed.success) {
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      (typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : null) ??
      req.socket?.remoteAddress ??
      null;
    // Fire-and-forget: don't await so the response is instant for the client
    trackService.recordPageView(parsed.data, ip).catch(() => {});
  }
  new SuccessResponse("ok", {}).send(res);
});
