/**
 * RichTextEditor — /components/admin/RichTextEditor.tsx
 *
 * WHY THIS FILE EXISTS:
 * Blog posts need formatted content (headings, bold, lists, links, etc.) that a
 * plain <textarea> cannot provide. This component wraps TipTap — a headless
 * ProseMirror-based rich-text framework — and adds a custom icon toolbar so
 * admins have a familiar word-processor-style editing experience without leaving
 * the admin panel.
 *
 * WHAT IT RENDERS:
 * A bordered container split into two parts:
 *   1. TOOLBAR — a row of icon buttons (bold, italic, headings, lists, etc.)
 *      Each button toggles a TipTap formatting mark or node. Active formats are
 *      highlighted with the brand-blue fill.
 *   2. EDITOR AREA — the contenteditable ProseMirror surface rendered by
 *      <EditorContent>. The placeholder text appears via a CSS trick using the
 *      TipTap Placeholder extension.
 *
 * EXTERNAL VALUE SYNC:
 * The component receives `value` (HTML string) from the parent and calls
 * `onChange(html)` on every keystroke. A useEffect watches for externally
 * changed `value` props (e.g. when loading an existing blog post) and pushes
 * the new content into the editor without creating an undo entry (the `false`
 * second argument to setContent).
 *
 * CONTROLLED vs UNCONTROLLED:
 * TipTap editors are internally stateful. We bridge them to React's controlled
 * pattern by calling onChange inside onUpdate, and by syncing incoming value
 * changes via the useEffect. This means the parent always holds the canonical
 * HTML string.
 *
 * HOW IT FITS:
 * Used in NewBlogPage (/admin/blogs/new) and EditBlogPage (/admin/blogs/[id]/edit).
 */

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
  Minus,
} from "lucide-react";
import { useEffect, useCallback } from "react";

/** Props accepted by RichTextEditor */
interface Props {
  /** Current HTML content string. The parent owns this value (controlled). */
  value: string;
  /** Called with the updated HTML string on every editor change. */
  onChange: (html: string) => void;
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string;
}

/**
 * btn — returns inline CSSProperties for a toolbar icon button.
 * When `active` is true the button gets a brand-blue background + white icon,
 * indicating the format is currently applied at the cursor.
 *
 * @param active - Whether this format is currently active at the cursor.
 */
const btn = (active = false): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
  background: active ? "#3C50E0" : "transparent",
  color: active ? "#fff" : "#475569",
  transition: "background 0.12s, color 0.12s",
});

/**
 * RichTextEditor
 *
 * A TipTap-powered WYSIWYG editor with a custom icon toolbar.
 * Fully controlled: the parent holds the HTML value and receives updates via onChange.
 */
