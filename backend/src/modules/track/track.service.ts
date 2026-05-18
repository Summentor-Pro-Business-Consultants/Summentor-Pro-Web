import geoip from "geoip-lite";
import * as trackRepo from "./track.repository.ts";
import { TrackInput } from "./track.validator.ts";

/**
 * Parses the raw Referer header value into a named traffic source.
 * Returns "direct" when no referrer is present (direct visits, bookmarks).
 */
function detectSource(referrer?: string): string {
  if (!referrer) return "direct";
  if (referrer.includes("instagram.com")) return "instagram";
  if (referrer.includes("chatgpt.com") || referrer.includes("openai.com")) return "chatgpt";
  if (referrer.includes("google.")) return "google";
  if (referrer.includes("linkedin.com")) return "linkedin";
  if (referrer.includes("twitter.com") || referrer.includes("x.com")) return "twitter";
  return "other";
}

/**
 * Records a single page view. Looks up city/country from the client IP using
 * the local geoip-lite database (no external HTTP call required).
 *
 * Loopback and private IPs are skipped silently — geo lookup is best-effort
 * and should never break the user experience.
 */
export async function recordPageView(data: TrackInput, ip: string | null) {
  let city: string | null = null;
  let country: string | null = null;

  if (ip && ip !== "::1" && ip !== "127.0.0.1" && !ip.startsWith("::ffff:127.")) {
    // Strip IPv4-mapped IPv6 prefix so geoip-lite can parse the address
    const cleanIp = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
    const geo = geoip.lookup(cleanIp);
    if (geo) {
      city = geo.city || null;
      country = geo.country || null;
    }
  }

  await trackRepo.createPageView({
    path: data.path,
    referrer: data.referrer ?? null,
    source: detectSource(data.referrer),
    city,
    country,
    sessionId: data.sessionId ?? null,
  });
}
