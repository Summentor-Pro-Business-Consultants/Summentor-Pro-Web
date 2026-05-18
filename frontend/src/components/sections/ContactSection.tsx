"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

const contactInfo = [
  { icon: Mail, text: "info@summentorpro.com", href: "mailto:info@summentorpro.com" },
  { icon: Phone, text: "080-41574773", href: "tel:08041574773" },
  {
    icon: MapPin,
    text: "5th Block, SPD Plaza, #52, 1st Floor, Jyoti Nivas College Road, Koramangala, Bangalore 560034",
    href: "https://maps.google.com/?q=Koramangala+Bangalore",
  },
];

const INDUSTRY_SECTORS = [
  "IT",
  "Healthcare",
  "Services",
  "Education",
  "Manufacturing",
  "NGO",
  "Others",
] as const;

type FormState = {
  organisation: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  phone: string;
  location: string;
  industrySector: string;
  referralSource: string;
  budget: string;
  message: string;
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
    organisation: "",
    firstName: "",
    lastName: "",
    designation: "",
    email: "",
    phone: "",
    location: "",
    industrySector: "",
    referralSource: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload: Record<string, string> = { ...form };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
      });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? "Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message !== "Failed to submit"
          ? err.message
          : "Something went wrong. Please email us directly at info@summentorpro.com",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    padding: "0 12px",
    fontFamily: "var(--sp-font-sans)",
    fontSize: 14,
    color: "var(--sp-gray-900)",
    background: "#fff",
    border: "1px solid var(--sp-gray-300)",
    borderRadius: "var(--sp-radius)",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sp-font-sans)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.04em",
    color: "var(--sp-gray-700)",
    display: "block",
    marginBottom: 6,
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "var(--sp-gold-500)");
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "var(--sp-gray-300)");

  return (
    <Section dark py={80}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: headline + contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            style={{ paddingTop: 8 }}
          >
            <Eyebrow gold={false} style={{ color: "var(--sp-gold-500)" }}>
              GET IN TOUCH
            </Eyebrow>

            <h1
              style={{
                fontFamily: "var(--sp-font-serif)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 400,
                letterSpacing: "var(--sp-track-display)",
                lineHeight: 1.1,
                color: "#fff",
                marginTop: 16,
                maxWidth: 480,
              }}
            >
              Let&apos;s start a conversation.
            </h1>

            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--sp-navy-300)",
                marginTop: 20,
                maxWidth: 420,
              }}
            >
              Whether you&apos;re looking for strategic consulting, event partnerships, or want to
              explore how Summentor Pro can help grow your business — we&apos;d love to hear from
              you.
            </p>

            {/* Divider */}
            <div
              style={{
                width: 40,
                height: 2,
                background: "var(--sp-gold-500)",
                margin: "32px 0",
                borderRadius: 1,
              }}
            />

            <div className="flex flex-col gap-5">
              {contactInfo.map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex gap-4 items-start">
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "var(--sp-radius)",
                      border: "1px solid var(--sp-navy-700)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--sp-gold-500)",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <a
                    href={href}
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 14,
                      color: "var(--sp-navy-200)",
                      textDecoration: "none",
                      paddingTop: 9,
                      lineHeight: 1.55,
                    }}
                  >
                    {text}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Card padding={32} style={{ background: "#fff", color: "var(--sp-navy-900)" }}>
              <h2
                style={{
                  fontFamily: "var(--sp-font-serif)",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "var(--sp-navy-900)",
                  marginBottom: 4,
                }}
              >
                Send a Request
              </h2>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 13,
                  color: "var(--sp-gray-500)",
                  marginBottom: 20,
                }}
              >
                Fields marked <span style={{ color: "var(--sp-danger-500)" }}>*</span> are
                required.
              </p>

              {submitted ? (
                <div
                  className="flex items-center gap-3 p-4 rounded"
                  style={{
                    background: "var(--sp-gold-100)",
                    border: "1px solid var(--sp-gold-300)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 15,
                      color: "var(--sp-gold-900)",
                    }}
                  >
                    Thank you! We&apos;ll be in touch within 24 hours.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Organisation */}
                  <div>
                    <label style={labelStyle}>
                      Organisation <span style={{ color: "var(--sp-danger-500)" }}>*</span>
                    </label>
                    <input
                      required
                      value={form.organisation}
                      onChange={set("organisation")}
                      placeholder="Your Company or Organisation"
                      style={inputStyle}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>

                  {/* First Name + Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>
                        First Name <span style={{ color: "var(--sp-danger-500)" }}>*</span>
                      </label>
                      <input
                        required
                        value={form.firstName}
                        onChange={set("firstName")}
                        placeholder="Aarav"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        Last Name <span style={{ color: "var(--sp-danger-500)" }}>*</span>
                      </label>
                      <input
                        required
                        value={form.lastName}
                        onChange={set("lastName")}
                        placeholder="Mehta"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                  </div>

                  {/* Designation + Industry Sector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Designation</label>
                      <input
                        value={form.designation}
                        onChange={set("designation")}
                        placeholder="CEO, Founder, Director…"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        Industry Sector <span style={{ color: "var(--sp-danger-500)" }}>*</span>
                      </label>
                      <select
                        required
                        value={form.industrySector}
                        onChange={set("industrySector")}
                        style={{ ...inputStyle, appearance: "auto", cursor: "pointer" }}
                        onFocus={focus}
                        onBlur={blur}
                      >
                        <option value="" disabled>
                          Select sector…
                        </option>
                        {INDUSTRY_SECTORS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>
                        Email Address <span style={{ color: "var(--sp-danger-500)" }}>*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="aarav@example.in"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="+91 98765 43210"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                  </div>

                  {/* Location + Referral Source */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input
                        value={form.location}
                        onChange={set("location")}
                        placeholder="City, State"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Budget</label>
                      <input
                        value={form.budget}
                        onChange={set("budget")}
                        placeholder="e.g. ₹5–10 Lakhs / month"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                      />
                    </div>
                  </div>

                  {/* Referral Source — full width */}
                  <div>
                    <label style={labelStyle}>How did you hear about us?</label>
                    <input
                      value={form.referralSource}
                      onChange={set("referralSource")}
                      placeholder="Referral, LinkedIn, Event, Search…"
                      style={inputStyle}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label style={labelStyle}>Additional Details</label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us about your business and what you're looking to achieve…"
                      style={{
                        ...inputStyle,
                        height: "auto",
                        padding: "10px 12px",
                        resize: "none",
                      }}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>

                  {submitError && (
                    <p
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 13,
                        color: "var(--sp-danger-500)",
                      }}
                    >
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={submitting ? undefined : <ArrowRight size={16} strokeWidth={1.5} />}
                  >
                    {submitting ? "Sending…" : "Send Request"}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
