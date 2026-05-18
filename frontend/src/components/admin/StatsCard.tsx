/**
 * StatsCard — /components/admin/StatsCard.tsx
 *
 * WHY THIS FILE EXISTS:
 * Dashboard KPI ("Key Performance Indicator") tiles follow a consistent visual
 * pattern across the admin panel: a metric label, a large number, an icon in a
 * coloured badge, and an optional secondary sub-label. This component codifies
 * that pattern once so it can be reused without duplicating markup.
 *
 * WHAT IT RENDERS:
 * A white card with a subtle border containing:
 *   LEFT column  — metric label (small, muted), big numeric/string value, optional sub-label
 *   RIGHT column — icon inside a soft-coloured circle badge
 *
 * The badge background uses the `color` prop at 9.4% opacity (hex suffix "18"),
 * so the icon always looks good against white regardless of which accent colour
 * is chosen.
 *
 * USAGE EXAMPLE:
 *   <StatsCard
 *     label="Total Contacts"
 *     value={142}
 *     icon={Mail}
 *     color="#3C50E0"
 *     sub="across all time"
 *   />
 *
 * HOW IT FITS:
 * Used in DashboardPage (WebsiteTab and EventsTab) to display summary KPIs.
 * It is a pure presentational component — it receives data, renders it, and
 * raises no events.
 */

import { LucideIcon } from "lucide-react";

/** Props accepted by StatsCard */
interface StatsCardProps {
  /** Short label describing the metric (e.g. "Total Contacts"). */
  label: string;
  /** The primary metric value — displayed large. Can be a formatted string. */
  value: number | string;
  /** Any Lucide icon component to display in the badge. */
  icon: LucideIcon;
  /**
   * Accent colour for both the icon and its background badge.
   * Defaults to brand blue (#3C50E0) if not supplied.
   */
  color?: string;
  /** Optional secondary note rendered below the main value in fine grey text. */
  sub?: string;
}

/**
 * StatsCard
 *
 * A single KPI tile showing a labelled metric with a coloured icon badge.
 *
 * @param color - Hex colour used for the icon tint and badge background.
 *                The badge background automatically uses 10% opacity of this colour.
 */
export default function StatsCard({
  label,
  value,
  icon: Icon,
  color = "#3C50E0",
  sub,
}: StatsCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "20px 24px",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      {/* ── Left: metric text ──────────────────────────────────────────────── */}
      <div>
        {/* Small muted label above the number */}
        <p style={{ fontSize: 13, color: "#64748B", fontWeight: 500, margin: 0 }}>{label}</p>

        {/* Large value — lineHeight:1 prevents extra space below the number */}
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#1E293B",
            margin: "6px 0 0",
            lineHeight: 1,
          }}
        >
          {value}
        </p>

        {/* Optional sub-label (e.g. "contacts + registrations") */}
        {sub && <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>{sub}</p>}
      </div>

      {/* ── Right: icon badge ──────────────────────────────────────────────── */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          // "18" appended to the hex string = ~9.4% opacity, giving a soft tinted background
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0, // Prevent the badge from shrinking when the value is long
        }}
      >
        <Icon size={20} color={color} strokeWidth={1.8} />
      </div>
    </div>
  );
}
