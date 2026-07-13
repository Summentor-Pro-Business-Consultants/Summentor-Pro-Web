"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

// ─── Design system (matches About / Solutions / Platforms) ─────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CARD_TRANSITION = `background 0.45s ${HOVER_CSS_EASE}, border-color 0.45s ${HOVER_CSS_EASE}, box-shadow 0.45s ${HOVER_CSS_EASE}`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// Backend schema (industry sector enum)
const INDUSTRY_SECTORS = [
  "IT",
  "Healthcare",
  "Services",
  "Education",
  "Manufacturing",
  "NGO",
  "Others",
] as const;

const SERVICE_OPTIONS = [
  "Strategic Consulting",
  "Govt. & Industry Facilitation",
  "Business Ecosystems",
  "Business Networking",
  "Brand & Market Growth",
];

const REFERRAL_OPTIONS = [
  "Google Search",
  "LinkedIn",
  "Referral / Word of Mouth",
  "Event / Platform",
  "Other",
];

interface FormState {
  fullName: string;
  designation: string;
  organisation: string;
  email: string;
  phone: string;
  industrySector: string;
  industrySectorOther: string;
  service: string;
  referralSource: string;
  referralOther: string;
  city: string;
  state: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  designation: "",
  organisation: "",
  email: "",
  phone: "",
  industrySector: "",
  industrySectorOther: "",
  service: "",
  referralSource: "",
  referralOther: "",
  city: "",
  state: "",
  message: "",
};

export default function ContactSection() {
  return (
    <>
      <Hero />
      <FormBlock />
      <LocationBlock />
    </>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--sp-dark-grad-a)",
        paddingTop: "clamp(56px, 8vw, 80px)",
        paddingBottom: "clamp(72px, 11vw, 120px)",
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
      }}
    >
      <Image
        src="/images/engagements/meeting-cm-delhi.jpeg"
        alt=""
        aria-hidden="true"
        fill
        quality={100}
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center", opacity: 0.22 }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.8) 60%, #080808 100%)",
        }}
      />

      <Container wide>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{
            position: "relative",
            textAlign: "center",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              dark
              style={{
                display: "inline-block",
                fontSize: "clamp(21px, 3.08vw, 37px)",
                fontWeight: 600,
                borderBottom: "3px solid #fff",
                paddingBottom: 10,
              }}
            >
              CONTACT US
            </SectionHeading>
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginTop: 28 }}>
            <PageHeading style={{ fontSize: "clamp(26px, 4.45vw, 55px)" }}>
              <span style={{ display: "block", fontWeight: 600 }}>START YOUR JOURNEY WITH</span>
              <span
                style={{
                  background: "var(--sp-green)",
                  color: "#000",
                  display: "inline-block",
                  padding: "13px 8px",
                  marginTop: -6,
                  // Trapezium: vertical, parallel side edges; taller on the
                  // right (same as the About / Solutions headings).
                  clipPath: "polygon(0 13px, 100% 0, 100% 100%, 0 calc(100% - 13px))",
                }}
              >
                SUMMENTOR PRO
              </span>
            </PageHeading>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── Form ───────────────────────────────────────────────────────────────────
