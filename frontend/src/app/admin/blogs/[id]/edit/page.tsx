/**
 * EditBlogPage — /app/admin/blogs/[id]/edit/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * This page lets admins update an existing blog post. It shares the same
 * authoring layout and fields as NewBlogPage but starts by fetching the
 * current post data and pre-filling the form — instead of starting blank.
 *
 * KEY DIFFERENCES from NewBlogPage:
 * 1. On mount, fetches the existing blog via adminApi.getBlog(id) and hydrates
 *    all form fields. A loading spinner is shown until the data arrives.
 * 2. The "Save" sidebar card adapts its button labels based on `currentStatus`:
 *    - If "published": shows "Update Published Post" + "Revert to Draft"
 *    - If "draft": shows "Publish" + "Save Draft"
 *    This mirrors the mental model of what the action will actually do.
 * 3. The page heading shows the current status as a small badge.
 * 4. Calls adminApi.updateBlog (PATCH) instead of adminApi.createBlog (POST).
 *
 * SLUG HANDLING:
 * The same `toSlug` + `slugEdited` pattern from NewBlogPage is used.
 * When the existing slug is loaded from the API it is set directly (not generated
 * from the title) because `slugEdited` starts as false. If the admin then edits
 * the title field, the slug will update — but since `slugEdited` is still false
 * at that point, changing the title again would overwrite manual tweaks. This is
 * the same tradeoff as in NewBlogPage and is acceptable for an admin tool.
 *
 * HOW IT FITS:
 * Rendered at /admin/blogs/[id]/edit. [id] is the blog post's UUID.
 * Navigated to from BlogsPage via the pencil icon on each row.
 * Uses adminApi.getBlog and adminApi.updateBlog from /lib/admin-api.ts.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import RichTextEditor from "@/components/admin/RichTextEditor";

/** The two possible publish states */
type Status = "draft" | "published";

/**
 * BlogData — the shape of a blog post returned by adminApi.getBlog().
 * Nullable fields are those the author may have left blank when creating the post.
 */
interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  author: string;
  tags: string;
  status: string;
}

/**
 * toSlug — converts a plain-text title to a URL-safe slug.
 * Identical to the version in NewBlogPage — see that file for full documentation.
 */
function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

// ─── Shared inline styles (same as NewBlogPage) ───────────────────────────────
const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748B",
  letterSpacing: "0.04em",
  marginBottom: 6,
};
const input: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 12px",
  fontSize: 14,
  color: "#1E293B",
  border: "1px solid #E2E8F0",
  borderRadius: 7,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  padding: "24px 28px",
};

/**
 * EditBlogPage
 *
 * Full-page edit form for an existing blog post identified by [id] in the URL.
 * Fetches the post on mount, pre-fills the form, and saves changes via PATCH.
 */
