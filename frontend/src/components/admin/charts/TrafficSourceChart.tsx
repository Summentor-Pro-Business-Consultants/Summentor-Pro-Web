"use client";

/**
 * TrafficSourceChart — donut chart showing where visitors come from.
 *
 * Sources: direct, instagram, chatgpt, google, linkedin, twitter, other.
 * Each source has a hand-picked colour; unknown sources fall back to HSL.
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  data: Array<{ source: string; count: number }>;
}

const SOURCE_COLORS: Record<string, string> = {
  direct: "#3C50E0",
  instagram: "#E1306C",
  chatgpt: "#10B981",
  google: "#F59E0B",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  other: "#94A3B8",
};

export default function TrafficSourceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="source"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.source}
              fill={SOURCE_COLORS[entry.source] ?? `hsl(${i * 60}, 70%, 50%)`}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 11.2 }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 10.2, color: "#64748B" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
