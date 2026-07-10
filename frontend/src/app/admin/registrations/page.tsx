/**
 * RegistrationsPage — /app/admin/registrations/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * EventDetailPage (at /admin/events/[id]) shows registrations scoped to one event.
 * This page is the complementary cross-event view — it shows ALL registrations
 * from all events in a single searchable, filterable, paginated list, so admins
 * can search for a specific person across all events at once without visiting
 * each event individually.
 *
 * WHAT IT RENDERS:
 * 1. AdminHeader — "Registrations" title + total count
 * 2. Filter bar — free-text search + status dropdown
 * 3. Registrations table — Name, Email, Company, Event title (truncated with ellipsis),
 *    City, Status (inline editable select), Date
 * 4. Pagination — prev/next when total > 15
 *
 * KEY DIFFERENCE from EventDetailPage:
 * Each row shows the associated Event title and city (via the nested `event` object
 * from the API), because here we are looking across all events, not within one.
 *
 * HOW IT FITS:
 * Rendered at /admin/registrations. Navigated to from the Sidebar "Registrations"
 * link. Uses adminApi.listRegistrations and adminApi.updateRegistrationStatus.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";

/**
 * Registration — shape of a registration returned by the global list endpoint.
 * Includes a nested `event` object with the event title and city so this page
 * can show which event each registration belongs to without extra API calls.
 */
interface Registration {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  createdAt: string;
  event: { title: string; city: string };
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

/** All valid registration workflow statuses */
const STATUS_OPTIONS = ["pending", "confirmed", "attended", "cancelled"];

/**
 * RegistrationsPage
 *
 * Cross-event registration browser: search and manage registrations from all
 * events in one unified view.
 */
export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // "" = all statuses
  const [search, setSearch] = useState(""); // Free-text search on name/email
  const [loading, setLoading] = useState(true);

  /**
   * load — fetches the current filtered/paginated page of global registrations.
   * useCallback keeps the reference stable so the useEffect below doesn't loop.
   */
  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 15 };
    if (status) params["status"] = status;
    if (search) params["search"] = search;
    adminApi
      .listRegistrations(params)
      .then((d) => {
        setRegistrations(d.data as Registration[]);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * updateStatus — patches a single registration's status in-place.
   * Refreshes the list after the API call so filtered views stay consistent.
   */
  const updateStatus = async (id: string, s: string) => {
    await adminApi.updateRegistrationStatus(id, s).catch(() => {});
    load();
  };

  return (
    <div>
      <AdminHeader title="Registrations" subtitle={`${total} total registrations`} />

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Free-text search — reset page to 1 on input to avoid empty pages */}
        <input
          placeholder="Search name, email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            fontSize: 12.9,
            width: 220,
          }}
        />
        {/* Status filter — also resets to page 1 */}
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
                {["Name", "Email", "Company", "Event", "City", "Status", "Date"].map((h) => (
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
              ) : registrations.length === 0 ? (
                /* Empty state */
                <tr>
                  <td
                    colSpan={7}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: 40 }}
                  >
                    No registrations found
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ ...td, fontWeight: 500 }}>{r.name}</td>
                    <td style={td}>{r.email}</td>
                    <td style={td}>{r.company ?? "—"}</td>
                    <td style={{ ...td, maxWidth: 200 }}>
                      {/*
                      Event title is capped at 200px wide with text ellipsis overflow
                      to prevent long event names from pushing other columns off-screen.
                      The full title is visible in a browser tooltip via title="" if needed.
                    */}
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.event.title}
                      </span>
                    </td>
                    <td style={td}>{r.event.city}</td>
                    <td style={td}>
                      {/* ── Inline status editor ──────────────────────── */}
                      {/* Bare select blends into the cell; changing it patches the API */}
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
                    <td style={{ ...td, color: "#94A3B8", fontSize: 11, whiteSpace: "nowrap" }}>
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
