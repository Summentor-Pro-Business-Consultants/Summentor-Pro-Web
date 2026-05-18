"use client";

/**
 * FormConversionChart — grouped bar chart showing the form conversion funnel.
 *
 * For each submission channel (Connect Form, Events) it renders two side-by-side
 * bars: Page Views (blue) and Submitted (green). The visual gap between them
 * immediately shows the drop-off rate per channel — more intuitive than a table
 * of numbers.
 *
 * Data shape: { channel, views, submitted }[]
 * The `rate` field is shown in the tooltip for the "Submitted" bar only.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface ConversionDataPoint {
  channel: string;
  views: number;
  submitted: number;
}

interface Props {
  data: ConversionDataPoint[];
}

export default function FormConversionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
        barGap={4}
        barCategoryGap="35%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="channel"
          tick={{ fontSize: 12, fill: "#64748B" }}
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
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "#64748B", paddingTop: 8 }}
        />
        {/* Page Views bar — shows how many visitors reached the form page */}
        <Bar dataKey="views" name="Page Views" fill="#3C50E0" radius={[4, 4, 0, 0]} />
        {/* Submitted bar — shows how many actually filled the form */}
        <Bar dataKey="submitted" name="Submitted" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
