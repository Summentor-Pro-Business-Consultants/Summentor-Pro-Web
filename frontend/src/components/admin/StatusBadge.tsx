/**
 * StatusBadge — /components/admin/StatusBadge.tsx
 *
 * WHY THIS FILE EXISTS:
 * Contact submissions, event registrations, and events themselves all carry
 * a `status` string that should be displayed as a colour-coded pill so admins
 * can visually distinguish states at a glance. This component centralises that
 * colour-mapping and pill styling so it stays consistent across every table and
 * card in the admin panel.
 *
 * WHAT IT RENDERS:
 * A small inline <span> styled as a rounded pill with:
 *   - A soft tinted background (the "bg" value from colorMap)
 *   - A matching saturated foreground text colour
 *   - The status string in capitalised text (via CSS textTransform)
 *
 * COLOUR MAPPING:
 * The `colorMap` object covers every status string used in the app:
 *   Contacts:      new | reviewed | replied
 *   Registrations: pending | confirmed | attended | cancelled
 *   Events:        upcoming | ongoing | completed | cancelled
 * Any unrecognised status falls back to a neutral grey pill.
 *
 * USAGE EXAMPLE:
 *   <StatusBadge status="confirmed" />   // renders a green pill
 *   <StatusBadge status="cancelled" />   // renders a red pill
 *
 * HOW IT FITS:
 * Used in the Events list table, the Event Detail page registrations table,
 * and EventDetailPanel inside DashboardPage.
 */

/**
 * colorMap — maps each known status string to its badge colours.
 * `bg` is the pill background; `text` is the foreground text colour.
 * Using soft background + saturated text avoids harsh contrast while
 * still being clearly distinguishable.
 */
const colorMap: Record<string, { bg: string; text: string }> = {
  // ── Contact statuses ───────────────────────────────────────────────────────
  new: { bg: "#EFF6FF", text: "#3B82F6" }, // blue  — freshly submitted
  reviewed: { bg: "#F0FDF4", text: "#16A34A" }, // green — admin has seen it
  replied: { bg: "#F0FDF4", text: "#15803D" }, // deeper green — admin replied

  // ── Registration statuses ──────────────────────────────────────────────────
  pending: { bg: "#FFFBEB", text: "#D97706" }, // amber  — awaiting confirmation
  confirmed: { bg: "#F0FDF4", text: "#16A34A" }, // green  — confirmed attendance
  attended: { bg: "#EFF6FF", text: "#3B82F6" }, // blue   — was physically present
  cancelled: { bg: "#FEF2F2", text: "#DC2626" }, // red    — registration cancelled

  // ── Event statuses ─────────────────────────────────────────────────────────
  upcoming: { bg: "#EFF6FF", text: "#3B82F6" }, // blue   — not yet started
  ongoing: { bg: "#F0FDF4", text: "#16A34A" }, // green  — happening now
  completed: { bg: "#F8FAFC", text: "#64748B" }, // grey   — finished
};

/**
 * StatusBadge
 *
 * Renders a colour-coded pill for any status string used in the Summentor Pro
 * admin panel. Unknown statuses fall back to a neutral grey badge.
 *
 * @param status - The raw status string from the API (e.g. "confirmed").
 */
export default function StatusBadge({ status }: { status: string }) {
  // Look up colours; fall back to neutral grey for any unrecognised status value.
  const colors = colorMap[status] ?? { bg: "#F8FAFC", text: "#64748B" };

  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        padding: "3px 10px",
        borderRadius: 999, // Fully rounded pill shape
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        textTransform: "capitalize", // "confirmed" → "Confirmed"
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}
