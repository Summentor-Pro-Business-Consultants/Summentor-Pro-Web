"use client";

/**
 * EngagementFunnelChart — horizontal funnel of the visit → submit journey.
 *
 * Each step is a full-width track with a filled bar sized to the share of
 * sessions that reached it, so the descending shape reads as a funnel at a
 * glance. Absolute session counts sit alongside the percentage because a
 * percentage alone hides whether a step is based on 5 sessions or 5,000.
 *
 * Deliberately not a Recharts chart: a funnel is four labelled rows, and
 * plain divs render it more legibly (and far more cheaply) than a bar chart
 * fighting to look like a funnel.
 *
 * Data shape: { step, sessions, pct }[]
 */

export interface FunnelStep {
  step: string;
  sessions: number;
  pct: number;
}

interface Props {
  steps: FunnelStep[];
}

// Progressive green: the deeper into the funnel, the darker the fill.
const STEP_COLORS = ["#93E7C9", "#4ED0A3", "#17B67E", "#05a171"];

export default function EngagementFunnelChart({ steps }: Props) {
  if (steps.length === 0) {
    return (
      <p style={{ color: "#94A3B8", fontSize: 11.2, textAlign: "center", padding: "28px 0" }}>
        No engagement data yet
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {steps.map((s, i) => (
        <div key={s.step}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 5,
            }}
          >
            <span style={{ fontSize: 11.2, fontWeight: 500, color: "#1E293B" }}>{s.step}</span>
            <span style={{ fontSize: 10.2, color: "#64748B" }}>
              {s.sessions.toLocaleString()} · {s.pct}%
            </span>
          </div>
          {/* Track + fill. The fill width is the share of the top-of-funnel. */}
          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 5,
              background: "#F1F5F9",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.max(s.pct, s.sessions > 0 ? 1.5 : 0)}%`,
                height: "100%",
                borderRadius: 5,
                background: STEP_COLORS[Math.min(i, STEP_COLORS.length - 1)],
                transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
