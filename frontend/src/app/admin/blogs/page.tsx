/**
 * BlogsPage — /app/admin/blogs/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * This page is the content management index for all blog posts on the Summentor
 * Pro website. It lets admins browse, search, filter, edit, and delete posts from
 * one view, and provides a shortcut to create new posts.
 *
 * WHAT IT RENDERS:
 * 1. AdminHeader — "Blogs" title, total post count, "New Post" link button
 * 2. Filter bar — free-text search + status dropdown (draft/published) + refresh
 * 3. Blogs table — Title (with /blogs/[slug] URL), Author, Tags (pills), Status
 *    badge, Date (publishedAt if set, else createdAt), Edit/Delete actions
 * 4. Empty state with CTA link to create the first post
 * 5. Pagination — prev/next, shown when total > 12
 *
 * TAG RENDERING:
 * Tags are stored as a comma-separated string in the DB (e.g. "Strategy,MSME").
 * They are split, trimmed, and rendered as small pill spans for visual clarity.
 *
 * DATE DISPLAY LOGIC:
 * The "Date" column shows publishedAt if the post is published, or createdAt as
 * a fallback for drafts. This gives a meaningful "went live" date for published
 * posts while still showing creation date for work-in-progress drafts.
 *
 * HOW IT FITS:
 * Rendered at /admin/blogs. Edit actions navigate to /admin/blogs/[id]/edit.
 * New Post links to /admin/blogs/new. Uses adminApi.listBlogs, adminApi.deleteBlog.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, RefreshCw, Pencil } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";

/**
 * Blog — the shape of a blog post row returned by the list endpoint.
 * `tags` is a comma-separated string, not an array — it's split during rendering.
 */
interface Blog {
  id: string;
  title: string;
  slug: string; // Used to build the public-facing /blogs/[slug] URL
  excerpt?: string;
  author: string;
  tags: string; // Comma-separated, e.g. "Strategy,MSME,Growth"
  status: string; // "draft" | "published"
  publishedAt?: string; // ISO timestamp, only present when status === "published"
  createdAt: string;
}

/** Shared table cell styles */
const th: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 10.2,
  fontWeight: 600,
  color: "#64748B",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  background: "#F8FAFC",
  borderBottom: "1px solid #E2E8F0",
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 12,
  color: "#1E293B",
  borderBottom: "1px solid #F1F5F9",
  verticalAlign: "middle",
};

/**
 * STATUS_COLORS — colour pairs for the blog status badge.
 * Blog posts use only "draft" and "published", so only two entries are needed.
 */
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#F1F5F9", color: "#64748B" }, // Grey — not yet visible to public
  published: { bg: "#F0FDF4", color: "#16A34A" }, // Green — live on the website
};

/** Valid blog post status values */
const STATUS_OPTIONS = ["draft", "published"];

