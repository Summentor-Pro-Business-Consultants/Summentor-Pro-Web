"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import Typewriter from "@/components/ui/Typewriter";
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
  service: string;
  referralSource: string;
  country: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  designation: "",
  organisation: "",
  email: "",
  phone: "",
  industrySector: "",
  service: "",
  referralSource: "",
  country: "",
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
        clipPath:
          "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >
      <Image
        src="/images/engagements/meeting-cm-delhi.jpeg"
        alt=""
        aria-hidden="true"
        fill
        quality={92}
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

      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{
            position: "relative",
            textAlign: "center",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <motion.div variants={fadeUp}>
            <span
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#fff",
                textTransform: "uppercase",
                borderBottom: "2px solid #fff",
                paddingBottom: 4,
              }}
            >
              CONTACT US
            </span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginTop: 28 }}>
            <PageHeading>
              START YOUR JOURNEY WITH
              <br />
              <span
                style={{
                  background: "var(--sp-green-500)",
                  color: "var(--sp-navy-900)",
                  padding: "0 14px",
                  display: "inline-block",
                  marginTop: -10,
                  transform: "rotate(-3deg)",
                  transformOrigin: "center",
                }}
              >
                <Typewriter text="SUMMENTOR PRO" startDelay={550} />
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

      const payload: Record<string, string> = {
        firstName,
        lastName,
        organisation: form.organisation,
        email: form.email,
        industrySector: form.industrySector,
        designation: form.designation,
        phone: form.phone,
        location: form.country,
        referralSource: form.referralSource,
        budget: form.service,
        message: form.message,
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
        backgroundImage:
          "linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
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
                border: "1px solid var(--sp-green-500)",
                borderRadius: 12,
                padding: "32px 28px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--sp-green-800)",
                  margin: "0 0 8px",
                }}
              >
                Thanks — we&apos;ll be in touch.
              </h3>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 15,
                  color: "var(--sp-green-900)",
                  margin: 0,
                  lineHeight: 1.6,
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
                <Field label="Designation">
                  <input
                    type="text"
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
                </Field>
                <Field label="Which service would you like to avail?">
                  <select value={form.service} onChange={set("service")} style={inputStyle}>
                    <option value="">— Select —</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="How did you hear about us?">
                  <select
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
                </Field>
                <Field label="Country" className="md:col-span-2">
                  <input
                    type="text"
                    value={form.country}
                    onChange={set("country")}
                    placeholder="Country"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ marginTop: 20 }}>
                <Field label="Message">
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us briefly what you're looking to explore"
                    style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical" }}
                  />
                </Field>
              </div>

              {error && (
                <p
                  style={{
                    color: "#B91C1C",
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 14,
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
                    padding: "14px 40px",
                    borderRadius: 999,
                    border: "1.5px solid var(--sp-green-600)",
                    background: "var(--sp-green-600)",
                    color: "#fff",
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 15,
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
  fontSize: 15,
  color: "var(--sp-navy-900)",
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
          fontSize: 13,
          fontWeight: 600,
          color: "var(--sp-navy-900)",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--sp-green-600)", marginLeft: 4 }}>*</span>}
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
        backgroundImage:
          "linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(40px, 6vw, 60px) 0 clamp(64px, 10vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="left" />
      <Container>
        <div style={{ textAlign: "center", marginBottom: 36, position: "relative" }}>
          <SectionHeading>
            SOLUTIONS DESIGNED FOR
            <br />
            <span style={{ color: "var(--sp-green-600)" }}>YOUR BUSINESS NEEDS</span>
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
            maxWidth: 1080,
            margin: "0 auto",
            borderRadius: 12,
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

          {/* Dark address card */}
          <div
            style={{
              background: "var(--sp-navy-900)",
              padding: "clamp(24px, 5vw, 36px) clamp(22px, 5vw, 40px)",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <img
                src="/brand/summentor-pro-logo.png"
                alt="Summentor Pro"
                style={{ height: 44, width: "auto", filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(15px, 1.8vw, 17px)",
                lineHeight: 1.6,
                color: "#EBEEF2",
                margin: "0 0 18px",
              }}
            >
              5th Block, SPD Plaza, #52, 1st Floor, Jyoti Nivas College Road,
              <br />
              Koramangala Industrial Layout, Bangalore, Karnataka, 560034.
            </p>
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 16,
                display: "flex",
                justifyContent: "center",
                gap: "clamp(16px, 4vw, 36px)",
                flexWrap: "wrap",
              }}
            >
              <a
                href="tel:08041574773"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 15,
                }}
              >
                <Phone size={16} color="var(--sp-green-400)" strokeWidth={2} />
                080-41574773
              </a>
              <a
                href="mailto:info@summentorpro.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 15,
                }}
              >
                <Mail size={16} color="var(--sp-green-400)" strokeWidth={2} />
                info@summentorpro.com
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
