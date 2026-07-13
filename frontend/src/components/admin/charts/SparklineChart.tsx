"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: Array<{ value: number }>;
  color?: string;
  prefix?: string;
  height?: number;
}

export default function SparklineChart({
  data,
  color = "#EF4444",
  prefix = "₹",
  height = 64,
}: Props) {
  const safeData = data.length >= 2 ? data : [{ value: 0 }, { value: 0 }, { value: 0 }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={safeData} margin={{ top: 4, right: 6, bottom: 4, left: 6 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 }}
        />
        <Tooltip
          contentStyle={{
            fontSize: 9.4,
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #E2E8F0",
          }}
          formatter={(v) => [`${prefix}${Number(v ?? 0).toLocaleString("en-IN")}`, "Revenue"]}
          labelFormatter={() => ""}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
