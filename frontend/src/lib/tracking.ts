/**
 * tracking.ts — client-side page view tracker
 *
 * Fires a lightweight POST to /api/track on every page navigation.
 * Session IDs are stored in localStorage so the backend can count
 * unique visitors without handling cookies or user accounts.
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