export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  // Read the blog post ID from the dynamic URL segment /admin/blogs/[id]/edit
  const id = params["id"] as string;

  // ── Form field state ──────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  // Tracks whether the admin has manually edited the slug
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(""); // Raw HTML from RichTextEditor
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  // The post's current publish status, used to adapt the Save button labels
  const [currentStatus, setCurrentStatus] = useState<Status>("draft");

  // ── UI state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true); // True while fetching the post
  const [saving, setSaving] = useState(false); // True while submitting changes
  const [error, setError] = useState("");

  /**
   * Initial data fetch — loads the existing post and hydrates all form fields.
   * Runs once when the component mounts (id never changes during the component's
   * lifecycle since navigating to a different post would unmount and remount).
   */
  useEffect(() => {
    adminApi
      .getBlog(id)
      .then((d) => {
        const b = d as BlogData;
        // Hydrate every form field from the loaded blog data
        setTitle(b.title);
        setSlug(b.slug);
        // Null-coalesce optional string fields to empty string for controlled inputs
        setExcerpt(b.excerpt ?? "");
        setContent(b.content);
        setCoverImage(b.coverImage ?? "");
        setAuthor(b.author);
        setTags(b.tags);
        setCurrentStatus(b.status as Status);
      })
      .catch(() => setError("Failed to load blog post."))
      .finally(() => setLoading(false));
  }, [id]);

  /**
   * handleTitleChange — updates the title and regenerates the slug from it,
   * unless the admin has already manually edited the slug field.
   */
  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugEdited) setSlug(toSlug(v));
  };

  /**
   * save — validates and submits the updated blog post via adminApi.updateBlog.
   *
   * @param status - The target status ("published" or "draft").
   *
   * Sending "draft" for a currently-published post effectively unpublishes it.
   * Sending "published" for a draft makes it live on the website.
   */
  const save = async (status: Status) => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminApi.updateBlog(id, {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content,
        coverImage: coverImage.trim() || undefined,
        author: author.trim() || undefined,
        tags: tags.trim() || undefined,
        status,
      });
      router.push("/admin/blogs"); // Return to list after successful save
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Show a simple loading placeholder while the post data is being fetched
  if (loading) return <div style={{ color: "#94A3B8", padding: 40 }}>Loading…</div>;

  return (
    <div>
      {/* ── Page header with breadcrumb + current status badge ───────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link
          href="/admin/blogs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#64748B",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: 4 }} />
          Back
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>
          Edit Blog Post
        </h1>
        {/* Status badge next to the title so the admin always knows the post's state */}
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            background: currentStatus === "published" ? "#F0FDF4" : "#F1F5F9",
            color: currentStatus === "published" ? "#16A34A" : "#64748B",
          }}
        >
          {currentStatus}
        </span>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}
      >
        {/* ── Left: main content fields ─────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title + Slug card */}
          <div style={card}>
            <div style={{ marginBottom: 16 }}>
              <label style={label}>
                Title <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title…"
                style={{ ...input, fontSize: 18, fontWeight: 600, height: 48 }}
              />
            </div>
            <div>
              <label style={label}>Slug</label>
              {/* Monospace font makes the URL-slug characters easier to read/edit */}
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                placeholder="url-slug"
                style={{ ...input, fontFamily: "monospace", fontSize: 13, color: "#64748B" }}
              />
              <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                Public URL: /blogs/{slug || "…"}
              </p>
            </div>
          </div>

          {/* Body content — RichTextEditor syncs with `content` state via value prop */}
          <div style={card}>
            <label style={label}>
              Content <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Excerpt — used in blog listing cards on the public website */}
          <div style={card}>
            <label style={label}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Short description shown in blog listings…"
              style={{ ...input, height: "auto", padding: "10px 12px", resize: "vertical" }}
            />
          </div>
        </div>

        {/* ── Right: sidebar (save controls + metadata) ─────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Save card — button labels adapt to the current post status */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", margin: "0 0 16px" }}>
              Save
            </h3>
            {error && <p style={{ fontSize: 13, color: "#EF4444", marginBottom: 12 }}>{error}</p>}

            {/* Primary action: update if published, publish if draft */}
            <button
              disabled={saving}
              onClick={() => save("published")}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 7,
                border: "none",
                background: "#3C50E0",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
                marginBottom: 8,
              }}
            >
              {currentStatus === "published"
                ? saving
                  ? "Saving…"
                  : "Update Published Post"
                : saving
                  ? "Saving…"
                  : "Publish"}
            </button>

            {/* Secondary action: shown only for published posts — allows unpublishing */}
            {currentStatus === "published" && (
              <button
                disabled={saving}
                onClick={() => save("draft")}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 7,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  color: "#64748B",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: saving ? "wait" : "pointer",
                  marginBottom: 8,
                }}
              >
                Revert to Draft
              </button>
            )}

            {/* Secondary action: shown only for drafts — saves without publishing */}
            {currentStatus === "draft" && (
              <button
                disabled={saving}
                onClick={() => save("draft")}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 7,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  color: "#64748B",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: saving ? "wait" : "pointer",
                }}
              >
                Save Draft
              </button>
            )}
          </div>

          {/* Details card — metadata fields */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", margin: "0 0 16px" }}>
              Details
            </h3>
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={input}
                placeholder="Author name"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={label}>
                Tags <span style={{ fontWeight: 400, color: "#94A3B8" }}>(comma-separated)</span>
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={input}
                placeholder="Strategy, MSME, Growth"
              />
            </div>
            <div>
              <label style={label}>Cover Image URL</label>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                style={input}
                placeholder="https://…"
              />
              {/* Live cover image preview — hides itself on broken URLs via onError */}
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginTop: 8,
                  }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
