/**
 * EventDetailPage — /app/admin/events/[id]/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * Each event can have many registrations. Rather than crowding the events list
 * with all registration data, this dedicated page drills into a single event
 * and displays its registrations in a searchable, filterable, paginated table.
 * The [id] dynamic segment in the folder name means Next.js routes
 * /admin/events/abc-123 here with params.id = "abc-123".
 *
 * WHAT IT RENDERS:
 * 1. "Back to Events" breadcrumb link
 * 2. AdminHeader — "Event Registrations" title + total count
 * 3. Status filter dropdown — filter registrations by their workflow status
 * 4. Registrations table — Name, Email, Company, Phone, Status (inline select),
 *    Registered On date
 * 5. Pagination — prev/next, shown only when total > 15
 *
 * DYNAMIC ROUTE:
 * useParams() reads the event ID from the URL without needing to declare it as
 * a function prop. This is the App Router pattern for dynamic segments.
 *
 * STATUS EDITING:
 * Each registration row has an inline <select> so the admin can change a
 * registration's status (pending → confirmed → attended) without leaving the page.
 *
 * HOW IT FITS:
 * Navigated to from EventsAdminPage when an admin clicks an event title.
 * Uses adminApi.getEventRegistrations and adminApi.updateRegistrationStatus.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";

/**
 * Registration — the shape of a registration record for a single event.
 * The event details themselves are not needed here (they're implicit from the URL).
 */
interface Registration {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: string;
  createdAt: string;
}

/** Shared table cell styles */
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

/** All valid registration statuses in their natural workflow order */
const STATUS_OPTIONS = ["pending", "confirmed", "attended", "cancelled"];

/**
 * EventDetailPage
 *
 * Displays and manages all registrations for a single event identified by [id]
 * in the URL.
 */
export default function EventDetailPage() {
  // Read the event ID from the dynamic URL segment (/admin/events/[id])
  const { id } = useParams<{ id: string }>();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // "" = all statuses
  const [loading, setLoading] = useState(true);

  /**
   * load — fetches registrations for this specific event with current filters.
   * `id` is included in the dependency array because it comes from the URL
   * and could theoretically change if Next.js reuses the component for a
   * different event (though in practice the user navigates explicitly).
   */
  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 15 };
    if (status) params["status"] = status;
    adminApi
      .getEventRegistrations(id, params)
      .then((d) => {
        setRegistrations(d.data as Registration[]);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, page, status]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * updateStatus — patches a single registration's status.
   * Used by the inline select in each table row. Refreshes the list after the
   * API call so totals and filtered views stay accurate.
   */
  const updateStatus = async (regId: string, s: string) => {
    await adminApi.updateRegistrationStatus(regId, s).catch(() => {});
    load();
  };

  return (
    <div>
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <Link
        href="/admin/events"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#64748B",
          textDecoration: "none",
          fontSize: 12,
          marginBottom: 20,
        }}
      >
        <ArrowLeft size={14} />
        Back to Events
      </Link>

      <AdminHeader title="Event Registrations" subtitle={`${total} total registrations`} />

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
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ── Registrations table ──────────────────────────────────────────── */}
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
                {["Name", "Email", "Company", "Phone", "Status", "Registered On"].map((h) => (
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
                    colSpan={6}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: 40 }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                /* Empty state — could be no registrations at all, or none matching the filter */
                <tr>
                  <td
                    colSpan={6}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: 40 }}
                  >
                    No registrations yet
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ ...td, fontWeight: 500 }}>{r.name}</td>
                    <td style={td}>{r.email}</td>
                    {/* Null-coalesce optional fields to an em-dash for visual consistency */}
                    <td style={td}>{r.company ?? "—"}</td>
                    <td style={td}>{r.phone ?? "—"}</td>
                    <td style={td}>
                      {/* ── Inline status editor ──────────────────────── */}
                      {/*
                      Bare <select> without decorative styles so it blends into the cell.
                      Changing the value immediately patches the API and refreshes the list.
                    */}
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        style={{
                          border: "none",
                          background: "none",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ ...td, color: "#94A3B8", fontSize: 11 }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
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
    </div>
  );
}
