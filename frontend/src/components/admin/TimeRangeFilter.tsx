/**
 * TimeRangeFilter — /components/admin/TimeRangeFilter.tsx
 *
 * WHY THIS FILE EXISTS:
 * Several dashboard sections let the admin view metrics for a selected time
 * window (today, yesterday, last 7 days, etc.). This component provides a
 * reusable pill-button toggle group for choosing that window, keeping the
 * "period" UI logic in one place rather than duplicated per chart.
 *
 * WHAT IT RENDERS:
 * A horizontal row of pill buttons — one per period in the `periods` array.
 * The currently selected period is highlighted with the brand-blue fill;
 * all other pills use a white background with a light border.
 *
 * DESIGN PATTERN:
 * Uncontrolled → Controlled: This component is fully controlled — it does not
 * manage its own selection. The parent holds the selected value in state and
 * provides an onChange handler. This makes it easy to sync the filter value
 * with an API call in the parent.
 *
 * USAGE EXAMPLE:
 *   const [period, setPeriod] = useState("today");
 *   <TimeRangeFilter value={period} onChange={setPeriod} />
 *
 * HOW IT FITS:
 * Used in DashboardPage > WebsiteTab to gate the "New Submissions" metric
 * card. The parent passes the selected period to adminApi.newSubmissions(period).
 */

"use client";

/**
 * periods — the ordered list of selectable time windows.
 * `label` is the button text; `value` is the string sent to the API.
 * Extend this array to add more options — no other changes needed.
 */
const periods = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "7 Days", value: "week" },
  { label: "30 Days", value: "month" },
  { label: "1 Year", value: "year" },
];

/** Props accepted by TimeRangeFilter */
interface TimeRangeFilterProps {
  /** The currently selected period value (e.g. "today"). Controlled by parent. */
  value: string;
  /** Called with the new period value whenever the user clicks a different pill. */
  onChange: (value: string) => void;
}

/**
 * TimeRangeFilter
 *
 * A compact toggle group of pill buttons for selecting a time range.
 * Fully controlled — the parent owns `value` and reacts to `onChange`.
 */
export default function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          style={{
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid",
            // Active pill: brand-blue fill + white text; inactive: white fill + muted text
            borderColor: value === p.value ? "#3C50E0" : "#E2E8F0",
            background: value === p.value ? "#3C50E0" : "#fff",
            color: value === p.value ? "#fff" : "#64748B",
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
