/**
 * CitiesChart — /components/admin/charts/CitiesChart.tsx
 *
 * WHY THIS FILE EXISTS:
 * The Dashboard's "Events" tab shows which cities produce the most registrations,
 * giving the team a geographic sense of audience engagement. A horizontal bar
 * chart is the right choice because city names are text strings that fit better
 * on a horizontal axis than a vertical one.
 *
 * WHAT IT RENDERS:
 * A responsive horizontal bar chart (220px tall, 100% wide) using Recharts:
 *   - Y axis: city names
 *   - X axis: integer registration counts
 *   - Bars in two shades of brand gold (#C9A14A / #D8B876) to visually
 *     differentiate this chart from the blue RegistrationChart on the same page.
 *     The first bar (highest count) gets the deeper gold; the rest get lighter.
 *   - Bars have rounded right corners for visual consistency with RegistrationChart
 *   - Vertical grid lines only to reduce clutter
 *
 * DATA FORMAT:
 * Expects an array of { city: string; count: number } objects,
 * sorted descending by count (handled by the API).
 *
 * HOW IT FITS:
 * Used in DashboardPage > EventsTab > "Top Cities by Registrations" section,
 * fed by adminApi.topCities().
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

/** Props accepted by CitiesChart */
interface Props {
  /** Array of city names with their registration counts, sorted descending. */
  data: Array<{ city: string; count: number }>;
}

/**
 * CitiesChart
 *
 * Horizontal bar chart showing registration volume by city.
 * Uses a gold colour palette to distinguish it from the blue RegistrationChart.
 */
export default function CitiesChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      {/*
        layout="vertical" produces horizontal bars (categories on Y, values on X).
        left margin of 8 gives city name labels a small buffer from the chart edge.
      */}
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        {/* Vertical grid lines only — horizontal lines would create visual noise */}
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />

        {/* X axis — integer registration counts */}
        <XAxis
          type="number"
          tick={{ fontSize: 10.1, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />

        {/*
          Y axis — city names as category labels.
          width={90} gives enough space for most city name lengths without over-allocating.
        */}
        <YAxis
          type="category"
          dataKey="city"
          tick={{ fontSize: 10.1, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          width={90}
        />

        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />

        {/*
          Bars with rounded right corners matching the RegistrationChart style.
          Gold palette (#C9A14A / #D8B876) distinguishes this "geographic" chart
          from the blue "per-event" chart shown directly above it.
        */}
        <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Registrations">
          {data.map((_, i) => (
            // First bar (highest city count) gets deep gold; all others get light gold
            <Cell key={i} fill={i === 0 ? "#C9A14A" : "#D8B876"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
