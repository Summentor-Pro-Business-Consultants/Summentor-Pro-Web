/**
 * ContactsPage — /app/admin/contacts/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * Admins need to review and manage all contact form submissions from the public
 * website. This page provides a searchable, filterable, paginated table of every
 * contact, with inline status management and a click-to-expand detail row for
 * fields that don't fit in the main table.
 *
 * WHAT IT RENDERS:
 * 1. AdminHeader — page title with total count subtitle
 * 2. Filter bar — free-text search input + status dropdown + refresh button
 * 3. Data table — one row per contact with sortable columns:
 *    Name, Organisation, Email, Sector, Location, Budget, Status, Date, Delete
 * 4. Expandable detail row — clicking any row reveals phone, referral source,
 *    and message fields that are too verbose for the main table
 * 5. Pagination controls — prev/next buttons, shown only when total > 15
 *
 * STATE MANAGEMENT:
 * All data lives in local component state. The `load` function is wrapped in
 * useCallback so its reference stays stable — it is the sole dependency of the
 * useEffect that triggers fetches when page/status/search changes.
 *
 * STATUS EDITING:
 * The status column uses a styled <select> instead of StatusBadge, allowing
 * admins to change a contact's status in-place without opening a modal.
 * stopPropagation on the select's click/change events prevents them from
 * toggling the expand row.
 *
 * HOW IT FITS:
 * Rendered at /admin/contacts. Uses adminApi.listContacts, adminApi.updateContactStatus,
 * and adminApi.deleteContact from /lib/admin-api.ts.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";

/**
 * Contact — the shape of a contact record returned by the API.
 * Optional fields (phone, designation, etc.) are omitted from the payload
 * when the user left them blank in the public contact form.
 */
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  organisation: string;
  designation?: string;
  email: string;
  phone?: string;
  location?: string;
  industrySector: string;
  referralSource?: string;
  budget?: string;
  message?: string;
  status: string;
  createdAt: string;
}

/**
 * th / td — shared inline styles for table header and data cells.
 * Defined at module scope so they can be spread onto every <th> and <td>
 * without repeating the same object literal 20+ times.
 */
const th: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748B",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  background: "#F8FAFC",
  borderBottom: "1px solid #E2E8F0",
  whiteSpace: "nowrap", // Prevent header text from wrapping
};
const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
  color: "#1E293B",
  borderBottom: "1px solid #F1F5F9",
};

/** The three valid status values for a contact submission */
const STATUS_OPTIONS = ["new", "reviewed", "replied"];

/**
 * STATUS_COLORS — colour pairs for the inline status <select> element.
 * Styled to look like a coloured badge while remaining an interactive dropdown.
 */
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: "#EFF6FF", color: "#2563EB" },
  reviewed: { bg: "#FFFBEB", color: "#D97706" },
  replied: { bg: "#F0FDF4", color: "#16A34A" },
};

/**
 * ContactsPage
 *
 * Admin page for browsing, filtering, and managing all contact form submissions.
 */
