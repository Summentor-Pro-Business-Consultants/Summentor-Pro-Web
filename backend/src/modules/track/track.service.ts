import geoip from "geoip-lite";
import * as trackRepo from "./track.repository.ts";
import { TrackEventInput, TrackInput } from "./track.validator.ts";

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
 * Resolves an approximate city/country from the client IP using the local
 * geoip-lite database (no external HTTP call required).
 *
 * Loopback and private IPs are skipped silently — geo lookup is best-effort
 * and should never break the user experience.
 */
function lookupGeo(ip: string | null): { city: string | null; country: string | null } {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:127.")) {
    return { city: null, country: null };
  }

  // Strip IPv4-mapped IPv6 prefix so geoip-lite can parse the address
  const cleanIp = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  const geo = geoip.lookup(cleanIp);
  if (!geo) return { city: null, country: null };

  return { city: geo.city || null, country: geo.country || null };
}

/**
 * Records a single page view, enriched with traffic source and geo.
 */
export async function recordPageView(data: TrackInput, ip: string | null) {
  const { city, country } = lookupGeo(ip);

  await trackRepo.createPageView({
    path: data.path,
    referrer: data.referrer ?? null,
    source: detectSource(data.referrer),
    city,
    country,
    sessionId: data.sessionId ?? null,
  });
}

/**
 * Records a single behavioural event (CTA click, scroll depth, funnel step).
 *
 * Shares the same source-detection and geo enrichment as page views so the
 * two tables can be sliced along identical dimensions in the dashboard.
 */
export async function recordEvent(data: TrackEventInput, ip: string | null) {
  const { city, country } = lookupGeo(ip);

  await trackRepo.createTrackedEvent({
    name: data.name,
    // Form steps are conversion signals; everything else is engagement.
    category: data.category ?? (data.name.startsWith("form_") ? "conversion" : "engagement"),
    path: data.path,
    label: data.label ?? null,
    value: data.value ?? null,
    // Spread so the key is absent (not `undefined`) when unused —
    // the repo runs under `exactOptionalPropertyTypes`.
    ...(data.properties !== undefined ? { properties: data.properties } : {}),
    source: detectSource(data.referrer),
    city,
    country,
    sessionId: data.sessionId ?? null,
  });
}
