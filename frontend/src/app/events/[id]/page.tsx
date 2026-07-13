"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar, Tag, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

interface Event {
  id: string;
  title: string;
  description: string;
  city: string;
  venue?: string;
  eventDate: string;
  tag: string;
  capacity?: number;
  status: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid var(--sp-gray-300)",
  borderRadius: 6,
  fontSize: 12,
  color: "var(--sp-gray-900)",
  fontFamily: "var(--sp-font-sans)",
  boxSizing: "border-box",
  outline: "none",
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => setEvent(d.data as Event))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = (await res.json()) as { message?: string };
        throw new Error(d.message ?? "Registration failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--sp-fg-muted)", fontFamily: "var(--sp-font-sans)" }}>
          Loading event…
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--sp-fg-muted)", fontFamily: "var(--sp-font-sans)" }}>
          Event not found.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--sp-navy-800), var(--sp-navy-1000))",
          paddingTop: "clamp(56px, 8vw, 80px)",
          paddingBottom: "clamp(56px, 8vw, 80px)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "var(--sp-gold-500)",
          }}
        />
        <Container>
          <div
            style={{
              display: "inline-block",
              background: "rgba(201,161,74,0.18)",
              color: "var(--sp-gold-400)",
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 9.4,
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontFamily: "var(--sp-font-sans)",
              marginBottom: 16,
            }}
          >
            {event.tag}
          </div>
          <h1
            style={{
              fontFamily: "var(--sp-font-display)",
              fontSize: "clamp(24px, 3.42vw, 41px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              margin: "0 0 24px",
              maxWidth: 700,
            }}
          >
            {event.title}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {[
              {
                icon: Calendar,
                text: new Date(event.eventDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
              { icon: MapPin, text: event.venue ? `${event.venue}, ${event.city}` : event.city },
              { icon: Tag, text: event.status.charAt(0).toUpperCase() + event.status.slice(1) },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--sp-navy-300)",
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 12,
                }}
              >
                <Icon size={15} strokeWidth={1.5} color="var(--sp-gold-400)" />
                {text}
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Body */}
      <Section py={72}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Description */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--sp-font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#000",
                  marginBottom: 16,
                }}
              >
                About this event
              </h2>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 13.7,
                  lineHeight: 1.35,
                  color: "var(--sp-gray-700)",
                }}
              >
                {event.description}
              </p>
              {event.capacity && (
                <p
                  style={{
                    marginTop: 20,
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 12,
                    color: "var(--sp-gray-600)",
                  }}
                >
                  Limited to <strong>{event.capacity}</strong> attendees.
                </p>
              )}
            </div>

            {/* Registration Form */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--sp-gray-200)",
                borderRadius: 12,
                padding: "clamp(20px, 4vw, 32px)",
                boxShadow: "var(--sp-shadow-md)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 18.8,
                  fontWeight: 500,
                  color: "#000",
                  margin: "0 0 6px",
                }}
              >
                Request an invitation
              </h3>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 12,
                  color: "var(--sp-gray-600)",
                  margin: "0 0 20px",
                }}
              >
                Fill in your details and our team will get back to you.
              </p>

              {submitted ? (
                <div
                  style={{
                    background: "var(--sp-gold-100)",
                    border: "1px solid var(--sp-gold-300)",
                    borderRadius: 8,
                    padding: "16px 20px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 12.8,
                      color: "var(--sp-gold-900)",
                      margin: 0,
                    }}
                  >
                    Thank you! Your registration request has been received. We&apos;ll be in touch
                    soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        style={{
                          fontSize: 10.2,
                          fontWeight: 600,
                          color: "var(--sp-gray-700)",
                          display: "block",
                          marginBottom: 5,
                        }}
                      >
                        Full Name *
                      </label>
                      <input
                        style={inputStyle}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Aarav Mehta"
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 10.2,
                          fontWeight: 600,
                          color: "var(--sp-gray-700)",
                          display: "block",
                          marginBottom: 5,
                        }}
                      >
                        Work Email *
                      </label>
                      <input
                        type="email"
                        style={inputStyle}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="aarav@company.in"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        style={{
                          fontSize: 10.2,
                          fontWeight: 600,
                          color: "var(--sp-gray-700)",
                          display: "block",
                          marginBottom: 5,
                        }}
                      >
                        Company
                      </label>
                      <input
                        style={inputStyle}
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 10.2,
                          fontWeight: 600,
                          color: "var(--sp-gray-700)",
                          display: "block",
                          marginBottom: 5,
                        }}
                      >
                        Phone
                      </label>
                      <input
                        style={inputStyle}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98xxx xxxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 10.2,
                        fontWeight: 600,
                        color: "var(--sp-gray-700)",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      Message (optional)
                    </label>
                    <textarea
                      style={{
                        ...inputStyle,
                        padding: "10px 14px",
                        minHeight: 80,
                        resize: "vertical",
                      }}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us a bit about yourself and why you'd like to attend…"
                    />
                  </div>
                  {error && (
                    <p style={{ fontSize: 11.2, color: "var(--sp-danger-500)", margin: 0 }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 24px",
                      background: "var(--sp-navy-900)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 12.8,
                      fontWeight: 600,
                      cursor: submitting ? "wait" : "pointer",
                      marginTop: 4,
                    }}
                  >
                    {submitting ? "Submitting…" : "Submit Request"}
                    {!submitting && <ArrowRight size={15} strokeWidth={1.5} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
