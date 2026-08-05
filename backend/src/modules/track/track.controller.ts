import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler.util.ts";
import { SuccessResponse } from "../../shared/responses/api-response.builder.ts";
import { trackEventSchema, trackSchema } from "./track.validator.ts";
import * as trackService from "./track.service.ts";

/** Extracts the originating client IP, preferring the proxy-forwarded value. */
function clientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  return (
    (typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : null) ??
    req.socket?.remoteAddress ??
    null
  );
}

/**
 * POST /track
 *
 * Records a page view event. Invalid payloads are silently ignored — tracking
 * should never surface errors to the user.
 */
export const track = asyncHandler(async (req: Request, res: Response) => {
  const parsed = trackSchema.safeParse(req.body);
  if (parsed.success) {
    // Fire-and-forget: don't await so the response is instant for the client
    trackService.recordPageView(parsed.data, clientIp(req)).catch(() => {});
  }
  new SuccessResponse("ok", {}).send(res);
});

/**
 * POST /track/event
 *
 * Records a behavioural event (CTA click, scroll depth, form funnel step).
 * Like page views this is best-effort: unknown event names or malformed
 * payloads are dropped silently rather than returning an error to the browser.
 */
export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  const parsed = trackEventSchema.safeParse(req.body);
  if (parsed.success) {
    trackService.recordEvent(parsed.data, clientIp(req)).catch(() => {});
  }
  new SuccessResponse("ok", {}).send(res);
});
