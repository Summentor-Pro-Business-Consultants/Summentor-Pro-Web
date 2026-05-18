"use client";

/**
 * VerticalBarChart — generic vertical bar chart.
 *
 * Categories sit on the X axis (good for short labels like page names, city names)
 * and values on the Y axis. Bars are coloured with a gradient from the primary
 * colour down to a lighter tint so multiple bars remain visually distinct without
 * a per-bar colour override.
 *
 * Used for: "Pages Visited" section breakdown, "Top Cities" in the Events tab.
 */

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

interface Props {
  data: Record<string, string | number>[];
  /** Key in each data object used as the X-axis category label. */
  labelKey: string;
  /** Key in each data object used as the bar height value. */
  valueKey: string;
  /** Primary bar colour (tallest bar). Defaults to brand blue. */
  color?: string;
  /** Lighter tint used for every bar after the first. */
  colorAlt?: string;
  /** Label shown in the tooltip. Defaults to `valueKey`. */
  tooltipName?: string;
  /** Chart height in px. Defaults to 220. */
  height?: number;
}

export default function VerticalBarChart({
  data,
  labelKey,
  valueKey,
  color = "#3C50E0",
  colorAlt = "#7B8FEE",
  tooltipName,
  height = 220,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey={labelKey}
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
          cursor={{ fill: "#F8FAFC" }}
        />
        <Bar dataKey={valueKey} radius={[4, 4, 0, 0]} name={tooltipName ?? valueKey}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? color : colorAlt} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