export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // "" = all statuses
  const [search, setSearch] = useState(""); // Free-text search across name/email/org
  const [loading, setLoading] = useState(true);
  // ID of the currently expanded row, or null if none is open
  const [expanded, setExpanded] = useState<string | null>(null);

  /**
   * load — fetches the current page of contacts from the API.
   * Wrapped in useCallback so its identity is stable across renders — this
   * prevents an infinite loop in the useEffect below, which lists `load`
   * as a dependency.
   */
  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 15 };
    // Only include filter params when they have a value (avoids sending ?status=&search=)
    if (status) params["status"] = status;
    if (search) params["search"] = search;
    adminApi
      .listContacts(params)
      .then((d) => {
        setContacts(d.data as Contact[]);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status, search]);

  // Re-fetch whenever page, status filter, or search term changes
  useEffect(() => {
    load();
  }, [load]);

  /**
   * updateStatus — patches a single contact's status via the API and refreshes
   * the list to show the updated value. Called by the inline <select> onChange.
   */
  const updateStatus = async (id: string, s: string) => {
    await adminApi.updateContactStatus(id, s).catch(() => {});
    load();
  };

  /**
   * deleteContact — asks for confirmation before permanently deleting a contact.
   * Uses browser confirm() for simplicity — no modal needed for a destructive but
   * reversible (in DB backup terms) action.
   */
  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await adminApi.deleteContact(id).catch(() => {});
    load();
  };

  /** COLS — ordered list of column header labels rendered in the <thead> */
  const COLS = [
    "Name",
    "Organisation",
    "Email",
    "Sector",
    "Location",
    "Budget",
    "Status",
    "Date",
    "",
  ];

  return (
    <div>
      <AdminHeader title="Contacts" subtitle={`${total} total submissions`} />

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Free-text search — resets page to 1 to avoid showing an empty page */}
        <input
          placeholder="Search name, email, org…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            fontSize: 14,
            width: 240,
          }}
        />
        {/* Status filter — also resets page to 1 */}
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
            fontSize: 14,
          }}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {/* Manual refresh button — useful after external changes */}
        <button
          onClick={load}
          style={{
            padding: "8px 12px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={15} color="#64748B" />
        </button>
      </div>

      {/* ── Data table ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        {/* overflowX:auto allows the table to scroll horizontally on small screens */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {COLS.map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* ── Loading state ─────────────────────────────────────────── */}
              {loading ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: "40px" }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                /* ── Empty state ──────────────────────────────────────────── */
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: "40px" }}
                  >
                    No contacts found
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  // React fragment allows returning two sibling <tr> elements per contact
                  // (the data row + the optional expanded detail row)
                  <>
                    {/* ── Main data row ──────────────────────────────────── */}
                    {/* Clicking the row toggles the expanded detail row for this contact */}
                    <tr
                      key={c.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    >
                      <td style={td}>
                        <div style={{ fontWeight: 500 }}>
                          {c.firstName} {c.lastName}
                        </div>
                        {/* Designation shown as a sub-line when present */}
                        {c.designation && (
                          <div style={{ fontSize: 12, color: "#94A3B8" }}>{c.designation}</div>
                        )}
                      </td>
                      <td style={td}>{c.organisation}</td>
                      {/* whiteSpace:nowrap prevents the email from wrapping mid-address */}
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{c.email}</td>
                      <td style={td}>{c.industrySector}</td>
                      <td style={{ ...td, color: "#64748B" }}>{c.location ?? "—"}</td>
                      <td style={{ ...td, color: "#64748B" }}>{c.budget ?? "—"}</td>
                      <td style={td}>
                        {/* ── Inline status editor ──────────────────────── */}
                        {/*
                        stopPropagation on both click and change prevents the row's
                        onClick (expand toggle) from firing when the admin interacts
                        with the select dropdown.
                      */}
                        <select
                          value={c.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateStatus(c.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            border: "none",
                            borderRadius: 6,
                            padding: "3px 8px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            // Spread the colour pair so the select looks like a badge
                            ...(STATUS_COLORS[c.status] ?? {}),
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ ...td, color: "#94A3B8", fontSize: 12, whiteSpace: "nowrap" }}>
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      {/* Delete cell — stopPropagation prevents row expand on click */}
                      <td style={td} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => deleteContact(c.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                          }}
                        >
                          <Trash2 size={15} color="#EF4444" />
                        </button>
                      </td>
                    </tr>

                    {/* ── Expandable detail row ──────────────────────────── */}
                    {/*
                    Rendered as a second <tr> only when this contact's ID matches
                    the `expanded` state. Uses colSpan to span all columns.
                    Shows the verbose fields (phone, referral source, message)
                    that don't fit in the main table.
                  */}
                    {expanded === c.id && (
                      <tr key={`${c.id}-detail`}>
                        <td
                          colSpan={COLS.length}
                          style={{
                            background: "#F8FAFC",
                            padding: "16px 20px",
                            borderBottom: "1px solid #E2E8F0",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: "12px 24px",
                            }}
                          >
                            {c.phone && (
                              <div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    marginBottom: 2,
                                  }}
                                >
                                  Phone
                                </div>
                                <div style={{ fontSize: 14, color: "#1E293B" }}>{c.phone}</div>
                              </div>
                            )}
                            {c.referralSource && (
                              <div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    marginBottom: 2,
                                  }}
                                >
                                  Referral Source
                                </div>
                                <div style={{ fontSize: 14, color: "#1E293B" }}>
                                  {c.referralSource}
                                </div>
                              </div>
                            )}
                            {c.message && (
                              // gridColumn: "1 / -1" makes the message span the full grid width
                              <div style={{ gridColumn: "1 / -1" }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    marginBottom: 4,
                                  }}
                                >
                                  Additional Details
                                </div>
                                {/* whiteSpace:pre-wrap preserves line breaks the user typed */}
                                <div
                                  style={{
                                    fontSize: 14,
                                    color: "#1E293B",
                                    lineHeight: 1.35,
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {c.message}
                                </div>
                              </div>
                            )}
                            {/* Fallback when no extra fields are populated */}
                            {!c.phone && !c.referralSource && !c.message && (
                              <div style={{ fontSize: 13, color: "#94A3B8" }}>
                                No additional details provided.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {/* Only rendered when there are more contacts than the page size (15) */}
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
            <span style={{ fontSize: 13, color: "#64748B" }}>
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
                  fontSize: 13,
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
                  fontSize: 13,
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