export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  /**
   * useEditor — initialises the TipTap editor instance.
   * Extensions:
   *   - StarterKit: includes paragraph, heading, bold, italic, lists, blockquote,
   *                 code, horizontal rule, undo/redo history, and more.
   *   - Placeholder: shows grey placeholder text when the editor is empty (CSS-based).
   *   - Link: allows creating hyperlinks; openOnClick:false prevents navigation
   *           while editing so the admin can click to select without following links.
   *
   * immediatelyRender:false suppresses a Next.js SSR hydration mismatch warning
   * because TipTap generates DOM nodes that differ between server and client.
   */
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? "Write your blog content here…" }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "blog-link" } }),
    ],
    content: value, // Initial HTML content loaded into the editor
    onUpdate: ({ editor }) => onChange(editor.getHTML()), // Notify parent on every change
    editorProps: {
      attributes: {
        // Inline styles applied to the actual contenteditable div
        style: [
          "min-height:360px",
          "padding:16px",
          "outline:none",
          "font-family:var(--sp-font-sans,sans-serif)",
          "font-size: 14px",
          "line-height:1.6",
          "color:#1E293B",
        ].join(";"),
      },
    },
  });

  /**
   * Sync external value changes into the editor.
   * This handles the case where the parent updates `value` from outside —
   * for example, when EditBlogPage fetches the blog data and sets state.
   * We compare the incoming value with the editor's current HTML to avoid
   * unnecessary resets that would destroy the undo history.
   * The `false` argument to setContent prevents the update from being added
   * to the editor's undo stack.
   */
  // Sync external value changes (e.g. when editing a loaded blog)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /**
   * setLink — opens a browser prompt for a URL and applies (or removes) a link
   * mark at the current selection.
   * - If the user cancels the prompt (null), nothing happens.
   * - If the user submits an empty string, any existing link is removed.
   * - Otherwise the link is applied to the selected text (or extended to include
   *   the full existing link range via extendMarkRange).
   *
   * useCallback prevents the function from being recreated on every render,
   * which is important since it's referenced in the toolbar JSX.
   */
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return; // User cancelled the prompt
    if (url === "") {
      // Empty URL = remove the link mark from the selection
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Don't render anything until TipTap has initialised its editor instance
  if (!editor) return null;

  return (
    <div
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      {/*
        Each button:
          - type="button" prevents accidental form submission
          - style={btn(editor.isActive(...))} highlights it when the format is active
          - onClick chains TipTap commands: focus() keeps the cursor in the editor,
            then the specific toggle command is applied
          - title provides a browser tooltip for accessibility
      */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: "8px 10px",
          borderBottom: "1px solid #E2E8F0",
          background: "#F8FAFC",
        }}
      >
        {/* Inline formatting */}
        <button
          type="button"
          style={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          style={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic size={14} />
        </button>

        {/* Vertical divider between button groups */}
        <div style={{ width: 1, background: "#E2E8F0", margin: "2px 4px" }} />

        {/* Headings — level 2 and level 3 (H1 is reserved for the page title) */}
        <button
          type="button"
          style={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          style={btn(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>

        <div style={{ width: 1, background: "#E2E8F0", margin: "2px 4px" }} />

        {/* Lists */}
        <button
          type="button"
          style={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          style={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <ListOrdered size={14} />
        </button>

        <div style={{ width: 1, background: "#E2E8F0", margin: "2px 4px" }} />

        {/* Block-level formatting */}
        <button
          type="button"
          style={btn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          style={btn(editor.isActive("code"))}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline code"
        >
          <Code size={14} />
        </button>
        {/* Horizontal rule — btn() with no argument renders it in inactive state always */}
        <button
          type="button"
          style={btn()}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={14} />
        </button>
        {/* Link — uses the custom setLink callback for URL prompting */}
        <button type="button" style={btn(editor.isActive("link"))} onClick={setLink} title="Link">
          <LinkIcon size={14} />
        </button>

        <div style={{ width: 1, background: "#E2E8F0", margin: "2px 4px" }} />

        {/* History */}
        <button
          type="button"
          style={btn()}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          style={btn()}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* ── Editor area ─────────────────────────────────────────────────────── */}
      {/* EditorContent renders TipTap's ProseMirror contenteditable surface */}
      <EditorContent editor={editor} />

      {/* ── Scoped content styles ───────────────────────────────────────────── */}
      {/*
        TipTap renders inside a .tiptap class. These styles target the rendered
        HTML nodes produced by TipTap's schema (headings, lists, blockquotes, etc.)
        and the placeholder extension's pseudo-element.
        We scope to .tiptap to avoid leaking into the rest of the page.
      */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #94A3B8;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .tiptap h2 { font-size: 1.4em; font-weight: 700; margin: 1em 0 0.4em; }
        .tiptap h3 { font-size: 1.15em; font-weight: 700; margin: 1em 0 0.4em; }
        .tiptap ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap blockquote { border-left: 3px solid #CBD5E1; padding-left: 1em; color: #64748B; margin: 1em 0; }
        .tiptap code { background: #F1F5F9; padding: 0.1em 0.35em; border-radius: 3px; font-size: 0.9em; }
        .tiptap a.blog-link { color: #3C50E0; text-decoration: underline; }
        .tiptap hr { border: none; border-top: 1px solid #E2E8F0; margin: 1.2em 0; }
      `}</style>
    </div>
  );
}
