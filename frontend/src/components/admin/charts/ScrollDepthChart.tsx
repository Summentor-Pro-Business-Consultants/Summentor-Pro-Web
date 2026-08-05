"use client";

/**
 * ScrollDepthChart — how far down the page visitors actually get.
 *
 * Bars are the share of sessions reaching each milestone (25/50/75/100 %).
 * Buckets are cumulative by construction: a session that hit 75 % also passed
 * 50 %, so the series always descends — a steep drop between two bars is the
 * signal worth acting on.
 *
 * Data shape: { depth, sessions, pct }[]
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface ScrollBucket {
  depth: string;
  sessions: number;
  pct: number;
}

interface Props {
  buckets: ScrollBucket[];
}

export default function ScrollDepthChart({ buckets }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={buckets} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="depth"
          tick={{ fontSize: 10.2, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 9.4, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          unit="%"
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 11.2 }}
          cursor={{ fill: "#F8FAFC" }}
          // Show the percentage alongside the raw session count — a bare
          // percentage hides whether it's based on 5 sessions or 5,000.
          formatter={(value, _name, item) => {
            const sessions = (item?.payload as ScrollBucket | undefined)?.sessions ?? 0;
            return [`${String(value)}% (${sessions} sessions)`, "Reached"];
          }}
        />
        <Bar dataKey="pct" name="Reached" fill="#05a171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
