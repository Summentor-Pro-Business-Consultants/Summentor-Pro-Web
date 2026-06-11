"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

// The five focus areas from the content file ("We focus on:").
const focusItems = [
  "Strategic business engagement",
  "Industry & government collaboration",
  "Curated networking opportunities",
  "High-intent business interactions",
  "Long-term ecosystem development",
];

export default function EngagementCTA() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const n = focusItems.length;
  const goTo = (i: number) => {
    setDir(i >= active ? 1 : -1);
    setActive(((i % n) + n) % n);
  };
  const prev = () => {
    setDir(-1);
    setActive((a) => (a - 1 + n) % n);
  };
  const next = () => {
    setDir(1);
    setActive((a) => (a + 1) % n);
  };

  // Auto-advance — paused on hover, disabled under reduced-motion.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => {
      setDir(1);
      setActive((a) => (a + 1) % n);
    }, 5000);
    return () => clearInterval(id);
  }, [reduceMotion, paused, n]);

  // The trio of cards currently on screen: previous, active (centre), next.
  const trio = [(active - 1 + n) % n, active, (active + 1) % n];

  return (
    <section
      style={{
        background: "#fff",
        paddingTop: "clamp(56px, 8vw, 80px)",
        paddingBottom: "clamp(56px, 8vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft atmospheric accent — fades in once on scroll */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: -120,
          right: -140,
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(5,161,113,0.10) 0%, rgba(5,161,113,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Soft green curved gradients glowing in from both edges */}
      <EdgeGreenGradient side="left" position="middle" />
      <EdgeGreenGradient side="right" position="bottom" />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Top text block — one self-contained reveal. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 64, textAlign: "center", position: "relative" }}
        >
          <SectionHeading>WHY SUMMENTOR PRO?</SectionHeading>

          {/* Brand wavy accent — directly beneath the main heading. */}
          <WavyLine />

          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(26px, 2.9vw, 36px)",
              fontWeight: 500,
              color: "#000",
              margin: "18px auto 28px",
              maxWidth: 880,
            }}
          >
            Why Businesses Partner with Us
          </p>

          {/* Exact line breaks per the design — hard-coded with <br/>. */}
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 2.6vw, 33px)",
              lineHeight: 1.6,
              color: "#000",
              margin: "0 auto",
              maxWidth: 1120,
            }}
          >
            At Summentor Pro, we believe growth happens when the
            <br />
            right people, ideas, and opportunities come together.
            <br />
            Our approach combines consulting, strategic engagement,
            <br />
            business networking, and ecosystem-building to create
            <br />
            platforms that generate real conversations and long-term value.
          </p>
        </motion.div>

        {/* WE FOCUS ON — subheading + wavy + carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center" }}
        >
          <SectionHeading>WE FOCUS ON:</SectionHeading>
          <WavyLine />

          {/* Carousel: prev arrow · three cards · next arrow */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px, 1.6vw, 22px)",
              marginTop: "clamp(32px, 4.5vw, 52px)",
            }}
          >
            <ArrowButton dir="prev" onClick={prev} />

            <div style={{ flex: 1, overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={active}
                  custom={dir}
                  initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "clamp(14px, 2vw, 28px)",
                    alignItems: "center",
                  }}
                >
                  {trio.map((idx, pos) => (
                    <FocusCard
                      key={idx}
                      label={focusItems[idx]}
                      center={pos === 1}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <ArrowButton dir="next" onClick={next} />
          </div>

          {/* Dash indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginTop: "clamp(24px, 3.5vw, 38px)",
            }}
          >
            {focusItems.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${item}`}
                  aria-current={isActive}
                  style={{
                    width: isActive ? 30 : 24,
                    height: 3,
                    borderRadius: 2,
                    background: isActive ? "var(--sp-green-500)" : "#334155",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── Single focus card ──────────────────────────────────────────────────────
function FocusCard({ label, center }: { label: string; center: boolean }) {
  return (
    <div
      style={{
        aspectRatio: "1.55 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px 22px",
        borderRadius: 0,
        background: center ? "#252525" : "#fff",
        border: center
          ? "4px solid var(--sp-green-500)"
          : "3px solid var(--sp-green-500)",
        transform: center ? "scale(1.06)" : "scale(1)",
        boxShadow: center
          ? "0 26px 50px -22px rgba(0,0,0,0.45)"
          : "0 6px 18px -10px rgba(0,0,0,0.12)",
        transition: "background 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(20px, 2.3vw, 29px)",
          fontWeight: 500,
          lineHeight: 1.3,
          color: center ? "#fff" : "var(--sp-green-700)",
          transition: "color 0.4s ease",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Round prev / next arrow ────────────────────────────────────────────────
function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      style={{
        flexShrink: 0,
        width: "clamp(38px, 4vw, 46px)",
        height: "clamp(38px, 4vw, 46px)",
        borderRadius: "50%",
        background: "#fff",
        border: `1.5px solid ${hover ? "var(--sp-green-500)" : "#000"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "border-color 0.25s ease",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={dir === "prev" ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19"}
          stroke={hover ? "var(--sp-green-600)" : "#000"}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
