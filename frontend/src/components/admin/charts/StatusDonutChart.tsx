/**
 * StatusDonutChart — /components/admin/charts/StatusDonutChart.tsx
 *
 * WHY THIS FILE EXISTS:
 * The Dashboard shows contact status distribution (new / reviewed / replied)
 * and event registration status breakdowns. A donut chart is a compact, visually
 * appealing way to show part-to-whole relationships at a glance.
 *
 * WHAT IT RENDERS:
 * A responsive donut (ring) chart (220px tall, 100% wide) using Recharts:
 *   - A PieChart with innerRadius (55) creating the hollow centre
 *   - Each slice represents one status and its count
 *   - A small paddingAngle between slices so they don't bleed together
 *   - A legend below the chart with coloured circles and status labels
 *   - A tooltip on hover showing the exact count and status name
 *
 * COLOUR STRATEGY:
 * Known statuses (new, reviewed, replied) use hand-picked brand colours from COLORS.
 * Unknown statuses (e.g. if the API returns something unexpected) fall back to an
 * HSL-generated colour based on their index, ensuring no slice is invisible.
 *
 * DATA FORMAT:
 * Expects an array of { status: string; count: number } objects.
 * Works for both contact status breakdowns and registration status breakdowns.
 *
 * HOW IT FITS:
 * Used in two places:
 *   1. DashboardPage > WebsiteTab > "Contact Status Breakdown"
 *   2. DashboardPage > EventsTab > EventDetailPanel > "Registration Status Breakdown"
 */

"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/** Props accepted by StatusDonutChart */
interface Props {
  /** Array of status + count pairs to render as slices. */
  data: Array<{ status: string; count: number }>;
}

/**
 * COLORS — hand-picked fill colours for known contact/registration statuses.
 * Using a Record ensures O(1) lookup by status string.
 * Any status not in this map gets a programmatically generated HSL colour.
 */
const COLORS: Record<string, string> = {
  new: "#3C50E0", // Brand blue — most common initial state
  reviewed: "#10B981", // Green — admin acknowledged
  replied: "#0EA5E9", // Sky blue — admin responded
};

/**
 * StatusDonutChart
 *
 * Ring (donut) chart showing the distribution of contacts or registrations
 * by their current workflow status.
 */
export default function StatusDonutChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count" // The numeric value driving each slice's arc size
          nameKey="status" // The label Recharts uses in tooltips and legends
          cx="50%" // Centre the chart horizontally
          cy="50%" // Centre the chart vertically
          innerRadius={55} // The inner hole radius — larger = thinner ring
          outerRadius={85} // The outer radius — controls overall circle size
          paddingAngle={3} // Small gap between slices for visual separation
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.status}
              // Lookup colour by status name; fall back to an HSL-generated hue
              // spaced 60° apart so multiple unknown statuses stay distinguishable
              fill={COLORS[entry.status] ?? `hsl(${i * 60}, 70%, 50%)`}
            />
          ))}
        </Pie>

        {/* Tooltip: formatter receives (value, name) and returns [displayValue, displayName] */}
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
          formatter={(value, name) => [value, name]}
        />

        {/* Legend with small circle icons below the chart */}
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
