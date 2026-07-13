/**
 * SubmissionTrendChart — /components/admin/charts/SubmissionTrendChart.tsx
 *
 * WHY THIS FILE EXISTS:
 * The Dashboard's "Website" tab needs to visualise how many new contact
 * submissions arrive each day over the last 30 days. A line chart is the
 * right choice because it emphasises trend direction and continuity over time.
 *
 * WHAT IT RENDERS:
 * A responsive line chart (220px tall, 100% wide) using Recharts:
 *   - X axis: MM-DD formatted dates (year is stripped to save space)
 *   - Y axis: integer submission counts, no decimals
 *   - A single blue line ("Contacts") representing daily submission counts
 *   - No dot markers on each data point (dot={false}) for a clean look;
 *     an active dot (radius 4) appears only on hover
 *   - A styled tooltip that appears on hover
 *
 * DATA FORMAT:
 * Expects an array of { date: "YYYY-MM-DD", count: number } objects.
 * The component transforms this to { ..., label: "MM-DD" } for the X axis.
 *
 * HOW IT FITS:
 * Used in DashboardPage > WebsiteTab, fed by adminApi.contactTrend() which
 * returns the last 30 days of submission counts from the backend.
 */

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/** Props accepted by SubmissionTrendChart */
interface Props {
  /** Array of daily counts. Each entry has a full date and a count. */
  data: Array<{ date: string; count: number }>;
  /** Label shown in the tooltip (e.g. "Contacts", "Visitors"). Defaults to "Contacts". */
  seriesName?: string;
}

/**
 * SubmissionTrendChart
 *
 * Line chart showing daily contact submission volume over the last 30 days.
 * Renders nothing meaningful until `data` is populated by the parent.
 */
export default function SubmissionTrendChart({ data, seriesName = "Contacts" }: Props) {
  /**
   * formatted — transforms the raw data for chart consumption.
   * We strip the year from the date (keep only MM-DD) so the X axis labels
   * don't get too wide and overlap each other.
   */
  const formatted = data.map((d) => ({
    ...d,
    label: d.date.slice(5), // "2024-03-15" → "03-15"
  }));

  return (
    /*
      ResponsiveContainer makes the chart fill its parent's width automatically.
      height is fixed at 220px — tall enough to show the trend clearly without
      consuming too much vertical space on the dashboard.
    */
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
        {/* Subtle horizontal grid lines only, using a very light grey */}
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />

        {/*
          X axis — shows every 7th label (interval={6}) to avoid crowding
          when there are 30 data points. tickLine and axisLine are hidden for
          a cleaner look consistent with TailAdmin's chart style.
        */}
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9.4, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          interval={6} // Show roughly one label per week
        />

        {/*
          Y axis — whole numbers only (allowDecimals={false}) since submissions
          are always integers. Axis lines/ticks hidden for visual cleanliness.
        */}
        <YAxis
          tick={{ fontSize: 9.4, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />

        {/* Tooltip shown on hover — lightly styled to match the card design */}
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 11.2 }}
          labelStyle={{ color: "#1E293B", fontWeight: 600 }}
        />

        {/*
          The line itself:
          - type="monotone" draws smooth curves between points
          - dot={false} hides the individual data point circles for a cleaner line
          - activeDot shows a small 4px circle only on the hovered data point
          - name="Contacts" appears in the tooltip header
        */}
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3C50E0"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name={seriesName}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
