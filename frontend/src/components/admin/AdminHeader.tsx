/**
 * AdminHeader — /components/admin/AdminHeader.tsx
 *
 * WHY THIS FILE EXISTS:
 * Every admin page needs a consistent title bar at the top of its content area.
 * This component provides that shared header so individual pages don't have to
 * duplicate the same heading + spacing markup.
 *
 * WHAT IT RENDERS:
 * A horizontal bar with two sections:
 *   LEFT  — Primary page title (large h1) and an optional subtitle line.
 *   RIGHT — An optional action slot for a button or link (e.g. "Create Event",
 *           "New Post"). Passing nothing here leaves the right side empty.
 *
 * USAGE EXAMPLE:
 *   <AdminHeader
 *     title="Events"
 *     subtitle="42 total events"
 *     action={<button onClick={openModal}>Create Event</button>}
 *   />
 *
 * HOW IT FITS:
 * Rendered at the top of every admin page component, just below the AdminShell's
 * padding. It does not contain navigation — that lives in Sidebar.
 */

/** Props accepted by AdminHeader */
interface AdminHeaderProps {
  /** Primary heading shown as an <h1>. Required. */
  title: string;
  /** Optional secondary line rendered below the title in muted text. */
  subtitle?: string;
  /**
   * Optional JSX element placed on the right side of the header.
   * Typically a primary action button (e.g. "Create Event", "New Post").
   */
  action?: React.ReactNode;
}

/**
 * AdminHeader
 *
 * Reusable page-level header for admin views.
 * Renders the page title on the left and an optional action element on the right.
 */
export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28, // Consistent spacing below the header before page content
      }}
    >
      {/* Left: title + optional subtitle */}
      <div>
        <h1
          style={{
            fontSize: 20.6,
            fontWeight: 700,
            color: "#1E293B",
            fontFamily: "var(--sp-font-sans)", // Uses the design-system CSS variable
            margin: 0,
          }}
        >
          {title}
        </h1>

        {/* Subtitle is optional — only renders when a value is provided */}
        {subtitle && <p style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>{subtitle}</p>}
      </div>

      {/* Right: action slot — only renders when an action element is provided */}
      {action && <div>{action}</div>}
    </div>
  );
}
