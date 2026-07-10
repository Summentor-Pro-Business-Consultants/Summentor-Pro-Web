"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  value: number;
  total: number;
  centerLabel: string;
  color?: string;
  size?: number;
}

export default function RadialGaugeChart({
  value,
  total,
  centerLabel,
  color = "#EF4444",
  size = 180,
}: Props) {
  const safeTotal = total > 0 ? total : 1;
  const safeValue = Math.min(Math.max(0, value), safeTotal);
  const remaining = safeTotal - safeValue;
  const isEmpty = safeValue === 0;

  const data = isEmpty
    ? [{ name: "empty", value: 1 }]
    : [
        { name: "filled", value: safeValue },
        { name: "remaining", value: remaining > 0 ? remaining : 0 },
      ];

  return (
    <div style={{ position: "relative", width: "100%", height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="62%"
            outerRadius="84%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
            paddingAngle={!isEmpty && remaining > 0 ? 2 : 0}
          >
            {isEmpty ? (
              <Cell fill="#F1F5F9" />
            ) : (
              <>
                <Cell fill={color} />
                <Cell fill="#F1F5F9" />
              </>
            )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: size >= 180 ? 32 : 24,
            fontWeight: 700,
            color: "#1E293B",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 10.1, color: "#64748B", marginTop: 4, whiteSpace: "nowrap" }}>
          {centerLabel}
        </div>
      </div>
    </div>
  );
}
