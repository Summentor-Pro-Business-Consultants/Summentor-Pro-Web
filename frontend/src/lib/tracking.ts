/**
 * tracking.ts — client-side analytics
 *
 * Two event streams, both POSTed through Next.js proxy routes so the backend
 * can read the real client IP for geo enrichment:
 *
 *   trackPageView() → /api/track       — one per navigation
 *   trackEvent()    → /api/track/event — CTA clicks, scroll depth, funnel steps
 *
 * Session IDs live in localStorage so the backend can count unique visitors
 * and stitch funnel steps together without cookies or user accounts.
 *
 * Tracking is entirely best-effort: errors are swallowed silently so
 * a network failure or ad-blocker never breaks the user experience.
 */

const SESSION_KEY = "_sp_sid";

/** Returns (or creates) a persistent random session ID for this browser. */
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Sends a single page-view event to the backend via the Next.js proxy route.
 * Skips admin paths — those are internal and should not pollute analytics.
 *
 * @param path - The Next.js pathname (e.g. "/events", "/blogs/my-post").
 */
export async function trackPageView(path: string): Promise<void> {
  if (path.startsWith("/admin")) return;

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || undefined,
        sessionId: getSessionId(),
      }),
    });
  } catch {
    // Silently ignore — tracking must never surface errors to visitors
  }
}

/** Behavioural events the backend accepts. Mirrors TRACKED_EVENT_NAMES. */
export type TrackedEventName =
  | "cta_click"
  | "scroll_depth"
  | "form_start"
  | "form_submit"
  | "form_error";

interface TrackEventOptions {
  /** Identity of the thing acted on, e.g. a CTA caption. */
  label?: string;
  /** Single numeric payload, e.g. scroll depth percentage. */
  value?: number;
  /** Small free-form bag for any additional context. */
  properties?: Record<string, string | number | boolean>;
}

/**
 * Sends a single behavioural event to the backend.
 *
 * Uses `keepalive` so the request still completes when the click that fired it
 * navigates the page away — without it, CTA clicks would be lost precisely
 * when they matter most.
 *
 * @param name - Event type, e.g. "cta_click".
 * @param path - Pathname the event fired on.
 * @param options - Optional label / value / properties payload.
 */
export async function trackEvent(
  name: TrackedEventName,
  path: string,
  options: TrackEventOptions = {},
): Promise<void> {
  if (path.startsWith("/admin")) return;

  try {
    await fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name,
        path,
        label: options.label,
        value: options.value,
        properties: options.properties,
        referrer: document.referrer || undefined,
        sessionId: getSessionId(),
      }),
    });
  } catch {
    // Silently ignore — tracking must never surface errors to visitors
  }
}
