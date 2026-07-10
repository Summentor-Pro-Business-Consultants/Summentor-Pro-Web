/**
 * EventsAdminPage — /app/admin/events/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * Admins need a central place to create, view, edit, and delete events. This page
 * provides a paginated table of all events with filtering by status, plus a modal
 * for creating or editing events without navigating away from the list.
 *
 * WHAT IT RENDERS:
 * 1. AdminHeader — title, total count, and "Create Event" action button
 * 2. Status filter dropdown — filters the table by event status
 * 3. Events table — Title (linked to detail page), City, Date, Tag, Status,
 *    Registrations count, Edit/Delete action buttons
 * 4. Pagination — prev/next, shown only when total > 15
 * 5. EventFormModal — mounted conditionally when `modal` state is set;
 *    receives the event to edit (or nothing for create mode)
 *
 * MODAL STRATEGY:
 * The `modal` state is typed as "create" | Event | null:
 *   - null       → modal is closed
 *   - "create"   → modal is open in create mode (no pre-filled data)
 *   - Event obj  → modal is open in edit mode (pre-fills form with event data)
 * This avoids a separate boolean flag alongside a selectedEvent state.
 *
 * HOW IT FITS:
 * Rendered at /admin/events. Event titles link to /admin/events/[id] where
 * admins can view and manage individual registrations.
 * Uses adminApi.listEvents, adminApi.deleteEvent from /lib/admin-api.ts.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EventFormModal from "@/components/admin/EventFormModal";

/**
 * Event — the shape of an event row returned by the list endpoint.
 * `_count.registrations` is a Prisma computed field for the registration total.
 */
interface Event {
  id: string;
  title: string;
  city: string;
  eventDate: string;
  tag: string;
  status: string;
  capacity?: number;
  _count: { registrations: number };
}

/**
 * th / td — shared inline styles for table header and data cells.
 */
const th: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "#64748B",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  background: "#F8FAFC",
  borderBottom: "1px solid #E2E8F0",
};
const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 12.9,
  color: "#1E293B",
  borderBottom: "1px solid #F1F5F9",
};

/**
 * EventsAdminPage
 *
 * Admin page for managing all Summentor Pro events. Supports creating, editing,
 * deleting, filtering by status, and paginating through results.
 */
export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // "" = all statuses
  const [loading, setLoading] = useState(true);
  /**
   * modal — drives the EventFormModal lifecycle:
   *   null      → modal hidden
   *   "create"  → open in create mode
   *   Event obj → open in edit mode, pre-filled with that event's data
   */
  const [modal, setModal] = useState<"create" | Event | null>(null);

  /**
   * load — fetches the current filtered/paginated page of events.
   * useCallback keeps the reference stable so the useEffect below doesn't
   * re-subscribe on every render.
   */
  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 15 };
    if (status) params["status"] = status;
    adminApi
      .listEvents(params)
      .then((d) => {
        setEvents(d.data as Event[]);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status]);

  // Re-fetch whenever page or status filter changes
  useEffect(() => {
    load();
  }, [load]);

  /**
   * deleteEvent — permanently deletes an event and all of its registrations.
   * Shows a confirmation prompt because this is an irreversible cascade delete.
   */
  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event and all its registrations?")) return;
    await adminApi.deleteEvent(id).catch(() => {});
    load();
  };

  return (
    <div>
      <AdminHeader
        title="Events"
        subtitle={`${total} total events`}
        // "Create Event" button opens the modal in create mode
        action={
          <button
            onClick={() => setModal("create")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#3C50E0",
              color: "#fff",
              fontSize: 12.9,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={15} />
            Create Event
          </button>
        }
      />

      {/* ── Status filter ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            fontSize: 12.9,
          }}
        >
          <option value="">All statuses</option>
          {["upcoming", "ongoing", "completed", "cancelled"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ── Events table ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {/* Last column header is empty — it holds the action buttons */}
                {["Title", "City", "Date", "Tag", "Status", "Registrations", ""].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Loading state */}
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: 40 }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : events.length === 0 ? (
                /* Empty state */
                <tr>
                  <td
                    colSpan={7}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: 40 }}
                  >
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id}>
                    <td style={td}>
                      {/* Title links to the event detail page (/admin/events/[id])
                        where individual registrations are managed */}
                      <Link
                        href={`/admin/events/${ev.id}`}
                        style={{ color: "#3C50E0", textDecoration: "none", fontWeight: 500 }}
                      >
                        {ev.title}
                      </Link>
                    </td>
                    <td style={td}>{ev.city}</td>
                    {/* whiteSpace:nowrap prevents the date from wrapping in narrow viewports */}
                    <td style={{ ...td, color: "#64748B", fontSize: 12, whiteSpace: "nowrap" }}>
                      {new Date(ev.eventDate).toLocaleDateString("en-IN")}
                    </td>
                    <td style={td}>
                      {/* Tag rendered in brand gold to visually separate it from status */}
                      <span
                        style={{
                          fontSize: 10.1,
                          fontWeight: 600,
                          color: "#C9A14A",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {ev.tag}
                      </span>
                    </td>
                    <td style={td}>
                      <StatusBadge status={ev.status} />
                    </td>
                    {/* Registration count centred for easy scanning */}
                    <td style={{ ...td, textAlign: "center" }}>{ev._count.registrations}</td>
                    <td style={td}>
                      {/* ── Row actions ─────────────────────────────────── */}
                      <div style={{ display: "flex", gap: 6 }}>
                        {/* Edit: opens modal pre-filled with this event's data */}
                        <button
                          onClick={() => setModal(ev)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                          }}
                        >
                          <Pencil size={14} color="#64748B" />
                        </button>
                        {/* Delete: triggers confirmation then cascade delete */}
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                          }}
                        >
                          <Trash2 size={14} color="#EF4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {total > 15 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: "1px solid #F1F5F9",
            }}
          >
            <span style={{ fontSize: 12, color: "#64748B" }}>
              Page {page} of {Math.ceil(total / 15)}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: page === 1 ? "#F8FAFC" : "#fff",
                  cursor: page === 1 ? "default" : "pointer",
                  fontSize: 12,
                }}
              >
                Prev
              </button>
              <button
                disabled={page >= Math.ceil(total / 15)}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── EventFormModal ───────────────────────────────────────────────── */}
      {/*
        Mounted only when modal is not null.
        When modal === "create" we pass event={undefined} for create mode.
        When modal is an Event object we pass it directly for edit mode.
        onSaved closes the modal AND refreshes the list to show the changes.
      */}
      {modal && (
        <EventFormModal
          event={modal === "create" ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}
