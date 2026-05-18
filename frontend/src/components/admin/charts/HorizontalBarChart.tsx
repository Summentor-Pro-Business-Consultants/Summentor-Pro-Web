"use client";

/**
 * HorizontalBarChart — generic horizontal bar chart used for geographic and
 * section-level breakdowns (visitors by city, by country, page views by section).
 *
 * Accepts any array of objects with a string label field and a numeric value
 * field, plus a `labelKey` / `valueKey` pair that tells Recharts which fields to
 * use. This keeps the component reusable without duplicating chart boilerplate.
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
  /** Key in each data object whose value is the category label (Y axis). */
  labelKey: string;
  /** Key in each data object whose value is the numeric bar length (X axis). */
  valueKey: string;
  /** Primary bar colour (first bar). Defaults to brand blue. */
  color?: string;
  /** Lighter colour for all bars after the first. Defaults to a tint of `color`. */
  colorAlt?: string;
  /** Label shown in the tooltip. Defaults to `valueKey`. */
  tooltipName?: string;
}

export default function HorizontalBarChart({
  data,
  labelKey,
  valueKey,
  color = "#3C50E0",
  colorAlt = "#7B8FEE",
  tooltipName,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey={labelKey}
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          width={90}
        />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }} />
        <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} name={tooltipName ?? valueKey}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? color : colorAlt} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