function FormBlock() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Backend requires firstName + lastName separately — split Full Name.
      const parts = form.fullName.trim().split(/\s+/);
      const firstName = parts[0] ?? "";
      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "—";

      // City + State combine into the free-text `location` field.
      const location = [form.city, form.state]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ");

      // referralSource is a free string on the backend, so a custom "Other"
      // value can be sent directly.
      const referralSource =
        form.referralSource === "Other"
          ? form.referralOther.trim() || "Other"
          : form.referralSource;

      // industrySector is a strict enum on the backend, so a custom "Others"
      // category is folded into the message instead of replacing the enum.
      const categoryDetail =
        form.industrySector === "Others" && form.industrySectorOther.trim()
          ? `[Category: ${form.industrySectorOther.trim()}] `
          : "";

      const payload: Record<string, string> = {
        firstName,
        lastName,
        organisation: form.organisation,
        email: form.email,
        industrySector: form.industrySector,
        designation: form.designation,
        phone: form.phone,
        location,
        referralSource,
        budget: form.service,
        message: `${categoryDetail}${form.message}`.trim(),
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? "Failed to submit");
      }
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Failed to submit"
          ? err.message
          : "Something went wrong. Please email us at info@summentorpro.com",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container>
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}
        >
          {submitted ? (
            <motion.div
              variants={fadeUp}
              style={{
                background: "var(--sp-green-100)",
                border: "1px solid var(--sp-green)",
                borderRadius: 12,
                padding: "32px 28px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 18.8,
                  fontWeight: 700,
                  color: "var(--sp-green)",
                  margin: "0 0 8px",
                }}
              >
                Thanks — we&apos;ll be in touch.
              </h3>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 12.8,
                  color: "var(--sp-green)",
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                Your message has reached the team. We typically respond within 1–2 business days.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={set("fullName")}
                    placeholder="Full Name"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Designation" required>
                  <input
                    type="text"
                    required
                    value={form.designation}
                    onChange={set("designation")}
                    placeholder="Designation"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Organization" required>
                  <input
                    type="text"
                    required
                    value={form.organisation}
                    onChange={set("organisation")}
                    placeholder="Organization"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Email Address"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="Phone Number"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Select The Category" required>
                  <select
                    required
                    value={form.industrySector}
                    onChange={set("industrySector")}
                    style={inputStyle}
                  >
                    <option value="">— Select —</option>
                    {INDUSTRY_SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {/* Nested inside the same grid cell so revealing it grows the
                      cell in place instead of reshuffling the grid columns. */}
                  {form.industrySector === "Others" && (
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={form.industrySectorOther}
                      onChange={set("industrySectorOther")}
                      placeholder="Please specify your category"
                      style={{ ...inputStyle, marginTop: 10 }}
                    />
                  )}
                </Field>
                <Field label="Which service would you like to avail?" required>
                  <select
                    required
                    value={form.service}
                    onChange={set("service")}
                    style={inputStyle}
                  >
                    <option value="">— Select —</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="How did you hear about us?" required>
                  <select
                    required
                    value={form.referralSource}
                    onChange={set("referralSource")}
                    style={inputStyle}
                  >
                    <option value="">— Select —</option>
                    {REFERRAL_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {/* Nested inside the same grid cell so revealing it grows the
                      cell in place instead of reshuffling the grid columns. */}
                  {form.referralSource === "Other" && (
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={form.referralOther}
                      onChange={set("referralOther")}
                      placeholder="Please specify"
                      style={{ ...inputStyle, marginTop: 10 }}
                    />
                  )}
                </Field>
                <Field label="City" required>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={set("city")}
                    placeholder="City"
                    style={inputStyle}
                  />
                </Field>
                <Field label="State" required>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={set("state")}
                    placeholder="State"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ marginTop: 20 }}>
                <Field label="Message" required>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us briefly what you're looking to explore"
                    style={{
                      ...inputStyle,
                      height: "auto",
                      padding: "12px 14px",
                      resize: "vertical",
                    }}
                  />
                </Field>
              </div>

              {error && (
                <p
                  style={{
                    color: "#B91C1C",
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 12,
                    margin: "16px 0 0",
                    textAlign: "center",
                  }}
                >
                  {error}
                </p>
              )}

              <div style={{ marginTop: 28, textAlign: "center" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: "inline-block",
                    padding: "11px 46px",
                    borderRadius: 999,
                    border: "1.5px solid var(--sp-green)",
                    background: "var(--sp-green)",
                    color: "#000",
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 23.1,
                    fontWeight: 600,
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: CARD_TRANSITION,
                  }}
                >
                  {submitting ? "Submitting…" : "Submit Form"}
                </button>
              </div>
            </>
          )}
        </motion.form>
      </Container>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 14px",
  fontFamily: "var(--sp-font-sans)",
  fontSize: 12.8,
  color: "#000",
  background: "#F4F5F7",
  border: "1px solid transparent",
  borderRadius: 6,
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s ease, background 0.2s ease",
};

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontFamily: "var(--sp-font-sans)",
          fontSize: 11.2,
          fontWeight: 600,
          color: "#000",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--sp-green)", marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </motion.div>
  );
}

// ─── Location (map + address card) ──────────────────────────────────────────
function LocationBlock() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(40px, 6vw, 60px) 0 clamp(64px, 10vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="left" />
      <Container wide>
        <div style={{ textAlign: "center", marginBottom: 36, position: "relative" }}>
          <SectionHeading>
            SOLUTIONS DESIGNED FOR
            <br />
            <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>
              YOUR BUSINESS NEEDS
            </span>
          </SectionHeading>
          <WavyLine />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            position: "relative",
            maxWidth: 1340,
            margin: "0 auto",
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "0 12px 36px rgba(10,10,10,0.10)",
          }}
        >
          {/* Embedded map */}
          <iframe
            title="Summentor Pro office location"
            src="https://maps.google.com/maps?q=5th+Block+SPD+Plaza+Koramangala+Bangalore&output=embed"
            style={{
              border: 0,
              width: "100%",
              height: "clamp(260px, 38vw, 380px)",
              display: "block",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </Container>
    </section>
  );
}