/**
 * BlogsPage
 *
 * Admin CMS index for all blog posts. Search, filter, paginate, edit, and delete.
 */
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // "" = all statuses
  const [search, setSearch] = useState(""); // Free-text search on title/author
  const [loading, setLoading] = useState(true);

  /**
   * load — fetches the current filtered/paginated blog list.
   * Page size is 12 (vs 15 for other pages) since blogs are typically fewer
   * in number and each row is slightly taller (tags take up more space).
   */
  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 12 };
    if (status) params["status"] = status;
    if (search) params["search"] = search;
    adminApi
      .listBlogs(params)
      .then((d) => {
        setBlogs(d.data as Blog[]);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * deleteBlog — permanently deletes a post after confirmation.
   * The `title` param is included in the confirm prompt so the admin can
   * see exactly which post they are about to remove.
   */
  const deleteBlog = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await adminApi.deleteBlog(id).catch(() => {});
    load();
  };

  /** COLS — ordered column header labels */
  const COLS = ["Title", "Author", "Tags", "Status", "Date", ""];

  return (
    <div>
      <AdminHeader
        title="Blogs"
        subtitle={`${total} total posts`}
        // "New Post" is a Link (not a button) since it navigates to a new page
        action={
          <Link
            href="/admin/blogs/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 7,
              background: "#3C50E0",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Plus size={15} />
            New Post
          </Link>
        }
      />

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Search by title or author name */}
        <input
          placeholder="Search title, author…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            fontSize: 12,
            width: 240,
          }}
        />
        {/* Status filter: All / Draft / Published */}
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
            fontSize: 12,
          }}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {/* Manual refresh — useful when content is updated elsewhere */}
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

      {/* ── Blogs table ──────────────────────────────────────────────────── */}
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
                {COLS.map((h) => (
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
                    colSpan={COLS.length}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: "40px" }}
                  >
                    Loading…
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                /* Empty state with actionable CTA link */
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{ ...td, textAlign: "center", color: "#94A3B8", padding: "48px" }}
                  >
                    No posts yet.{" "}
                    <Link href="/admin/blogs/new" style={{ color: "#3C50E0" }}>
                      Create your first blog post →
                    </Link>
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b.id}>
                    <td style={td}>
                      {/* Title capped at 300px wide to prevent layout stretching */}
                      <div style={{ fontWeight: 500, maxWidth: 300 }}>{b.title}</div>
                      {/* Slug shown as the public URL path for quick reference */}
                      <div style={{ fontSize: 10.2, color: "#94A3B8", marginTop: 2 }}>
                        /blogs/{b.slug}
                      </div>
                    </td>
                    <td style={td}>{b.author}</td>
                    <td style={{ ...td, color: "#64748B", fontSize: 11.2 }}>
                      {/*
                      Tags: split the comma-separated string, trim whitespace,
                      filter out any empty strings (from trailing commas),
                      and render each as a small grey pill.
                    */}
                      {b.tags
                        ? b.tags
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .map((t) => (
                              <span
                                key={t}
                                style={{
                                  display: "inline-block",
                                  background: "#F1F5F9",
                                  borderRadius: 4,
                                  padding: "1px 7px",
                                  marginRight: 4,
                                  marginBottom: 2,
                                  fontSize: 9.4,
                                }}
                              >
                                {t}
                              </span>
                            ))
                        : "—"}
                    </td>
                    <td style={td}>
                      {/* Status badge — uses STATUS_COLORS spread for bg/color */}
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 10.2,
                          fontWeight: 600,
                          ...(STATUS_COLORS[b.status] ?? {}),
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={{ ...td, color: "#94A3B8", fontSize: 10.2, whiteSpace: "nowrap" }}>
                      {/*
                      Show publishedAt if available (meaningful "went live" date),
                      otherwise fall back to createdAt (draft creation date).
                    */}
                      {b.publishedAt
                        ? new Date(b.publishedAt).toLocaleDateString("en-IN")
                        : new Date(b.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ ...td, whiteSpace: "nowrap" }}>
                      {/* ── Row actions ─────────────────────────────────── */}
                      <div style={{ display: "flex", gap: 4 }}>
                        {/* Edit: navigates to the edit page for this post */}
                        <Link
                          href={`/admin/blogs/${b.id}/edit`}
                          style={{
                            display: "inline-flex",
                            padding: 6,
                            borderRadius: 5,
                            background: "#EFF6FF",
                            color: "#2563EB",
                            textDecoration: "none",
                          }}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        {/* Delete: destructive, requires confirmation */}
                        <button
                          onClick={() => deleteBlog(b.id, b.title)}
                          style={{
                            display: "inline-flex",
                            padding: 6,
                            borderRadius: 5,
                            background: "#FEF2F2",
                            border: "none",
                            cursor: "pointer",
                            color: "#EF4444",
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
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
        {/* Page size is 12 for blogs — threshold is 12, not 15 */}
        {total > 12 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: "1px solid #F1F5F9",
            }}
          >
            <span style={{ fontSize: 11.2, color: "#64748B" }}>
              Page {page} of {Math.ceil(total / 12)}
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
                  fontSize: 11.2,
                }}
              >
                Prev
              </button>
              <button
                disabled={page >= Math.ceil(total / 12)}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 11.2,
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
