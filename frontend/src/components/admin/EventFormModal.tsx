/**
 * EventFormModal — /components/admin/EventFormModal.tsx
 *
 * WHY THIS FILE EXISTS:
 * Creating and editing events share the same set of fields, validation rules,
 * and API calls. This modal component handles both workflows in one place by
 * checking whether an existing event object was passed in (`event?.id` present
 * means edit mode; absent means create mode).
 *
 * WHAT IT RENDERS:
 * A fixed-position full-screen overlay with a centred white card containing:
 *   - A modal header with the dynamic title ("Create Event" / "Edit Event") + close button
 *   - A form with fields: title, description, city, venue, date, capacity, tag, status
 *   - An error message area (shown if the API call fails)
 *   - Cancel / Save action buttons in the footer
 *
 * OVERLAY CLICK-TO-CLOSE:
 * Clicking the dark overlay backdrop calls onClose. The inner card calls
 * e.stopPropagation() so clicks inside the card don't bubble up and close it.
 *
 * FORM STATE:
 * All field values live in a single `form` state object, updated by the generic
 * `set(key, value)` helper to avoid one useState per field.
 *
 * API BEHAVIOUR:
 * On submit, the date string from the <input type="date"> is converted to a
 * full ISO 8601 timestamp before being sent to the API. If capacity is blank it
 * is sent as `undefined` (omitted) rather than 0.
 *
 * HOW IT FITS:
 * Rendered conditionally in EventsAdminPage when the admin clicks "Create Event"
 * or the pencil icon on an existing row. After a successful save, `onSaved()` is
 * called so the parent can close the modal and refresh the events list.
 */

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

/**
 * EventData — the shape of an existing event passed in for editing.
 * All fields are optional because a new event has no pre-existing data.
 */
interface EventData {
  id?: string;
  title?: string;
  description?: string;
  city?: string;
  venue?: string;
  eventDate?: string;
  tag?: string;
  capacity?: number;
  status?: string;
}

/** Props accepted by EventFormModal */
interface Props {
  /**
   * Existing event data when editing.
   * If undefined (or has no `id`), the modal operates in "create" mode.
   */
  event?: EventData;
  /** Called when the modal should be dismissed without saving. */
  onClose: () => void;
  /** Called after a successful create or update API call. Parent should refresh data. */
  onSaved: () => void;
}

/**
 * inputStyle — shared inline style for all form inputs, textareas, and selects.
 * Defined once here and spread onto each element to keep the form DRY.
 */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  fontSize: 14,
  color: "#1E293B",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box", // Include padding in the width calculation
};

/**
 * EventFormModal
 *
 * A centred overlay modal for creating or editing a Summentor Pro event.
 * Operates in create mode when `event` is undefined, edit mode when `event.id`
 * is present.
 */
export default function EventFormModal({ event, onClose, onSaved }: Props) {
  // Determine mode based on whether we received an event with an ID
  const isEdit = !!event?.id;

  /**
   * form — unified state object for all controlled inputs.
   * Pre-populated from the `event` prop (edit mode) or empty defaults (create mode).
   * eventDate is stored as a plain "YYYY-MM-DD" string for the date input.
   * The "T" split strips the time portion from the ISO timestamp returned by the API.
   */
  const [form, setForm] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    city: event?.city ?? "",
    venue: event?.venue ?? "",
    eventDate: event?.eventDate ? event.eventDate.split("T")[0]! : "",
    tag: event?.tag ?? "FLAGSHIP",
    capacity: event?.capacity ?? "",
    status: event?.status ?? "upcoming",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * set — generic field updater that merges a single key-value pair into form state.
   * Using a generic updater avoids needing separate onChange handlers for every field.
   */
  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * handleSubmit — validates, transforms, and submits the form.
   * Converts the date string to an ISO timestamp (required by the API).
   * Converts capacity to a number (or omits it if blank).
   * Calls adminApi.createEvent or adminApi.updateEvent depending on mode.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        // Convert "YYYY-MM-DD" to a full ISO 8601 string for the backend
        eventDate: new Date(form.eventDate).toISOString(),
        // Coerce capacity to a number; omit entirely if the field was left blank
        capacity: form.capacity ? Number(form.capacity) : undefined,
      };
      if (isEdit) {
        await adminApi.updateEvent(event!.id!, payload);
      } else {
        await adminApi.createEvent(payload);
      }
      onSaved(); // Notify parent to close modal and refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    /* ── Full-screen backdrop ───────────────────────────────────────────────── */
    /*
      The backdrop covers the entire viewport with a semi-transparent overlay.
      Clicking it calls onClose so the modal can be dismissed without scrolling
      to find a close button.
    */
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, // Ensure modal sits above all page content
        padding: 24,
      }}
      onClick={onClose}
    >
      {/* ── Modal card ────────────────────────────────────────────────────────── */}
      {/*
        stopPropagation prevents clicks inside the card from reaching the backdrop,
        which would close the modal unexpectedly.
      */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflow: "auto", // Scroll the card itself if content is taller than viewport
          padding: 28,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal header ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E293B" }}>
            {/* Dynamic title: "Edit Event" when updating, "Create Event" when creating */}
            {isEdit ? "Edit Event" : "Create Event"}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title — full width, required */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: 4,
              }}
            >
              Title *
            </label>
            <input
              style={inputStyle}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          {/* Description — textarea so admins can write multi-line text */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: 4,
              }}
            >
              Description *
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>

          {/* City + Venue — side by side in a 2-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                City *
              </label>
              <input
                style={inputStyle}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                required
              />
            </div>
            <div>
              {/* Venue is optional — no asterisk */}
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Venue
              </label>
              <input
                style={inputStyle}
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
              />
            </div>
          </div>

          {/* Event Date + Capacity — side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Event Date *
              </label>
              {/* type="date" renders the browser's native date picker */}
              <input
                type="date"
                style={inputStyle}
                value={form.eventDate}
                onChange={(e) => set("eventDate", e.target.value)}
                required
              />
            </div>
            <div>
              {/* Capacity is optional — if left blank it is omitted from the payload */}
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Capacity
              </label>
              <input
                type="number"
                style={inputStyle}
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
                min={1}
              />
            </div>
          </div>

          {/* Tag + Status — side by side dropdowns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Tag *
              </label>
              <select
                style={inputStyle}
                value={form.tag}
                onChange={(e) => set("tag", e.target.value)}
              >
                {["FLAGSHIP", "WORKING SESSION", "ROUNDTABLE", "WORKSHOP", "SUMMIT"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Status
              </label>
              <select
                style={inputStyle}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {["upcoming", "ongoing", "completed", "cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message — only rendered when the API call fails */}
          {error && <p style={{ color: "#EF4444", fontSize: 13 }}>{error}</p>}

          {/* ── Form footer actions ─────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            {/* Cancel — closes without saving */}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: "#fff",
                color: "#64748B",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            {/* Submit — label changes based on mode and loading state */}
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "none",
                background: "#3C50E0",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "Saving…" : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
