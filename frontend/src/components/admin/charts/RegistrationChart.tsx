/**
 * RegistrationChart — /components/admin/charts/RegistrationChart.tsx
 *
 * WHY THIS FILE EXISTS:
 * The Dashboard's "Events" tab shows how many registrations each event has
 * received. A horizontal bar chart is ideal here because event titles can be
 * long strings that would overlap on a vertical axis, and the horizontal layout
 * makes it easy to rank events by popularity at a glance.
 *
 * WHAT IT RENDERS:
 * A responsive horizontal bar chart (220px tall, 100% wide) using Recharts:
 *   - Y axis: shortened event titles (truncated at 18 chars with "…" ellipsis)
 *   - X axis: integer registration counts
 *   - Bars coloured in two shades of brand blue; the first bar (highest value,
 *     since the API returns sorted results) gets a deeper #3C50E0, all others
 *     get a lighter #6378E8 to create a subtle visual hierarchy
 *   - Bars have rounded right corners (radius=[0,4,4,0]) for a modern look
 *   - Vertical grid lines only (horizontal={false}) to avoid visual noise
 *
 * DATA FORMAT:
 * Expects an array of { title: string; registrations: number } objects,
 * sorted descending by registrations (the API handles sorting).
 *
 * HOW IT FITS:
 * Used in DashboardPage > EventsTab, fed by adminApi.registrationTrend()
 * which returns per-event registration counts.
 */

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/** Props accepted by RegistrationChart */
interface Props {
  /** Array of events with their registration counts. */
  data: Array<{ title: string; registrations: number }>;
}

/**
 * RegistrationChart
 *
 * Horizontal bar chart comparing registration counts across events.
 * Event titles are truncated to prevent overflow in the Y axis.
 */
export default function RegistrationChart({ data }: Props) {
  /**
   * shortened — truncates long event titles for the Y axis label.
   * Titles longer than 18 characters are cut and appended with "…" so they
   * fit within the fixed 100px Y axis width without overflowing.
   * The full title remains available in the tooltip via the original `data`.
   */
  const shortened = data.map((d) => ({
    ...d,
    label: d.title.length > 18 ? d.title.slice(0, 18) + "…" : d.title,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      {/*
        layout="vertical" makes bars grow horizontally (left-to-right),
        which is the horizontal bar chart orientation.
        left margin of 8 gives the Y axis labels a little breathing room.
      */}
      <BarChart
        data={shortened}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
      >
        {/*
          CartesianGrid with horizontal={false} draws only vertical grid lines,
          guiding the eye along the bar length without adding clutter.
        */}
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />

        {/* X axis — numeric registration counts, integers only */}
        <XAxis
          type="number"
          tick={{ fontSize: 10.1, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />

        {/*
          Y axis — categorical, using the shortened `label` field.
          width={100} reserves space for the truncated title text.
        */}
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 10.1, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          width={100}
        />

        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />

        {/*
          Bar with rounded right corners: radius=[top-left, top-right, bottom-right, bottom-left]
          Since bars are horizontal, "top-right" and "bottom-right" are the visible ends.
        */}
        <Bar dataKey="registrations" radius={[0, 4, 4, 0]} name="Registrations">
          {shortened.map((_, i) => (
            // First bar (index 0) gets the deeper brand blue; all others get the lighter shade
            <Cell key={i} fill={i === 0 ? "#3C50E0" : "#6378E8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
