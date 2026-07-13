/**
 * NewBlogPage — /app/admin/blogs/new/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * This page provides the authoring interface for creating a brand-new blog post.
 * It is a dedicated route (/admin/blogs/new) rather than a modal so the admin
 * has a full-page writing environment with no distractions.
 *
 * WHAT IT RENDERS:
 * A two-column layout (1fr | 280px sidebar):
 *
 *   LEFT column (main content):
 *     - Title input (large, 48px tall)
 *     - Slug input (auto-generated from title, but manually overridable)
 *     - RichTextEditor (TipTap WYSIWYG for the body content)
 *     - Excerpt textarea (short description for blog listing cards)
 *
 *   RIGHT sidebar:
 *     - Publish card — "Publish Now" button + "Save as Draft" button + error display
 *     - Details card — Author, Tags, Cover Image URL + live preview thumbnail
 *
 * AUTO-SLUG GENERATION:
 * The `toSlug` helper converts the title to a URL-safe slug as the admin types.
 * Once the admin manually edits the slug field, `slugEdited` flips to true and
 * auto-generation stops — preventing the slug from being overwritten mid-edit.
 *
 * DUAL SAVE ACTIONS:
 * The "Publish Now" and "Save as Draft" buttons both call the same `save(status)`
 * function with different `status` arguments, keeping the logic DRY.
 * After a successful save, the admin is redirected to /admin/blogs.
 *
 * HOW IT FITS:
 * Rendered at /admin/blogs/new. Links back to /admin/blogs.
 * Uses adminApi.createBlog from /lib/admin-api.ts.
 * RichTextEditor handles the body content; all other fields are plain inputs.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import RichTextEditor from "@/components/admin/RichTextEditor";

/** The two possible publish states for a blog post */
type Status = "draft" | "published";

/**
 * toSlug — converts a plain-text title into a URL-safe slug.
 *
 * Steps:
 *   1. Lowercase the string
 *   2. Remove all characters that aren't alphanumeric, spaces, or hyphens
 *   3. Trim leading/trailing whitespace
 *   4. Replace any whitespace runs with a single hyphen
 *   5. Collapse consecutive hyphens into one
 *   6. Truncate to 200 characters (a safe URL length)
 *
 * Example: "Hello, World! (2024)" → "hello-world-2024"
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

// ─── Shared inline styles ─────────────────────────────────────────────────────
/** label — style applied to every field label in the form */
const label: React.CSSProperties = {
  display: "block",
  fontSize: 10.2,
  fontWeight: 600,
  color: "#64748B",
  letterSpacing: "0.04em",
  marginBottom: 6,
};

/** input — base style for text inputs and the slug/author/tags/image fields */
const input: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 12px",
  fontSize: 12,
  color: "#1E293B",
  border: "1px solid #E2E8F0",
  borderRadius: 7,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

/** card — white bordered container used for each section in the two-column layout */
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  padding: "24px 28px",
};

/**
 * NewBlogPage
 *
 * Full-page authoring form for creating a new Summentor Pro blog post.
 */
export default function NewBlogPage() {
  const router = useRouter();

  // ── Form field state ──────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  // `slugEdited` tracks whether the admin has manually changed the slug.
  // When true, auto-generation from the title is disabled.
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(""); // Raw HTML from RichTextEditor
  const [coverImage, setCoverImage] = useState(""); // URL to an external image
  const [author, setAuthor] = useState("Summentor Pro Team"); // Sensible default
  const [tags, setTags] = useState(""); // Comma-separated string of tags

  // ── UI state ──────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * handleTitleChange — updates the title and, if the slug hasn't been manually
   * edited yet, also regenerates the slug from the new title.
   */
  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugEdited) setSlug(toSlug(v));
  };

  /**
   * save — validates and submits the blog post to the API.
   *
   * @param status - Either "published" (go live immediately) or "draft" (save for later).
   *
   * Validation: title and content are required. The slug is optional — if blank,
   * the backend will auto-generate one from the title.
   * After a successful save the admin is redirected to the blogs list.
   */
  const save = async (status: Status) => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminApi.createBlog({
        title: title.trim(),
        // Send slug only if non-empty; let the backend generate one otherwise
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content,
        coverImage: coverImage.trim() || undefined,
        author: author.trim() || undefined,
        tags: tags.trim() || undefined,
        status,
      });
      router.push("/admin/blogs"); // Return to the blog list after successful save
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* ── Page header with breadcrumb ───────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link
          href="/admin/blogs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#64748B",
            textDecoration: "none",
            fontSize: 12,
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: 4 }} />
          Back
        </Link>
        <h1 style={{ fontSize: 18.8, fontWeight: 700, color: "#1E293B", margin: 0 }}>
          New Blog Post
        </h1>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      {/*
        Main content column (1fr) contains the writing-heavy fields.
        Sidebar column (280px) contains the publish controls and metadata.
        alignItems:start prevents the sidebar from stretching to the content height.
      */}
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
              {/* Larger font/height for the title input to signal its importance */}
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title…"
                style={{ ...input, fontSize: 15.4, fontWeight: 600, height: 48 }}
              />
            </div>
            <div>
              <label style={label}>Slug</label>
              {/* Monospace font helps admins see the URL-safe characters clearly */}
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                placeholder="auto-generated-from-title"
                style={{ ...input, fontFamily: "monospace", fontSize: 11.2, color: "#64748B" }}
              />
              {/* Live preview of the public URL this post will be accessible at */}
              <p style={{ fontSize: 9.4, color: "#94A3B8", marginTop: 4 }}>
                Public URL: /blogs/{slug || "…"}
              </p>
            </div>
          </div>

          {/* Rich text body content card */}
          <div style={card}>
            <label style={label}>
              Content <span style={{ color: "#EF4444" }}>*</span>
            </label>
            {/* RichTextEditor is a controlled WYSIWYG that returns HTML on change */}
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Excerpt card — shown in blog listing cards on the public site */}
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

        {/* ── Right: sidebar (publish controls + metadata) ──────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Publish card — primary save actions */}
          <div style={card}>
            <h3 style={{ fontSize: 11.2, fontWeight: 700, color: "#1E293B", margin: "0 0 16px" }}>
              Publish
            </h3>
            {/* Error message rendered above the buttons so it's visible without scrolling */}
            {error && <p style={{ fontSize: 11.2, color: "#EF4444", marginBottom: 12 }}>{error}</p>}
            {/* Publish Now — immediately sets status to "published" */}
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
                fontSize: 12,
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
                marginBottom: 8,
              }}
            >
              {saving ? "Saving…" : "Publish Now"}
            </button>
            {/* Save as Draft — saves the post but keeps it hidden from the public */}
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
                fontSize: 12,
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              Save as Draft
            </button>
          </div>

          {/* Details card — metadata fields that appear alongside the post */}
          <div style={card}>
            <h3 style={{ fontSize: 11.2, fontWeight: 700, color: "#1E293B", margin: "0 0 16px" }}>
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
              {/* Tags hint: comma-separated so admins know the expected format */}
              <label style={label}>
                Tags <span style={{ fontWeight: 500, color: "#94A3B8" }}>(comma-separated)</span>
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
              {/* Live image preview — hides itself via inline onError if the URL is broken */}
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
