"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const [paused, setPaused] = useState(false);

  const n = focusItems.length;

  // Measure the viewport so the active card centres with neighbours peeking in.
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1100);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setVw(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Three concatenated copies with `pos` in the middle copy → always content on
  // both sides. Silently snap back a copy-length (transition off) when it drifts
  // into a clone, for a seamless infinite loop.
  const [pos, setPos] = useState(n);
  const [animate, setAnimate] = useState(true);

  const goTo = (i: number) => {
    setAnimate(true);
    setPos(n + (((i % n) + n) % n));
  };
  const prev = () => {
    setAnimate(true);
    setPos((p) => p - 1);
  };
  const next = () => {
    setAnimate(true);
    setPos((p) => p + 1);
  };

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, 3200);
    return () => clearInterval(id);
  }, [reduceMotion, paused]);

  useEffect(() => {
    if (pos >= n && pos < 2 * n) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos((p) => (p >= 2 * n ? p - n : p + n));
    }, 560);
    return () => clearTimeout(t);
  }, [pos, n]);

  useEffect(() => {
    if (animate) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [animate]);

  const GAP = 24;
  const cardW = Math.min(vw * 0.4, 440);
  const step = cardW + GAP;
  const translate = vw / 2 - pos * step - cardW / 2;
  const items = [...focusItems, ...focusItems, ...focusItems];

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
              fontSize: "clamp(24px, 2.67vw, 33px)",
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
              fontSize: "clamp(22px, 2.39vw, 30px)",
              lineHeight: 1.35,
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

            <div ref={viewportRef} style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: GAP,
                  transform: `translateX(${translate}px)`,
                  transition: animate ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                  willChange: "transform",
                }}
              >
                {items.map((label, i) => (
                  <div key={i} style={{ flexShrink: 0, width: cardW }}>
                    <FocusCard label={label} center={i === pos} instant={!animate} />
                  </div>
                ))}
              </div>
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
              const isActive = i === ((pos % n) + n) % n;
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
                    background: isActive ? "#05a171" : "#334155",
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
function FocusCard({
  label,
  center,
  instant,
}: {
  label: string;
  center: boolean;
  instant?: boolean;
}) {
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
        background: center ? "#141414" : "#fff",
        border: center ? "4px solid #05a171" : "3px solid #05a171",
        transform: center ? "scale(1.06)" : "scale(1)",
        boxShadow: center
          ? "0 26px 50px -22px rgba(0,0,0,0.45)"
          : "0 6px 18px -10px rgba(0,0,0,0.12)",
        transition: instant
          ? "none"
          : "background 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(18px, 2.12vw, 27px)",
          fontWeight: 500,
          lineHeight: 1.2,
          color: center ? "#fff" : "#05a171",
          transition: instant ? "none" : "color 0.4s ease",
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
        border: `1.5px solid ${hover ? "#05a171" : "#000"}`,
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
          stroke={hover ? "#05a171" : "#000"}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
