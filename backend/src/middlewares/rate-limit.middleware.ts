/**
 * rate-limit.middleware.ts — IP-based request throttling.
 *
 * `globalLimiter` is a generous catch-all guarding every API route from
 * bulk abuse. `contactLimiter` is strict because each contact submission
 * triggers an outbound AWS SES email (real per-message cost), so it is the
 * most attractive endpoint to spam.
 *
 * Accurate client IPs require `app.set("trust proxy", …)` in app.ts since
 * requests arrive via the Next.js proxy / Render edge (X-Forwarded-For).
 */
import { rateLimit } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down." },
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." },
});
